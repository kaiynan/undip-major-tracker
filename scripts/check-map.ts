import { campusFacultyLocations } from '../src/data/campusLocations';

interface BearingComparison {
  id: string;
  name: string;
  realLat: number;
  realLng: number;
  mapX: number;
  mapY: number;
  realBearingFromRektorat: number;
  mapBearingFromRektorat: number;
  bearingDiffDeg: number;
  realDistFromRektorat: number;
  mapDistFromRektorat: number;
  realSector: string;
  mapSector: string;
  isDirectionMismatch: boolean;
}

// Reference: Rektorat / Widya Puraya
const rektoratReal = { lat: -7.0493, lng: 110.4384 };
const rektoratMap = { x: 980, y: 580 };

function getSector(deg: number): string {
  const normalized = (deg + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'N (Utara)';
  if (normalized >= 22.5 && normalized < 67.5) return 'NE (Timur Laut)';
  if (normalized >= 67.5 && normalized < 112.5) return 'E (Timur)';
  if (normalized >= 112.5 && normalized < 157.5) return 'SE (Tenggara)';
  if (normalized >= 157.5 && normalized < 202.5) return 'S (Selatan)';
  if (normalized >= 202.5 && normalized < 247.5) return 'SW (Barat Daya)';
  if (normalized >= 247.5 && normalized < 292.5) return 'W (Barat)';
  return 'NW (Barat Laut)';
}

function calcRealBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

function calcMapBearing(x1: number, y1: number, x2: number, y2: number): number {
  // Screen space: x is East, y is South (-y is North)
  const dx = x2 - x1;
  const dy = -(y2 - y1); // up is North
  const rad = Math.atan2(dx, dy);
  const deg = (rad * 180 / Math.PI + 360) % 360;
  return deg;
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

console.log('===============================================================');
console.log('UNDIP TEMBALANG CAMPUS MAP GEOGRAPHIC VERIFICATION (check-map)');
console.log('===============================================================\n');

const results: BearingComparison[] = [];

for (const loc of campusFacultyLocations) {
  const realB = calcRealBearing(rektoratReal.lat, rektoratReal.lng, loc.realCoordinates.lat, loc.realCoordinates.lng);
  const mapB = calcMapBearing(rektoratMap.x, rektoratMap.y, loc.mapPosition.x, loc.mapPosition.y);
  let diff = Math.abs(realB - mapB);
  if (diff > 180) diff = 360 - diff;

  const realDist = haversineMeters(rektoratReal.lat, rektoratReal.lng, loc.realCoordinates.lat, loc.realCoordinates.lng);
  const mapDist = Math.hypot(loc.mapPosition.x - rektoratMap.x, loc.mapPosition.y - rektoratMap.y);

  const realSec = getSector(realB);
  const mapSec = getSector(mapB);

  // Mismatch flagged if quadrant differs (e.g. West vs East or North vs South)
  const realIsEast = loc.realCoordinates.lng > rektoratReal.lng;
  const mapIsEast = loc.mapPosition.x > rektoratMap.x;
  const realIsSouth = loc.realCoordinates.lat < rektoratReal.lat;
  const mapIsSouth = loc.mapPosition.y > rektoratMap.y;

  const isMismatch = (realIsEast !== mapIsEast) || (realIsSouth !== mapIsSouth);

  results.push({
    id: loc.id,
    name: loc.name,
    realLat: loc.realCoordinates.lat,
    realLng: loc.realCoordinates.lng,
    mapX: loc.mapPosition.x,
    mapY: loc.mapPosition.y,
    realBearingFromRektorat: realB,
    mapBearingFromRektorat: mapB,
    bearingDiffDeg: diff,
    realDistFromRektorat: realDist,
    mapDistFromRektorat: mapDist,
    realSector: realSec,
    mapSector: mapSec,
    isDirectionMismatch: isMismatch,
  });
}

// Distance rank ordering comparison
const byRealDist = [...results].sort((a, b) => a.realDistFromRektorat - b.realDistFromRektorat);
const byMapDist = [...results].sort((a, b) => a.mapDistFromRektorat - b.mapDistFromRektorat);

console.log('FACULTY COMPARISON RESULTS:');
console.log('----------------------------------------------------------------------------------------------------------------------');
console.log('| ID    | Name                       | Real Coord (Lat, Lng) | Map Pos (X, Y) | Real Brng | Map Brng | Diff° | Real Sec | Map Sec  | Match? |');
console.log('----------------------------------------------------------------------------------------------------------------------');
for (const r of results) {
  const matchStr = r.isDirectionMismatch ? 'MISMATCH!' : 'OK';
  console.log(
    `| ${r.id.padEnd(5)} | ${r.name.slice(0, 26).padEnd(26)} | (${r.realLat.toFixed(3)}, ${r.realLng.toFixed(3)})   | (${String(r.mapX).padStart(4)}, ${String(r.mapY).padStart(4)}) | ${r.realBearingFromRektorat.toFixed(1).padStart(7)}° | ${r.mapBearingFromRektorat.toFixed(1).padStart(6)}° | ${r.bearingDiffDeg.toFixed(1).padStart(5)}° | ${r.realSector.padEnd(9)} | ${r.mapSector.padEnd(9)} | ${matchStr.padEnd(6)} |`
  );
}
console.log('----------------------------------------------------------------------------------------------------------------------\n');

console.log('DISTANCE RANK ORDERING FROM REKTORAT:');
console.log('Real Distance Rank: ' + byRealDist.map(r => r.id).join(' -> '));
console.log('Map Distance Rank:  ' + byMapDist.map(r => r.id).join(' -> '));

const mismatches = results.filter(r => r.isDirectionMismatch);
console.log(`\nDirection Mismatch Count: ${mismatches.length}`);
if (mismatches.length > 0) {
  console.log('Locations with cardinal mismatch:', mismatches.map(m => `${m.id} (${m.name}): Real=${m.realSector}, Map=${m.mapSector}`).join(', '));
}
