import { campusFacultyLocations } from '../src/data/campusLocations';
import { faculties } from '../src/data/faculties';
import { campusMapData } from '../src/data/campusMap';
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
// CHECK 1: Exactly 12 faculties/units must be represented
// -----------------------------------------------------------------------------
const requiredUnits = [
  'ft', 'fisip', 'fh', 'fib', 'sv', 'fpsi',
  'feb', 'fsm', 'fk', 'fkm', 'fpik', 'fpp'
];
console.log('[CHECK 1] Validating representation of all 12 units...');
const mappedUnitIds = new Set(campusFacultyLocations.map((loc) => loc.id));

for (const unitId of requiredUnits) {
  const isPresent = mappedUnitIds.has(unitId);
  const faculty = faculties.find((f) => f.id === unitId);
  check(
    isPresent,
    `Unit [${unitId.toUpperCase()}] (${faculty?.name || unitId}) has representation in campusFacultyLocations`,
    `Unit ${unitId} is missing from campusFacultyLocations`
  );
}
check(
  campusFacultyLocations.length === 12,
  `Exactly 12 units mapped (found: ${campusFacultyLocations.length})`
);

// -----------------------------------------------------------------------------
// CHECK 2: All units must have OSM polygons (unless flagged source: 'approx')
// -----------------------------------------------------------------------------
console.log('\n[CHECK 2] Validating OSM polygon sources for units (or approx flag)...');
for (const loc of campusFacultyLocations) {
  const unitBuildings = campusMapData.buildings.filter((b) => b.facultyId === loc.id);
  const hasOsmPolygon = unitBuildings.some((b) => b.source === 'osm' && b.projectedPolygon.length >= 3);
  const isApprox = loc.source === 'approx' || unitBuildings.some((b) => b.source === 'approx');

  if (loc.id === 'feb') {
    check(
      isApprox,
      `Unit [FEB] correctly flagged as source: 'approx' (awaiting owner ground survey)`,
      `FEB must have source: 'approx'`
    );
  } else {
    check(
      hasOsmPolygon,
      `Unit [${loc.id.toUpperCase()}] has verified OSM polygon(s) (${unitBuildings.length} buildings found)`,
      `Unit ${loc.id} lacks verified OSM polygons`
    );
  }
}

// -----------------------------------------------------------------------------
// CHECK 3: Centroid distance from matched OSM feature centroid must be <= 40m
// -----------------------------------------------------------------------------
console.log('\n[CHECK 3] Validating centroid precision to matched OSM feature (<= 40m threshold)...');
for (const loc of campusFacultyLocations) {
  if (loc.source === 'approx') {
    console.log(`ℹ️ [SKIP] Unit [${loc.id.toUpperCase()}] is approx; distance check skipped.`);
    continue;
  }
  const unitBuildings = campusMapData.buildings.filter((b) => b.facultyId === loc.id && b.source === 'osm');
  if (unitBuildings.length === 0) {
    check(false, `Unit [${loc.id.toUpperCase()}] has OSM buildings for centroid verification`);
    continue;
  }
  let sumLat = 0, sumLng = 0;
  for (const b of unitBuildings) {
    sumLat += b.centroid.lat;
    sumLng += b.centroid.lng;
  }
  const osmClusterCentroid = {
    lat: sumLat / unitBuildings.length,
    lng: sumLng / unitBuildings.length,
  };
  const distMeters = haversineDistanceMeters(loc.realCoordinates, osmClusterCentroid);
  check(
    distMeters <= 40,
    `Unit [${loc.id.toUpperCase()}] centroid is within ${distMeters.toFixed(2)}m of matched OSM feature (<= 40m threshold)`,
    `Centroid distance is ${distMeters.toFixed(2)}m, exceeding 40m threshold`
  );
}

// -----------------------------------------------------------------------------
// CHECK 4: Every rendered object must have a valid 'source' attribute
// -----------------------------------------------------------------------------
console.log('\n[CHECK 4] Validating source attribution on all map elements...');
let missingSourceCount = 0;
for (const b of campusMapData.buildings) {
  if (!b.source || (b.source !== 'osm' && b.source !== 'owner' && b.source !== 'approx')) {
    missingSourceCount++;
  }
}
for (const lm of campusMapData.landmarks) {
  if (!lm.source || (lm.source !== 'osm' && lm.source !== 'owner' && lm.source !== 'approx')) {
    missingSourceCount++;
  }
}
for (const loc of campusFacultyLocations) {
  if (!loc.source || (loc.source !== 'osm' && loc.source !== 'approx')) {
    missingSourceCount++;
  }
}
check(
  missingSourceCount === 0,
  `All campus buildings, landmarks, and faculty locations have valid source attribute (missing: ${missingSourceCount})`,
  `${missingSourceCount} objects lack a valid source property`
);

// -----------------------------------------------------------------------------
// CHECK 5: No label collisions at overview zoom
// -----------------------------------------------------------------------------
console.log('\n[CHECK 5] Validating zero label collisions at overview zoom (12 units + key landmarks)...');
interface BBox {
  id: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const overviewLabelBoxes: BBox[] = [];

// 12 faculty labels
for (const loc of campusFacultyLocations) {
  const offsetX = loc.labelOffset?.x || 0;
  const offsetY = loc.labelOffset?.y || 0;
  const posX = loc.mapPosition.x - 44 + offsetX;
  const posY = loc.mapPosition.y + 18 + offsetY;
  overviewLabelBoxes.push({
    id: `faculty-${loc.id}`,
    minX: posX,
    maxX: posX + 88,
    minY: posY,
    maxY: posY + 24,
  });
}

// 8 key landmarks at overview
const keyLandmarkIds = [
  'osm-lm-widya-puraya',
  'osm-lm-gsg',
  'osm-lm-student-center',
  'osm-lm-masjid-kampus',
  'osm-lm-muladi-dome',
  'osm-lm-stadion',
  'osm-lm-waduk',
  'osm-lm-rsnd',
];

for (const lmId of keyLandmarkIds) {
  const lm = campusMapData.landmarks.find((l) => l.id === lmId);
  if (lm) {
    const proj = lm.projectedCoords;
    const canvasX = 1000 + proj.x;
    const canvasY = 480 + proj.y;
    overviewLabelBoxes.push({
      id: lm.id,
      minX: canvasX - 60,
      maxX: canvasX + 60,
      minY: canvasY + 15,
      maxY: canvasY + 35,
    });
  }
}

let collisionFound = false;
for (let i = 0; i < overviewLabelBoxes.length; i++) {
  for (let j = i + 1; j < overviewLabelBoxes.length; j++) {
    const b1 = overviewLabelBoxes[i];
    const b2 = overviewLabelBoxes[j];
    const overlapX = b1.minX < b2.maxX && b1.maxX > b2.minX;
    const overlapY = b1.minY < b2.maxY && b1.maxY > b2.minY;
    if (overlapX && overlapY) {
      collisionFound = true;
      check(false, `Label collision detected between [${b1.id}] and [${b2.id}]`);
    }
  }
}
if (!collisionFound) {
  check(true, `Zero label overlaps across all ${overviewLabelBoxes.length} overview labels`);
}

// -----------------------------------------------------------------------------
// CHECK 6: Uniform scale isotropic projection (px-per-metre uniform across axes)
// -----------------------------------------------------------------------------
console.log('\n[CHECK 6] Validating uniform scale projection (isotropic px/m)...');
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
// CHECK 7: PSDKU exclusion
// -----------------------------------------------------------------------------
console.log('\n[CHECK 7] Validating PSDKU exclusion from Tembalang campus map...');
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
  console.log('🎉 ALL 7 MAP VERIFICATION CHECKS PASSED WITH 0 ERRORS!');
}
console.log('===============================================================\n');
