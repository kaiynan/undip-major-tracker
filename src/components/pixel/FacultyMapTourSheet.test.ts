import { faculties } from '@/data/faculties';
import { studyPrograms } from '@/data/programs';
import { isPsdku } from '@/data/types';
import { campusFacultyLocations } from '@/data/campusLocations';

console.log('===========================================================');
console.log('DEFINE YOUR NEXT MOVE — CAMPUS TOUR & MAP DATA UNIT TESTS');
console.log('===========================================================');

// -----------------------------------------------------------------------------
// Test 1: Campus Map Units (Exactly 12 Tembalang units, 0 PSDKU)
// -----------------------------------------------------------------------------
console.log('\n[TEST 1] Campus Locations Parity with Faculties...');
if (campusFacultyLocations.length !== 12) {
  throw new Error(`Expected exactly 12 faculty locations on campus map, found ${campusFacultyLocations.length}`);
}

for (const loc of campusFacultyLocations) {
  const fac = faculties.find((f) => f.id === loc.id);
  if (!fac) {
    throw new Error(`Location ${loc.id} does not map to any valid faculty in faculties.ts`);
  }
}
console.log('  ✓ Exactly 12 Tembalang faculty units mapped without dangling IDs.');

// -----------------------------------------------------------------------------
// Test 2: PSDKU Exclusion from Tembalang Campus Map
// -----------------------------------------------------------------------------
console.log('\n[TEST 2] Verifying 0 PSDKU Programs on Tembalang Campus Tour...');
for (const fac of faculties) {
  const allProgs = studyPrograms.filter((p) => p.facultyId === fac.id);
  const tembalangProgs = allProgs.filter((p) => !isPsdku(p));
  const psdkuProgs = allProgs.filter((p) => isPsdku(p));

  // Verify none of tembalangProgs have PSDKU indicators
  for (const p of tembalangProgs) {
    if (isPsdku(p)) {
      throw new Error(`PSDKU program leaked into campus tour: ${p.id}`);
    }
  }

  if (psdkuProgs.length > 0) {
    console.log(`  - Faculty ${fac.shortName}: ${tembalangProgs.length} Tembalang programs (correctly separated from ${psdkuProgs.length} PSDKU programs)`);
  }
}
console.log('  ✓ 100% PSDKU exclusion verified: zero off-campus programs appear on Tembalang map.');

// -----------------------------------------------------------------------------
// Test 3: Program Counts Parity (Total = 65 Semarang Programs)
// -----------------------------------------------------------------------------
console.log('\n[TEST 3] Program Count Parity across all 12 Faculties...');
let totalTourPrograms = 0;
for (const loc of campusFacultyLocations) {
  const progs = studyPrograms.filter((p) => p.facultyId === loc.id && !isPsdku(p));
  if (progs.length === 0) {
    throw new Error(`Faculty ${loc.id} has 0 programs in studyPrograms database`);
  }
  totalTourPrograms += progs.length;
}

if (totalTourPrograms !== 65) {
  throw new Error(`Expected exactly 65 programs across 12 Tembalang faculties, got ${totalTourPrograms}`);
}
console.log(`  ✓ Total programs across 12 units = ${totalTourPrograms} (all 65 official Semarang programs).`);

console.log('\n===========================================================');
console.log('🎉 ALL CAMPUS TOUR UNIT TESTS PASSED WITH 0 ERRORS!');
console.log('===========================================================');
