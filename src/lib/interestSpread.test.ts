import {
  INTEREST_SPREAD_THRESHOLD,
  detectInterestSpread,
} from './interestSpread';
import { calculateAllScores } from './engine';
import { studyPrograms } from '@/data/programs';
import { questions } from '@/data/questions';
import { UserAnswers, isPsdku } from '@/data/types';

console.log('===========================================================');
console.log('DEFINE YOUR NEXT MOVE — INTEREST SPREAD UNIT TESTS');
console.log('===========================================================');

// -----------------------------------------------------------------------------
// Test 1: Threshold Constant & Metadata
// -----------------------------------------------------------------------------
console.log('\n[TEST 1] Verifying Threshold Constant...');
if (INTEREST_SPREAD_THRESHOLD !== 4.4) {
  throw new Error(`Expected INTEREST_SPREAD_THRESHOLD to be 4.4, got ${INTEREST_SPREAD_THRESHOLD}`);
}
console.log(`  ✓ Threshold constant confirmed: ${INTEREST_SPREAD_THRESHOLD}% (P25 consistent answer sets)`);

// -----------------------------------------------------------------------------
// Test 2: Forced Flat/Close-Score Input Triggers Spread Warning
// -----------------------------------------------------------------------------
console.log('\n[TEST 2] Testing Forced Flat/Close-Score Input (Must Trigger)...');

// Profile with completely uniform neutral answers (all 3)
const flatAnswers: UserAnswers = {};
for (const q of questions) flatAnswers[q.id] = 3;

const flatScores = calculateAllScores(flatAnswers, studyPrograms, questions);
const rankedFlat = flatScores.filter((s) => {
  const p = studyPrograms.find((prog) => prog.id === s.programId);
  return !isPsdku(p);
});

const flatResult = detectInterestSpread(rankedFlat);
console.log(`  Flat responses: score#1=${rankedFlat[0].totalScore}%, score#5=${rankedFlat[4].totalScore}%, gap=${flatResult.gap1_5}%`);

if (!flatResult.isSpread) {
  throw new Error('Flat uniform answers MUST trigger interest spread detection!');
}
console.log('  ✓ Flat answers successfully triggered interest spread warning.');

// -----------------------------------------------------------------------------
// Test 3: Focused Peaked Input Does NOT Trigger Spread Warning
// -----------------------------------------------------------------------------
console.log('\n[TEST 3] Testing Peaked/Focused Input (Must NOT Trigger)...');

// Highly focused CS / IT profile
const peakedAnswers: UserAnswers = {};
for (const q of questions) {
  if (q.subdimension === 'D5' || q.subdimension === 'computation') {
    peakedAnswers[q.id] = 5;
  } else if (q.subdimension === 'D1' || q.subdimension === 'D4') {
    peakedAnswers[q.id] = 4;
  } else {
    peakedAnswers[q.id] = 1;
  }
}

const peakedScores = calculateAllScores(peakedAnswers, studyPrograms, questions);
const rankedPeaked = peakedScores.filter((s) => {
  const p = studyPrograms.find((prog) => prog.id === s.programId);
  return !isPsdku(p);
});

const peakedResult = detectInterestSpread(rankedPeaked);
console.log(`  Peaked responses: score#1=${rankedPeaked[0].totalScore}%, score#5=${rankedPeaked[4].totalScore}%, gap=${peakedResult.gap1_5}%`);

if (peakedResult.isSpread) {
  throw new Error(
    `Peaked answers triggered spread warning unexpectedly! gap was ${peakedResult.gap1_5}% vs threshold ${peakedResult.threshold}%`
  );
}
console.log('  ✓ Peaked input successfully avoided triggering interest spread warning.');

// -----------------------------------------------------------------------------
// Test 4: Edge Cases (Empty, Null, Single Element)
// -----------------------------------------------------------------------------
console.log('\n[TEST 4] Edge Cases & Guard Conditions...');
if (detectInterestSpread(null).isSpread) throw new Error('Null input should not trigger');
if (detectInterestSpread([]).isSpread) throw new Error('Empty input should not trigger');
if (detectInterestSpread([rankedFlat[0]]).isSpread) throw new Error('Single element input should not trigger');

console.log('  ✓ Edge cases handle empty and minimal lists safely without errors.');

console.log('\n===========================================================');
console.log('🎉 ALL INTEREST SPREAD UNIT TESTS PASSED WITH 0 ERRORS!');
console.log('===========================================================');
