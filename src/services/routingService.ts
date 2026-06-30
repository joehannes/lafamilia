interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][];
}

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

export async function getRouteBetweenPoints(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number }
): Promise<RouteResult> {
  const coords = `${origin.lng},${origin.lat};${dest.lng},${dest.lat}`;
  const url = `${OSRM_URL}/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Routing service responded ${res.status}`);
    const data = await res.json();
    const route = data.routes && data.routes[0];
    if (!route) throw new Error('No route found');

    const distanceKm = (route.distance || 0) / 1000;
    const durationMinutes = Math.round((route.duration || 0) / 60);
    const coordsArr: [number, number][] = (route.geometry?.coordinates || []).map(
      (c: any) => [c[1], c[0]]
    );

    return { distanceKm, durationMinutes, geometry: coordsArr };
  } catch (err) {
    console.warn('Routing service failed, falling back to straight-line distance', err);
    const d = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng);
    return { distanceKm: d, durationMinutes: Math.round((d / 60) * 60), geometry: [[origin.lat, origin.lng], [dest.lat, dest.lng]] };
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
