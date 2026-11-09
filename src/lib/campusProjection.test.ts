import {
  project,
  unproject,
  haversineDistanceMeters,
  projectedDistanceMeters,
  CAMPUS_ORIGIN,
  GeoPoint,
} from './campusProjection';

const testPoints: Record<string, GeoPoint> = {
  origin: CAMPUS_ORIGIN,
  ft: { lat: -7.053150, lng: 110.439920 },
  rsnd: { lat: -7.053120, lng: 110.446380 },
  sv: { lat: -7.055820, lng: 110.434890 },
  fsm: { lat: -7.051450, lng: 110.442150 },
  fh: { lat: -7.052880, lng: 110.436350 },
};

console.log('===========================================================');
console.log('CAMPUS PROJECTION UNIT TESTS (Uniform-Scale Equirectangular)');
console.log('===========================================================');

let failures = 0;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${msg}`);
    failures++;
  } else {
    console.log(`✓ [PASS] ${msg}`);
  }
}

// 1. Origin projection must be (0, 0)
const originProj = project(CAMPUS_ORIGIN);
assert(
  Math.abs(originProj.x) < 1e-6 && Math.abs(originProj.y) < 1e-6,
  `Origin maps to (0, 0): got (${originProj.x.toFixed(4)}, ${originProj.y.toFixed(4)})`
);

// 2. Round-trip test: unproject(project(p)) == p
for (const [name, pt] of Object.entries(testPoints)) {
  const proj = project(pt);
  const unproj = unproject(proj);
  const latDiff = Math.abs(unproj.lat - pt.lat);
  const lngDiff = Math.abs(unproj.lng - pt.lng);
  assert(
    latDiff < 1e-7 && lngDiff < 1e-7,
    `Round-trip unproject for ${name}: latDiff=${latDiff.toExponential(2)}, lngDiff=${lngDiff.toExponential(2)}`
  );
}

// 3. Scale equality test: 1 meter dx corresponds to 1 meter dy
// Check 100 meters East vs 100 meters South
const ptEast = unproject({ x: 100, y: 0 });
const ptSouth = unproject({ x: 0, y: 100 });
const distEast = haversineDistanceMeters(CAMPUS_ORIGIN, ptEast);
const distSouth = haversineDistanceMeters(CAMPUS_ORIGIN, ptSouth);
const scaleRatio = distEast / distSouth;
assert(
  Math.abs(scaleRatio - 1.0) < 0.001,
  `Scale equality (isotropic 1:1): ratio=${scaleRatio.toFixed(6)} (diff=${(Math.abs(scaleRatio - 1.0) * 100).toFixed(4)}%)`
);
assert(
  Math.abs(distEast - 100) < 0.05 && Math.abs(distSouth - 100) < 0.05,
  `Unit scale in meters: East=${distEast.toFixed(2)}m, South=${distSouth.toFixed(2)}m`
);

// 4. Distances between known campus points match Haversine within 1%
const pairs: [string, string][] = [
  ['origin', 'ft'],
  ['origin', 'rsnd'],
  ['origin', 'sv'],
  ['ft', 'rsnd'],
  ['sv', 'fsm'],
  ['fh', 'rsnd'],
];

for (const [p1Name, p2Name] of pairs) {
  const p1 = testPoints[p1Name];
  const p2 = testPoints[p2Name];
  const hDist = haversineDistanceMeters(p1, p2);
  const proj1 = project(p1);
  const proj2 = project(p2);
  const pDist = projectedDistanceMeters(proj1, proj2);
  const percentErr = Math.abs((pDist - hDist) / hDist) * 100;

  assert(
    percentErr < 1.0,
    `Distance between ${p1Name} and ${p2Name}: Haversine=${hDist.toFixed(1)}m, Projected=${pDist.toFixed(1)}m, Error=${percentErr.toFixed(3)}% (< 1.0%)`
  );
}

if (failures > 0) {
  console.error(`\nTotal failures: ${failures}`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL CAMPUS PROJECTION UNIT TESTS PASSED WITH 0 ERRORS!\n');
}
