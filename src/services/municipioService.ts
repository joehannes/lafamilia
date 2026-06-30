// Service to detect municipios from geographic coordinates using Nominatim API

import { DEFAULT_MUNICIPIO_MULTIPLIERS } from '../data/municipioPriceMultipliers';

interface NominatimReverseResponse {
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
    county?: string;
    state?: string;
    [key: string]: string | undefined;
  };
  display_name?: string;
  error?: string;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Reverse geocode coordinates to find the municipio (city/municipality)
 * Returns the municipio name if found, or null if not detected
 */
export async function detectMunicipio(lat: number, lng: number): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: String(lat),
      lon: String(lng),
      zoom: '10',
      'accept-language': 'es,en',
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': 'MazBlancoTours/1.0' },
    });

    if (!response.ok) {
      console.warn('Nominatim reverse geocode failed:', response.status);
      return null;
    }

    const data: NominatimReverseResponse = await response.json();

    if (data.error || !data.address) {
      console.warn('Nominatim error or no address:', data.error);
      return null;
    }

    // Try to extract municipio from various possible fields
    // Priority: municipality (admin boundary) > city > town > county
    // This is important because for places like Punta Cana Airport (PUJ),
    // Nominatim returns city="Punta Cana" but municipality="Higüey" — we
    // want the actual administrative municipio (Higüey) for pricing.
    const address = data.address;
    let candidateMunicipio = 
      address.municipality || 
      address.city || 
      address.town || 
      address.county;

    if (!candidateMunicipio) {
      return null;
    }

    // Normalize the candidate: remove leading/trailing spaces, handle common variations
    let normalized = candidateMunicipio.trim();

    // Check for exact match in our multipliers
    if (DEFAULT_MUNICIPIO_MULTIPLIERS[normalized] !== undefined) {
      return normalized;
    }

    // Check for close matches (case-insensitive)
    const lowerNormalized = normalized.toLowerCase();
    for (const municipio of Object.keys(DEFAULT_MUNICIPIO_MULTIPLIERS)) {
      if (municipio.toLowerCase() === lowerNormalized) {
        return municipio;
      }
    }

    // Try to find by prefix match (e.g., "San Cristóbal" vs "San Cristobal")
    for (const municipio of Object.keys(DEFAULT_MUNICIPIO_MULTIPLIERS)) {
      // Remove accents and compare
      const cleanNormalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cleanMunicipio = municipio.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (cleanMunicipio.toLowerCase() === cleanNormalized.toLowerCase()) {
        return municipio;
      }
    }

    // Log for debugging
    console.debug(`Could not find municipio match for: "${normalized}"`);
    return null;
  } catch (error) {
    console.error('Error detecting municipio:', error);
    return null;
  }
}

/**
 * Find the best matching municipio from a search query
 * Useful for autocomplete suggestions
 */
export function findMunicipio(query: string): string | null {
  if (!query || query.length === 0) return null;

  const normalized = query.trim().toLowerCase();

  // Exact match (case-insensitive)
  for (const municipio of Object.keys(DEFAULT_MUNICIPIO_MULTIPLIERS)) {
    if (municipio.toLowerCase() === normalized) {
      return municipio;
    }
  }

  // Prefix match
  for (const municipio of Object.keys(DEFAULT_MUNICIPIO_MULTIPLIERS)) {
    if (municipio.toLowerCase().startsWith(normalized)) {
      return municipio;
    }
  }

  // Remove accents and try again
  const cleanNormalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const municipio of Object.keys(DEFAULT_MUNICIPIO_MULTIPLIERS)) {
    const cleanMunicipio = municipio.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (cleanMunicipio.toLowerCase().startsWith(cleanNormalized)) {
      return municipio;
    }
  }

  return null;
}

/**
 * Get suggestions for municipio autocomplete
 */
export function getMunicipioCandidates(query: string): string[] {
  if (!query || query.length === 0) return [];

  const normalized = query.trim().toLowerCase();
  const cleanNormalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const candidates = Object.keys(DEFAULT_MUNICIPIO_MULTIPLIERS).filter((municipio) => {
    const cleanMunicipio = municipio.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return cleanMunicipio.toLowerCase().includes(cleanNormalized);
  });

  // Sort by relevance: exact match first, then prefix match, then contains
  candidates.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    if (aLower === normalized) return -1;
    if (bLower === normalized) return 1;

    const aStartsWith = aLower.startsWith(normalized);
    const bStartsWith = bLower.startsWith(normalized);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    return a.localeCompare(b);
  });

  return candidates.slice(0, 6);
}
