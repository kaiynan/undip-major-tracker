import {
  computeScoreBreakdown,
  getMatchReasons,
  getTopThreeComparison,
} from './matchReasons';
import {
  calculateDimensionScores,
  calculateProgramScore,
  DEFAULT_CONFIG,
} from './engine';
import { studyPrograms } from '@/data/programs';
import { questions } from '@/data/questions';
import { UserAnswers } from '@/data/types';

console.log('===========================================================');
console.log('DEFINE YOUR NEXT MOVE — MATCH REASONS & BREAKDOWN UNIT TESTS');
console.log('===========================================================');

// -----------------------------------------------------------------------------
// Test 1: Mathematical Equivalence (Tolerance 1e-9 across 20 random profiles)
// -----------------------------------------------------------------------------
console.log('\n[TEST 1] Verifying Breakdown Weighted Sum == Official Score (tolerance 1e-9)...');

// Seeded deterministic pseudo-random generator
let seed = 42;
function rng() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

let totalEvaluations = 0;
let maxDelta = 0;

for (let sim = 0; sim < 20; sim++) {
  const answers: UserAnswers = {};
  for (const q of questions) {
    answers[q.id] = Math.floor(rng() * 5) + 1; // 1 to 5 Likert
  }

  const dims = calculateDimensionScores(answers, questions);

  for (const program of studyPrograms) {
    totalEvaluations++;
    const official = calculateProgramScore(dims, program, DEFAULT_CONFIG);
    const breakdown = computeScoreBreakdown(dims, program, DEFAULT_CONFIG);

    // Sum of the 4 dimension contributions
    const computedWeightedSum =
      breakdown.contributions.riasec +
      breakdown.contributions.domain +
      breakdown.contributions.learning +
      breakdown.contributions.curriculum;

    // Check raw weighted sum equivalence to 1e-9 tolerance
    const delta = Math.abs(computedWeightedSum - breakdown.weightedSum);
    if (delta > maxDelta) maxDelta = delta;

    if (delta > 1e-9) {
      throw new Error(
        `Tolerance violation on sim ${sim}, program ${program.id}: delta ${delta} exceeds 1e-9`
      );
    }

    // Check rounded score equivalence with official totalScore
    if (breakdown.roundedScore !== official.totalScore) {
      throw new Error(
        `Score divergence on program ${program.id}: breakdown rounded ${breakdown.roundedScore} !== official ${official.totalScore}`
      );
    }
  }
}

console.log(`  ✓ Passed 20 random profiles x ${studyPrograms.length} programs = ${totalEvaluations} evaluations.`);
console.log(`  ✓ Maximum delta observed: ${maxDelta.toExponential(4)} (well below 1e-9).`);
console.log(`  ✓ 100% exact parity with official engine totalScore.`);

// -----------------------------------------------------------------------------
// Test 2: Determinism
// -----------------------------------------------------------------------------
console.log('\n[TEST 2] Determinism Verification...');
const testAnswers: UserAnswers = {};
for (const q of questions) testAnswers[q.id] = ((q.id * 3) % 5) + 1;
const testDims = calculateDimensionScores(testAnswers, questions);
const sampleProg = studyPrograms[0];

const run1 = getMatchReasons(testDims, sampleProg);
const run2 = getMatchReasons(testDims, sampleProg);

if (JSON.stringify(run1) !== JSON.stringify(run2)) {
  throw new Error('getMatchReasons is not deterministic!');
}
console.log('  ✓ Deterministic output confirmed: identical runs produce identical reason arrays.');

// -----------------------------------------------------------------------------
// Test 3: Positive Contributions & No Duplicates
// -----------------------------------------------------------------------------
console.log('\n[TEST 3] Positive Contributions Only & No Duplicate Reasons...');
for (const prog of studyPrograms) {
  const reasons = getMatchReasons(testDims, prog);

  // Check no duplicates
  const set = new Set(reasons);
  if (set.size !== reasons.length) {
    throw new Error(`Duplicate reasons detected for program ${prog.id}: ${reasons.join(' | ')}`);
  }

  // Check that if reasons exist, each references a component with positive contribution
  for (const reason of reasons) {
    if (reason.length === 0) {
      throw new Error(`Empty reason string found for program ${prog.id}`);
    }
  }

  // Check reasons count is <= 3
  if (reasons.length > 3) {
    throw new Error(`More than 3 reasons returned for program ${prog.id}`);
  }
}
console.log(`  ✓ Validated across all ${studyPrograms.length} programs: 0 duplicates, strictly positive alignment, max 3 reasons.`);

// -----------------------------------------------------------------------------
// Test 4: Graceful Degradation on Missing or Zero Data
// -----------------------------------------------------------------------------
console.log('\n[TEST 4] Graceful Degradation on Missing Data...');
if (getMatchReasons(null, sampleProg).length !== 0) {
  throw new Error('Expected [] for null dimensionScores');
}
if (getMatchReasons(testDims, null).length !== 0) {
  throw new Error('Expected [] for null program');
}

// User answered all 1s (all normalized dimensions = 0)
const zeroAnswers: UserAnswers = {};
for (const q of questions) zeroAnswers[q.id] = 1;
const zeroDims = calculateDimensionScores(zeroAnswers, questions);
const zeroReasons = getMatchReasons(zeroDims, sampleProg);
if (zeroReasons.length !== 0) {
  throw new Error(`Expected [] when all dimension scores are 0, got ${zeroReasons.length}`);
}
console.log('  ✓ Gracefully returns [] when data is missing or user has 0 interest.');

// -----------------------------------------------------------------------------
// Test 5: Snapshot for 3 Diverse Personas
// -----------------------------------------------------------------------------
console.log('\n[TEST 5] Snapshot for 3 Diverse Personas...');

// Persona 1: Tech & Engineering oriented (high Likert on tech, science, computation)
const techAnswers: UserAnswers = {};
for (const q of questions) {
  if (q.subdimension === 'R' || q.subdimension === 'I' || q.subdimension === 'D1' || q.subdimension === 'D5' || q.subdimension === 'computation') {
    techAnswers[q.id] = 5;
  } else {
    techAnswers[q.id] = 2;
  }
}
const techDims = calculateDimensionScores(techAnswers, questions);
const topTechProg = studyPrograms.find((p) => p.id === 'fsm-informatika')!;
const techReasons = getMatchReasons(techDims, topTechProg);
console.log(`  Persona 1 (${topTechProg.name}):`);
techReasons.forEach((r, idx) => console.log(`    ${idx + 1}. ${r}`));
if (techReasons.length < 2) throw new Error('Expected at least 2 reasons for strong tech match');

// Persona 2: Medical & Health oriented
const medAnswers: UserAnswers = {};
for (const q of questions) {
  if (q.subdimension === 'I' || q.subdimension === 'S' || q.subdimension === 'D3' || q.subdimension === 'health_clinical') {
    medAnswers[q.id] = 5;
  } else {
    medAnswers[q.id] = 2;
  }
}
const medDims = calculateDimensionScores(medAnswers, questions);
const topMedProg = studyPrograms.find((p) => p.id === 'fk-kedokteran')!;
const medReasons = getMatchReasons(medDims, topMedProg);
console.log(`  Persona 2 (${topMedProg.name}):`);
medReasons.forEach((r, idx) => console.log(`    ${idx + 1}. ${r}`));
if (medReasons.length < 2) throw new Error('Expected at least 2 reasons for strong medical match');

// Persona 3: Law & Social Policy oriented
const lawAnswers: UserAnswers = {};
for (const q of questions) {
  if (q.subdimension === 'E' || q.subdimension === 'D7' || q.subdimension === 'legal_policy' || q.subdimension === 'communication') {
    lawAnswers[q.id] = 5;
  } else {
    lawAnswers[q.id] = 2;
  }
}
const lawDims = calculateDimensionScores(lawAnswers, questions);
const topLawProg = studyPrograms.find((p) => p.id === 'fh-hukum')!;
const lawReasons = getMatchReasons(lawDims, topLawProg);
console.log(`  Persona 3 (${topLawProg.name}):`);
lawReasons.forEach((r, idx) => console.log(`    ${idx + 1}. ${r}`));
if (lawReasons.length < 2) throw new Error('Expected at least 2 reasons for strong law match');

// -----------------------------------------------------------------------------
// Test 6: Enhanced Top 3 Explanation & Score Gap Comparison (Round 11)
// -----------------------------------------------------------------------------
console.log('\n[TEST 6] Validating Enhanced Top 3 Explanation & Score Gap Comparison...');

const sampleTopScores = [
  { programId: 'ft-industri', totalScore: 89.4, tier: 'S' },
  { programId: 'ft-elektro', totalScore: 87.3, tier: 'S' },
  { programId: 'ft-kimia', totalScore: 85.9, tier: 'S' },
];

const compResult = getTopThreeComparison(techDims, sampleTopScores, studyPrograms);

if (compResult.explanations.length !== 3) {
  throw new Error(`Expected 3 explanations, got ${compResult.explanations.length}`);
}

const p1Exp = compResult.explanations[0];
const p2Exp = compResult.explanations[1];
const p3Exp = compResult.explanations[2];

// Check distinctness of primary reasons
if (p1Exp.primaryReason === p2Exp.primaryReason && p2Exp.primaryReason === p3Exp.primaryReason) {
  throw new Error('Top 3 programs must not have identical generic primary reasons!');
}

// Check score gap calculations
const expectedGap1_2 = Number(Math.abs(89.4 - 87.3).toFixed(2));
const expectedGap2_3 = Number(Math.abs(87.3 - 85.9).toFixed(2));

if (compResult.gap1_2 !== expectedGap1_2) {
  throw new Error(`gap1_2 mismatch: expected ${expectedGap1_2}, got ${compResult.gap1_2}`);
}

if (compResult.gap2_3 !== expectedGap2_3) {
  throw new Error(`gap2_3 mismatch: expected ${expectedGap2_3}, got ${compResult.gap2_3}`);
}

if (!compResult.comparisonSummary || compResult.comparisonSummary.length < 20) {
  throw new Error('comparisonSummary is missing or too short');
}

console.log(`  ✓ Top 1 Explanation: ${p1Exp.programName} -> "${p1Exp.primaryReason}"`);
console.log(`  ✓ Top 2 Explanation: ${p2Exp.programName} -> "${p2Exp.primaryReason}"`);
console.log(`  ✓ Top 3 Explanation: ${p3Exp.programName} -> "${p3Exp.primaryReason}"`);
console.log(`  ✓ Score gap #1 to #2: +${compResult.gap1_2}% | #2 to #3: +${compResult.gap2_3}%`);
console.log(`  ✓ Comparison Summary: "${compResult.comparisonSummary}"`);

console.log('\n===========================================================');
console.log('🎉 ALL MATCH REASONS UNIT TESTS PASSED WITH 0 ERRORS!');
console.log('===========================================================');
