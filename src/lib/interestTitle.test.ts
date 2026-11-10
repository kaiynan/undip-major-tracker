import { getInterestTitle, getAllInterestTitlePairs } from './interestTitle';

console.log('===========================================================');
console.log('UNLOCK THE UNSEEN — INTEREST TITLE UNIT TESTS');
console.log('===========================================================');

function assert(condition: boolean, testName: string, detail: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${testName}: ${detail}`);
    process.exit(1);
  } else {
    console.log(`✓ [PASS] ${testName}`);
  }
}

// Test 1: Full 30 RIASEC pairs exist and have non-empty fields
const allPairs = getAllInterestTitlePairs();
const expectedCodes = ['R', 'I', 'A', 'S', 'E', 'C'];
let pairCount = 0;

for (const c1 of expectedCodes) {
  for (const c2 of expectedCodes) {
    if (c1 === c2) continue;
    const pairKey = `${c1}${c2}`;
    const entry = allPairs[pairKey];
    assert(!!entry, `Pair ${pairKey} exists in PAIR_MAP`, `Pair ${pairKey} is missing`);
    assert(entry.title.length > 3, `Pair ${pairKey} has valid title`, entry.title);
    assert(entry.subtitle.length > 3, `Pair ${pairKey} has valid subtitle`, entry.subtitle);
    assert(entry.narrative.length > 20, `Pair ${pairKey} has valid narrative`, entry.narrative);
    pairCount++;
  }
}
assert(pairCount === 30, 'Exactly 30 distinct 2-trait RIASEC pairs configured', `Got ${pairCount}`);

// Test 2: Determinism check (calling multiple times produces identical output)
const testInput = [
  { code: 'I', label: 'Investigatif' },
  { code: 'R', label: 'Realistik' },
];
const res1 = getInterestTitle(testInput);
const res2 = getInterestTitle(testInput);
assert(res1.title === 'Penyelidik Praktis', 'IR title matches expected', res1.title);
assert(res1.title === res2.title && res1.narrative === res2.narrative, 'Deterministic output check', 'Results diverged');

// Test 3: Null and empty handling
const emptyRes = getInterestTitle(null);
assert(emptyRes.title === 'Eksplorator Minat', 'Null input returns fallback title', emptyRes.title);
assert(emptyRes.codePair === 'MULTI', 'Null input codePair is MULTI', emptyRes.codePair);

const singleTraitRes = getInterestTitle([{ code: 'A', label: 'Artistik' }]);
assert(singleTraitRes.title.length > 0, 'Single trait handled without throwing', singleTraitRes.title);

console.log('===========================================================');
console.log('🎉 ALL INTEREST TITLE UNIT TESTS PASSED WITH 0 ERRORS!');
console.log('===========================================================');
