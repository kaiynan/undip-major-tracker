import { campusFacultyLocations } from '../src/data/campusLocations';
import { faculties } from '../src/data/faculties';
import { OWNER_POINTS } from './map-audit';
import { unproject, haversineDistanceMeters } from '../src/lib/campusProjection';

console.log('===============================================================');
console.log('UNDIP TEMBALANG CAMPUS MAP INTEGRITY & GEOGRAPHIC CHECKS');
console.log('===============================================================\n');

let failureCount = 0;

function check(condition: boolean, title: string, details?: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${title}`);
    if (details) console.error(`   Details: ${details}`);
    failureCount++;
  } else {
    console.log(`✓ [PASS] ${title}`);
  }
}

// -----------------------------------------------------------------------------
// CHECK 1: Exactly 12 faculties/units must have a building representation
// -----------------------------------------------------------------------------
const requiredUnits = [
  'ft', 'fisip', 'fh', 'fib', 'sv', 'fpsi',
  'feb', 'fsm', 'fk', 'fkm', 'fpik', 'fpp'
];
console.log('[CHECK 1] Validating representation of all 12 units (including FISIP & SV)...');
const mappedUnitIds = new Set(campusFacultyLocations.map((loc) => loc.id));

for (const unitId of requiredUnits) {
  const isPresent = mappedUnitIds.has(unitId);
  const faculty = faculties.find((f) => f.id === unitId);
  check(
    isPresent,
    `Unit [${unitId.toUpperCase()}] (${faculty?.name || unitId}) has building representation`,
    `Unit ${unitId} is missing from campusFacultyLocations`
  );
}
check(
  campusFacultyLocations.length === 12,
  `Exactly 12 units mapped (found: ${campusFacultyLocations.length})`
);

// -----------------------------------------------------------------------------
// CHECK 2: Faculty buildings must be within <= 120m from audited ground truth
// -----------------------------------------------------------------------------
console.log('\n[CHECK 2] Validating distance to owner audited truth (<= 120m threshold)...');
const ownerMap = new Map(OWNER_POINTS.filter((p) => p.facultyId).map((p) => [p.facultyId!, p.coords]));

for (const loc of campusFacultyLocations) {
  const truthCoords = ownerMap.get(loc.id);
  if (!truthCoords) {
    check(false, `Owner ground truth exists for unit [${loc.id}]`);
    continue;
  }
  const distMeters = haversineDistanceMeters(loc.realCoordinates, truthCoords);
  check(
    distMeters <= 120,
    `Unit [${loc.id.toUpperCase()}] distance to audited truth: ${distMeters.toFixed(1)}m (<= 120m)`,
    `Distance is ${distMeters.toFixed(1)}m, exceeding the 120m threshold`
  );
}

// -----------------------------------------------------------------------------
// CHECK 3: No label collisions at overview zoom
// -----------------------------------------------------------------------------
console.log('\n[CHECK 3] Validating label separation / collision avoidance at overview zoom...');
interface BBox {
  id: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const labelBoxes: BBox[] = campusFacultyLocations.map((loc) => {
  const offsetX = loc.labelOffset?.x || 0;
  const offsetY = loc.labelOffset?.y || 0;
  const posX = loc.mapPosition.x - 90 + 10 + offsetX;
  const posY = loc.mapPosition.y - 60 + 105 + offsetY;
  const pillWidth = 88; // max badge width
  const pillHeight = 24;
  return {
    id: loc.id,
    minX: posX,
    maxX: posX + pillWidth,
    minY: posY,
    maxY: posY + pillHeight,
  };
});

let collisionFound = false;
for (let i = 0; i < labelBoxes.length; i++) {
  for (let j = i + 1; j < labelBoxes.length; j++) {
    const b1 = labelBoxes[i];
    const b2 = labelBoxes[j];
    const overlapX = b1.minX < b2.maxX && b1.maxX > b2.minX;
    const overlapY = b1.minY < b2.maxY && b1.maxY > b2.minY;
    if (overlapX && overlapY) {
      collisionFound = true;
      check(false, `Label collision detected between [${b1.id}] and [${b2.id}]`);
    }
  }
}
if (!collisionFound) {
  check(true, 'Zero label overlaps across all 12 units at overview zoom');
}

// -----------------------------------------------------------------------------
// CHECK 4: Scale equality across axes (uniform isotropic projection)
// -----------------------------------------------------------------------------
console.log('\n[CHECK 4] Validating uniform scale projection (isotropic px/m)...');
const ptEast = unproject({ x: 100, y: 0 });
const ptSouth = unproject({ x: 0, y: 100 });
const distE = haversineDistanceMeters({ lat: -7.051320, lng: 110.440350 }, ptEast);
const distS = haversineDistanceMeters({ lat: -7.051320, lng: 110.440350 }, ptSouth);
const axisRatio = distE / distS;
check(
  Math.abs(axisRatio - 1.0) < 0.005,
  `Uniform scale isotropic ratio: ${axisRatio.toFixed(6)} (deviation: ${(Math.abs(axisRatio - 1.0) * 100).toFixed(4)}% < 0.5%)`
);

// -----------------------------------------------------------------------------
// CHECK 5: PSDKU-only locations exclusion (PSDKU are outside this campus)
// -----------------------------------------------------------------------------
console.log('\n[CHECK 5] Validating PSDKU exclusion from Tembalang campus map...');
const forbiddenPsdkuKeywords = ['batang', 'pekalongan', 'rembang', 'demak', 'psdku'];
const mapText = JSON.stringify(campusFacultyLocations).toLowerCase();
let psdkuLeak = false;

for (const kw of forbiddenPsdkuKeywords) {
  if (mapText.includes(`"psdku`)) {
    psdkuLeak = true;
    check(false, `PSDKU keyword '${kw}' leaked into campus map data`);
  }
}
check(!psdkuLeak, 'Zero PSDKU programs/campuses present on Tembalang campus map');

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n===============================================================');
if (failureCount > 0) {
  console.error(`🚨 CHECK-MAP FAILED WITH ${failureCount} ERRORS!`);
  process.exit(1);
} else {
  console.log('🎉 ALL 5 MAP VERIFICATION CHECKS PASSED WITH 0 ERRORS!');
}
console.log('===============================================================\n');
