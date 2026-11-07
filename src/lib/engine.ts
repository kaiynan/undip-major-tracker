// =============================================================================
// UNDIP Major Matcher — HMIM (Hybrid Multi-Dimensional Interest Matching) Engine
// =============================================================================
// Mesin rekomendasi yang mencocokkan profil minat pengguna (dari 36 pertanyaan
// kuesioner) terhadap profil program studi dan fakultas di UNDIP.
//
// Formula utama:
//   S_prodi = (0.20 × R) + (0.35 × D) + (0.20 × L) + (0.25 × C)
//
// Di mana R, D, L, C adalah cosine similarity antara vektor jawaban pengguna
// dan profil program studi untuk masing-masing dimensi (RIASEC, Domain,
// Learning, Curriculum).
//
// Skor akhir dinormalisasi ke skala 0-100, lalu diklasifikasikan ke tier:
//   S (85-100), A (75-84), B (65-74), C (50-64), D (0-49)
//
// Skor fakultas = rata-rata dari 3 skor program studi tertinggi.
// =============================================================================

import {
  StudyProgram,
  UserAnswers,
  DimensionScore,
  ProgramScore,
  FacultyScore,
  Faculty,
  AlgorithmConfig,
  TierThreshold,
  Question,
} from '@/data/types';

import {
  RIASEC_INDEX,
  DOMAIN_INDEX,
  LEARNING_INDEX,
  CURRICULUM_INDEX,
} from '@/data/questions';

import { clamp, roundTo } from '@/lib/utils';

// =============================================================================
// Default Algorithm Configuration
// =============================================================================

/**
 * Konfigurasi default algoritma HMIM v1.0.
 *
 * Bobot dimensi:
 * - RIASEC: 0.20  (minat umum)
 * - Domain: 0.35  (minat bidang ilmu — bobot tertinggi)
 * - Learning: 0.20 (preferensi belajar)
 * - Curriculum: 0.25 (minat kurikulum/kompetensi)
 */
export const DEFAULT_CONFIG: AlgorithmConfig = {
  version: '1.0.0',
  weights: {
    riasec: 0.20,
    domain: 0.35,
    learning: 0.20,
    curriculum: 0.25,
  },
  tierThresholds: [
    {
      tier: 'S',
      min: 85,
      max: 100,
      label: 'Sangat Cocok',
      color: '#16a34a',
      bgColor: '#dcfce7',
    },
    {
      tier: 'A',
      min: 75,
      max: 84,
      label: 'Cocok',
      color: '#2563eb',
      bgColor: '#dbeafe',
    },
    {
      tier: 'B',
      min: 65,
      max: 74,
      label: 'Cukup Cocok',
      color: '#ca8a04',
      bgColor: '#fef9c3',
    },
    {
      tier: 'C',
      min: 50,
      max: 64,
      label: 'Kurang Cocok',
      color: '#ea580c',
      bgColor: '#ffedd5',
    },
    {
      tier: 'D',
      min: 0,
      max: 49,
      label: 'Eksplorasi Alternatif',
      color: '#dc2626',
      bgColor: '#fee2e2',
    },
  ],
};

// =============================================================================
// Core Mathematical Functions
// =============================================================================

/**
 * Menghitung cosine similarity antara dua vektor numerik.
 *
 * Cosine similarity mengukur kesamaan arah antara dua vektor, menghasilkan
 * nilai antara -1 (berlawanan sempurna) dan 1 (identik sempurna).
 *
 * Untuk kasus penggunaan kita, semua nilai non-negatif, sehingga hasilnya
 * selalu dalam rentang [0, 1].
 *
 * @param a - Vektor pertama (profil pengguna)
 * @param b - Vektor kedua (profil program studi)
 * @returns Nilai cosine similarity dalam rentang [0, 1], atau 0 jika
 *          salah satu vektor adalah vektor nol.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  // Vektor harus memiliki panjang yang sama
  const len = Math.min(a.length, b.length);
  if (len === 0) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // Handle zero vectors — if either vector has zero magnitude,
  // similarity is undefined; we return 0 (no match).
  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  const similarity = dotProduct / (magnitudeA * magnitudeB);

  // Clamp to [0, 1] to handle floating-point imprecision.
  // All our values are non-negative, so negative results should not occur,
  // but we guard against edge cases.
  return clamp(similarity, 0, 1);
}

// =============================================================================
// Dimension Score Calculation
// =============================================================================

/**
 * Menormalisasi jawaban mentah (Likert 1-5) ke skor dimensi (0-100).
 *
 * Proses:
 * 1. Mengelompokkan jawaban berdasarkan dimensi dan subdimensi.
 * 2. Untuk subdimensi dengan beberapa pertanyaan (e.g., R dan I pada RIASEC),
 *    nilai dirata-ratakan terlebih dahulu.
 * 3. Normalisasi: score = (rata-rata_jawaban - 1) / 4 × 100
 *    Ini mengubah skala 1-5 menjadi 0-100.
 *
 * @param answers - Jawaban pengguna (map question ID → nilai 1-5)
 * @param questions - Array semua pertanyaan kuesioner
 * @returns Skor dimensi yang sudah dinormalisasi
 */
export function calculateDimensionScores(
  answers: UserAnswers,
  questions: Question[]
): DimensionScore {
  // Initialize accumulators: { subdimension: { sum, count } }
  const riasecAccum: Record<string, { sum: number; count: number }> = {};
  const domainAccum: Record<string, { sum: number; count: number }> = {};
  const learningAccum: Record<string, { sum: number; count: number }> = {};
  const curriculumAccum: Record<string, { sum: number; count: number }> = {};

  // Accumulate answers by dimension and subdimension
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    // Clamp answer to valid Likert range
    const clampedAnswer = clamp(answer, 1, 5);

    const entry = { sum: clampedAnswer, count: 1 };

    switch (question.dimension) {
      case 'riasec':
        if (riasecAccum[question.subdimension]) {
          riasecAccum[question.subdimension].sum += clampedAnswer;
          riasecAccum[question.subdimension].count += 1;
        } else {
          riasecAccum[question.subdimension] = { ...entry };
        }
        break;
      case 'domain':
        if (domainAccum[question.subdimension]) {
          domainAccum[question.subdimension].sum += clampedAnswer;
          domainAccum[question.subdimension].count += 1;
        } else {
          domainAccum[question.subdimension] = { ...entry };
        }
        break;
      case 'learning':
        if (learningAccum[question.subdimension]) {
          learningAccum[question.subdimension].sum += clampedAnswer;
          learningAccum[question.subdimension].count += 1;
        } else {
          learningAccum[question.subdimension] = { ...entry };
        }
        break;
      case 'curriculum':
        if (curriculumAccum[question.subdimension]) {
          curriculumAccum[question.subdimension].sum += clampedAnswer;
          curriculumAccum[question.subdimension].count += 1;
        } else {
          curriculumAccum[question.subdimension] = { ...entry };
        }
        break;
    }
  }

  // Convert accumulators to normalized score vectors
  const riasec = buildScoreVector(riasecAccum, RIASEC_INDEX);
  const domain = buildScoreVector(domainAccum, DOMAIN_INDEX);
  const learning = buildScoreVector(learningAccum, LEARNING_INDEX);
  const curriculum = buildScoreVector(curriculumAccum, CURRICULUM_INDEX);

  return { riasec, domain, learning, curriculum };
}

/**
 * Membangun vektor skor dari akumulator jawaban menggunakan peta indeks.
 *
 * @param accum - Akumulator { subdimension: { sum, count } }
 * @param indexMap - Peta subdimension → indeks di vektor
 * @returns Vektor skor yang dinormalisasi ke 0-100
 */
function buildScoreVector(
  accum: Record<string, { sum: number; count: number }>,
  indexMap: Record<string, number>
): number[] {
  const size = Object.keys(indexMap).length;
  const vector = new Array<number>(size).fill(0);

  for (const [subdimension, index] of Object.entries(indexMap)) {
    const data = accum[subdimension];
    if (data && data.count > 0) {
      // Average the raw answers, then normalize: (avg - 1) / 4 * 100
      const avg = data.sum / data.count;
      vector[index] = ((avg - 1) / 4) * 100;
    }
    // else: remains 0 (unanswered → no interest)
  }

  return vector;
}

// =============================================================================
// Program Score Calculation
// =============================================================================

/**
 * Menghitung skor kecocokan satu program studi terhadap profil pengguna.
 *
 * Langkah:
 * 1. Normalisasi profil program studi dari skala 0-10 ke 0-100.
 * 2. Hitung cosine similarity per dimensi antara skor pengguna & profil prodi.
 * 3. Terapkan formula bobot: S = 0.20×R + 0.35×D + 0.20×L + 0.25×C
 * 4. Konversi ke skala 0-100.
 * 5. Tentukan tier berdasarkan ambang batas.
 * 6. Buat penjelasan dalam bahasa Indonesia.
 *
 * @param dimensionScores - Skor dimensi pengguna (sudah dinormalisasi 0-100)
 * @param program - Program studi yang akan dievaluasi
 * @param config - Konfigurasi algoritma
 * @returns Skor program studi lengkap dengan tier dan penjelasan
 */
export function calculateProgramScore(
  dimensionScores: DimensionScore,
  program: StudyProgram,
  config: AlgorithmConfig
): ProgramScore {
  // Step 1: Normalize program profiles from 0-10 to 0-100
  const normalizedProgramProfile = {
    riasec: normalizeProfile(program.riasecProfile, 10),
    domain: normalizeProfile(program.domainProfile, 10),
    learning: normalizeProfile(program.learningProfile, 10),
    curriculum: normalizeProfile(program.curriculumProfile, 10),
  };

  // Step 2: Calculate cosine similarity per dimension
  const simRiasec = cosineSimilarity(dimensionScores.riasec, normalizedProgramProfile.riasec);
  const simDomain = cosineSimilarity(dimensionScores.domain, normalizedProgramProfile.domain);
  const simLearning = cosineSimilarity(dimensionScores.learning, normalizedProgramProfile.learning);
  const simCurriculum = cosineSimilarity(dimensionScores.curriculum, normalizedProgramProfile.curriculum);

  // Step 3: Apply weighted formula
  // S_prodi = (0.20 × R) + (0.35 × D) + (0.20 × L) + (0.25 × C)
  const weightedScore =
    config.weights.riasec * simRiasec +
    config.weights.domain * simDomain +
    config.weights.learning * simLearning +
    config.weights.curriculum * simCurriculum;

  // Step 4: Convert to 0-100 scale
  // Cosine similarity is already 0-1, weighted sum is also 0-1
  const totalScore = roundTo(clamp(weightedScore * 100, 0, 100), 2);

  // Step 5: Get tier
  const tier = getTier(totalScore, config);

  // Step 6: Build per-dimension scores (as 0-100 for display)
  const perDimensionScores = {
    riasec: roundTo(simRiasec * 100, 2),
    domain: roundTo(simDomain * 100, 2),
    learning: roundTo(simLearning * 100, 2),
    curriculum: roundTo(simCurriculum * 100, 2),
  };

  // Step 7: Generate explanation
  const explanation = generateExplanation(
    dimensionScores,
    program,
    perDimensionScores,
    totalScore,
    tier
  );

  return {
    programId: program.id,
    totalScore,
    tier: tier.tier,
    dimensionScores: perDimensionScores,
    explanation,
  };
}

/**
 * Menormalisasi profil dari rentang [0, maxVal] ke [0, 100].
 * Menjaga proporsi relatif antar elemen.
 *
 * @param profile - Vektor profil yang akan dinormalisasi
 * @param maxVal - Nilai maksimum pada skala asli (e.g., 10)
 * @returns Vektor yang dinormalisasi ke skala 0-100
 */
function normalizeProfile(profile: number[], maxVal: number): number[] {
  if (maxVal === 0) return profile.map(() => 0);
  return profile.map((v) => (v / maxVal) * 100);
}

// =============================================================================
// Batch Score Calculation
// =============================================================================

/**
 * Menghitung skor kecocokan semua program studi, diurutkan dari skor tertinggi.
 *
 * @param answers - Jawaban pengguna
 * @param programs - Semua program studi yang tersedia
 * @param questions - Semua pertanyaan kuesioner
 * @param config - Konfigurasi algoritma (opsional, default: DEFAULT_CONFIG)
 * @returns Array ProgramScore diurutkan descending berdasarkan totalScore
 */
export function calculateAllScores(
  answers: UserAnswers,
  programs: StudyProgram[],
  questions: Question[],
  config: AlgorithmConfig = DEFAULT_CONFIG
): ProgramScore[] {
  const dimensionScores = calculateDimensionScores(answers, questions);

  const scores = programs.map((program) =>
    calculateProgramScore(dimensionScores, program, config)
  );

  // Sort descending by total score, then by program ID for stability
  scores.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return a.programId.localeCompare(b.programId);
  });

  return scores;
}

// =============================================================================
// Faculty Aggregate Score
// =============================================================================

/**
 * Menghitung skor agregat setiap fakultas berdasarkan program studi terbaiknya.
 *
 * Skor fakultas = rata-rata skor dari 3 program studi dengan skor tertinggi
 * di fakultas tersebut. Jika fakultas memiliki kurang dari 3 program studi,
 * rata-rata dihitung dari program yang tersedia.
 *
 * @param programScores - Skor semua program studi (sudah dihitung)
 * @param programs - Data semua program studi
 * @param faculties - Data semua fakultas
 * @param config - Konfigurasi algoritma (opsional)
 * @returns Array FacultyScore diurutkan descending
 */
export function calculateFacultyScores(
  programScores: ProgramScore[],
  programs: StudyProgram[],
  faculties: Faculty[],
  config: AlgorithmConfig = DEFAULT_CONFIG
): FacultyScore[] {
  // Build a lookup: programId → facultyId
  const programFacultyMap = new Map<string, string>();
  for (const program of programs) {
    programFacultyMap.set(program.id, program.facultyId);
  }

  // Group program scores by faculty
  const facultyProgramScores = new Map<string, ProgramScore[]>();
  for (const score of programScores) {
    const facultyId = programFacultyMap.get(score.programId);
    if (!facultyId) continue;

    if (!facultyProgramScores.has(facultyId)) {
      facultyProgramScores.set(facultyId, []);
    }
    facultyProgramScores.get(facultyId)!.push(score);
  }

  // Calculate aggregate score for each faculty
  const facultyScores: FacultyScore[] = faculties.map((faculty) => {
    const scores = facultyProgramScores.get(faculty.id) || [];

    // Sort programs by score descending, take top 3
    const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);
    const topN = sortedScores.slice(0, 3);

    // Average of top 3 (or fewer if faculty has < 3 programs)
    const aggregateScore =
      topN.length > 0
        ? roundTo(topN.reduce((sum, s) => sum + s.totalScore, 0) / topN.length, 2)
        : 0;

    const tier = getTier(aggregateScore, config);

    return {
      facultyId: faculty.id,
      aggregateScore,
      tier: tier.tier,
      programScores: sortedScores,
    };
  });

  // Sort faculties by aggregate score descending
  facultyScores.sort((a, b) => {
    if (b.aggregateScore !== a.aggregateScore) return b.aggregateScore - a.aggregateScore;
    return a.facultyId.localeCompare(b.facultyId);
  });

  return facultyScores;
}

// =============================================================================
// Tier Classification
// =============================================================================

/**
 * Menentukan tier kecocokan berdasarkan skor.
 *
 * Ambang batas:
 * - S: 85-100 (Sangat Cocok)
 * - A: 75-84  (Cocok)
 * - B: 65-74  (Cukup Cocok)
 * - C: 50-64  (Kurang Cocok)
 * - D: 0-49   (Tidak Cocok)
 *
 * @param score - Skor 0-100
 * @param config - Konfigurasi algoritma
 * @returns TierThreshold yang sesuai
 */
export function getTier(score: number, config: AlgorithmConfig = DEFAULT_CONFIG): TierThreshold {
  const clampedScore = clamp(score, 0, 100);

  // Urutkan ambang batas descending berdasarkan batas minimum (S: 85, A: 75, B: 65, C: 50, D: 0)
  // untuk memastikan tidak ada celah antara angka pecahan (misal 84.9)
  const sortedThresholds = [...config.tierThresholds].sort((a, b) => b.min - a.min);

  for (const threshold of sortedThresholds) {
    if (clampedScore >= threshold.min) {
      return threshold;
    }
  }

  // Fallback ke tier terendah
  return sortedThresholds[sortedThresholds.length - 1];
}

// =============================================================================
// Explanation Generation
// =============================================================================

/**
 * Label deskriptif untuk setiap dimensi dalam bahasa Indonesia.
 */
const DIMENSION_LABELS: Record<string, string> = {
  // RIASEC
  R: 'Realistik (bekerja dengan alat/mesin)',
  I: 'Investigatif (riset & analisis)',
  A: 'Artistik (kreativitas & desain)',
  S: 'Sosial (membantu & mengajar)',
  E: 'Enterprising (memimpin & berwirausaha)',
  C: 'Konvensional (organisasi & prosedur)',
  // Domain
  D1: 'Teknik & Teknologi',
  D2: 'Sains Alam',
  D3: 'Medis & Kesehatan',
  D4: 'Matematika & Data',
  D5: 'Komputer & Digital',
  D6: 'Ekonomi & Bisnis',
  D7: 'Hukum & Pemerintahan',
  D8: 'Sosial & Politik',
  D9: 'Psikologi & Perilaku',
  D10: 'Pertanian & Peternakan',
  D11: 'Kelautan & Perikanan',
  D12: 'Humaniora & Komunikasi',
};

/**
 * Menghasilkan penjelasan rekomendasi dalam bahasa Indonesia.
 *
 * Penjelasan didasarkan pada dimensi mana yang paling cocok antara profil
 * pengguna dan profil program studi.
 */
function generateExplanation(
  dimensionScores: DimensionScore,
  program: StudyProgram,
  perDimensionScores: { riasec: number; domain: number; learning: number; curriculum: number },
  totalScore: number,
  tier: TierThreshold
): string {
  const parts: string[] = [];

  // Overall tier statement
  parts.push(
    `Program studi ${program.name} memiliki tingkat kecocokan "${tier.label}" dengan skor ${totalScore}/100.`
  );

  // Find the strongest matching dimension
  const dimEntries = [
    { name: 'Minat Umum (RIASEC)', score: perDimensionScores.riasec },
    { name: 'Bidang Ilmu', score: perDimensionScores.domain },
    { name: 'Preferensi Belajar', score: perDimensionScores.learning },
    { name: 'Minat Kurikulum', score: perDimensionScores.curriculum },
  ];
  dimEntries.sort((a, b) => b.score - a.score);
  const strongest = dimEntries[0];

  if (strongest.score > 70) {
    parts.push(
      `Kecocokan terkuat kamu ada di dimensi ${strongest.name} (${strongest.score}%).`
    );
  }

  // Find top 2 matching RIASEC types from user profile
  const riasecKeys = Object.keys(RIASEC_INDEX);
  const userRiasecRanked = riasecKeys
    .map((key) => ({ key, score: dimensionScores.riasec[RIASEC_INDEX[key]] }))
    .sort((a, b) => b.score - a.score);

  const topRiasec = userRiasecRanked.slice(0, 2).filter((r) => r.score > 25);
  if (topRiasec.length > 0) {
    const riasecStr = topRiasec
      .map((r) => DIMENSION_LABELS[r.key] || r.key)
      .join(' dan ');
    parts.push(`Tipe minat utamamu: ${riasecStr}.`);
  }

  // Find top matching domain
  const domainKeys = Object.keys(DOMAIN_INDEX);
  const userDomainRanked = domainKeys
    .map((key) => ({ key, score: dimensionScores.domain[DOMAIN_INDEX[key]] }))
    .sort((a, b) => b.score - a.score);

  const topDomain = userDomainRanked[0];
  if (topDomain && topDomain.score > 50) {
    const domainLabel = DIMENSION_LABELS[topDomain.key] || topDomain.key;
    parts.push(`Minat bidang ilmu terbesarmu: ${domainLabel}.`);
  }

  return parts.join(' ');
}
