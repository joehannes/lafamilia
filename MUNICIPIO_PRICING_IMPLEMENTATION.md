# Municipio-Based Transfer Pricing Implementation

## Overview
Implemented a complete municipio-based dynamic pricing system for the transfer service that:
- Auto-detects the municipio for origin/destination using reverse geocoding
- Applies location-based price multipliers
- Allows admins to manage all 246 Dominican municipio pricing multipliers
- Displays municipio information in the price summary

## Files Created

### 1. **src/data/municipioPriceMultipliers.ts**
- Contains all 246 Dominican municipalities with their default price multipliers
- Provides utility functions:
  - `getMunicipioPriceMultiplier(municipio)` - Get multiplier for a municipio
  - `getAllMunicipios()` - Get sorted list of all municipios
  - `getMunicipioCandidates(query)` - Get search suggestions

### 2. **src/services/municipioService.ts**
- Free Nominatim API integration for reverse geocoding
- Key functions:
  - `detectMunicipio(lat, lng)` - Reverse geocode coordinates to find municipio
  - `findMunicipio(query)` - Find municipio by search query
  - `getMunicipioCandidates(query)` - Get autocomplete suggestions
- Handles accent normalization for matching

### 3. **src/components/admin/MunicipioPriceAdminPanel.tsx**
- Full admin interface for managing municipio price multipliers
- Features:
  - View all 246 municipios with their current multipliers
  - Search/filter municipios
  - Edit multipliers individually
  - Save changes to JSONBin
  - Reset all to defaults

## Files Modified

### 1. **src/types/transport.ts**
Extended interfaces:
- `TransferConfig` - Added optional `municipioMultipliers?: Record<string, number>`
- `TransferFormData` - Added optional `originMunicipio` and `destinationMunicipio`
- `TransferPriceResult` - Added municipio fields and `municipioMultiplierApplied` to breakdown

### 2. **src/services/transferPricingEngine.ts**
Price calculation updates:
- When both municipios are available:
  - Calculates average multiplier: `(origin + destination) / 2`
  - Applies multiplier to pricePerKm before distance calculation
  - Stores `municipioMultiplierApplied` in breakdown for display
- Example: origin 1.2 + destination 1.4 = avg 1.3 → 1.3 USD/km × 1.3 = 1.69 USD/km

### 3. **src/services/transferConfigService.ts**
Configuration management:
- Added import for `DEFAULT_MUNICIPIO_MULTIPLIERS`
- Updated `mergeConfigWithDefaults()` to merge municipio multipliers
- Added `updateMunicipioPriceMultipliers()` function for admin saves
- Ensures municipio data persists with transfer config

### 4. **src/data/transferDefaults.ts**
- Added `DEFAULT_MUNICIPIO_MULTIPLIERS` import
- Included municipio multipliers in `DEFAULT_TRANSFER_CONFIG`

### 5. **src/pages/Transport.tsx**
User interface updates:
- Imported `detectMunicipio` service
- Updated `handleOriginSelect()` and `handleDestSelect()` to auto-detect municipios
- Modified price summary to display:
  - Origin municipio with 📍 icon
  - Destination municipio with 📍 icon
  - Municipio multiplier applied with 🏘️ icon
- Enhanced WhatsApp message builder to include municipios

### 6. **src/pages/AdminTransport.tsx**
- Added import and rendered `<MunicipioPriceAdminPanel />`
- Positioned between transfer config and service admin panels

## How It Works

### User Flow (Transport Page)
1. User selects origin location via autocomplete
2. System reverse-geocodes coordinates → detects municipio (free Nominatim API)
3. User selects destination location
4. System reverse-geocodes coordinates → detects municipio
5. Price calculation applies municipio multiplier:
   - Average of origin and destination multipliers
   - Multiplies the per-km price
6. Price summary displays:
   - Origin and its municipio
   - Destination and its municipio
   - Applied municipio multiplier
7. WhatsApp booking message includes municipio information

### Admin Flow (AdminTransport Page)
1. Admin navigates to Transfer Admin page
2. Views MunicipioPriceAdminPanel
3. Can:
   - Search/filter municipios
   - View current multiplier for each municipio
   - Edit any multiplier value
   - Click "Save Multipliers" to persist changes
   - Click "Reset All" to revert to defaults
4. Changes saved to JSONBin transfer config

## Pricing Logic Example

**Base scenario:**
- Base price: USD 1.3/km
- Distance: 100 km
- Journey: Santo Domingo (1.0) → Las Terrenas (1.9)
- Municipio multiplier avg: (1.0 + 1.9) / 2 = 1.45

**Calculation:**
```
Price per km = 1.3 × 1.45 = 1.885 USD/km
Base distance price = 1.885 × 100 = 188.50 USD
(then applied distance discount, vehicle multiplier, etc.)
```

## API Integration
- **Nominatim (Free)** - Reverse geocoding for municipio detection
  - Endpoint: `https://nominatim.openstreetmap.org/reverse`
  - No API key required
  - User-Agent: `MazBlancoTours/1.0`
  - Falls back gracefully if API unavailable

## Data Persistence
- Municipio multipliers stored in same JSONBin bin as transfer config
- Part of `transferConfig.municipioMultipliers`
- Persists across admin updates
- Merged with defaults on load (ensures new municipios have defaults)

## Features
✅ 246 Dominican municipios with default multipliers  
✅ Auto-detection via free Nominatim API  
✅ Accent-normalized searching  
✅ Admin panel with search/edit/save  
✅ Price calculation with municipio multipliers  
✅ Summary display showing municipios  
✅ WhatsApp messaging integration  
✅ Graceful degradation if detection fails  
✅ No additional API keys required  

## Testing Recommendations
1. Select various origin/destination combinations
2. Verify municipio detection displays correctly
3. Check price calculation with high/low multiplier municipios
4. Test admin panel - edit multipliers and verify persistence
5. Verify WhatsApp messages include municipio information
6. Test search functionality in admin panel
