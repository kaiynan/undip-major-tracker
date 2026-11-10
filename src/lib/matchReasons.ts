import {
  StudyProgram,
  DimensionScore,
  AlgorithmConfig,
} from '@/data/types';
import {
  RIASEC_INDEX,
  DOMAIN_INDEX,
  LEARNING_INDEX,
  CURRICULUM_INDEX,
} from '@/data/questions';
import { DEFAULT_CONFIG, cosineSimilarity } from '@/lib/engine';
import { clamp, roundTo } from '@/lib/utils';

// =============================================================================
// Indonesian Descriptive Subdimension Labels (Neutral, Clear, Plain Language)
// =============================================================================

export const SUBDIMENSION_LABELS: {
  riasec: Record<string, string>;
  domain: Record<string, string>;
  learning: Record<string, string>;
  curriculum: Record<string, string>;
} = {
  riasec: {
    R: 'Realistik & Praktis',
    I: 'Investigatif & Analitis',
    A: 'Artistik & Kreatif',
    S: 'Sosial & Edukatif',
    E: 'Enterprising & Kepemimpinan',
    C: 'Konvensional & Prosedural',
  },
  domain: {
    D1: 'Teknik & Rekayasa',
    D2: 'Sains Alam & Eksakta',
    D3: 'Medis & Kesehatan',
    D4: 'Matematika & Analisis Data',
    D5: 'Komputer & Sistem Digital',
    D6: 'Ekonomi, Bisnis & Manajemen',
    D7: 'Hukum & Tata Kelola Regulasi',
    D8: 'Sosial & Kebijakan Publik',
    D9: 'Psikologi & Perilaku Manusia',
    D10: 'Pertanian, Peternakan & Pangan',
    D11: 'Kelautan & Sumber Daya Bahari',
    D12: 'Humaniora, Budaya & Komunikasi',
  },
  learning: {
    experimental: 'Praktik Laboratorium & Eksperimen',
    analytical: 'Analisis Logika & Pemecahan Masalah',
    design: 'Perancangan & Pemodelan Konseptual',
    field: 'Eksplorasi Lapangan & Observasi Nyata',
    human: 'Interaksi & Pendampingan Masyarakat',
    business: 'Perencanaan Strategis & Proyek',
    research: 'Kajian Literatur & Riset Ilmiah',
    communication: 'Komunikasi Publik & Narasi Terstruktur',
  },
  curriculum: {
    lab_engineering: 'Kurikulum Terapan & Rekayasa Sistem',
    health_clinical: 'Kompetensi Klinis & Pelayanan Medis',
    computation: 'Algoritma Komputasi & Pemrosesan Data',
    legal_policy: 'Telaah Peraturan & Argumentasi Kebijakan',
    social_research: 'Metodologi Penelitian Sosial Masyarakat',
    creative_cultural: 'Kajian Bahasa, Budaya & Karya Kreatif',
    env_marine: 'Pengelolaan Lingkungan Hidup & Pesisir',
    business_finance: 'Strategi Finansial & Tata Kelola Bisnis',
  },
};

// =============================================================================
// Interfaces for Breakdown & Match Reasons
// =============================================================================

export interface DimensionContribution {
  dimension: 'domain' | 'curriculum' | 'learning' | 'riasec';
  dimensionLabel: string;
  weight: number;
  similarity: number;
  contribution: number; // weight * similarity * 100
  topSubdimensionKey: string | null;
  topSubdimensionLabel: string | null;
  topSubdimensionProduct: number;
}

export interface ScoreBreakdown {
  riasec: DimensionContribution;
  domain: DimensionContribution;
  learning: DimensionContribution;
  curriculum: DimensionContribution;
  contributions: {
    riasec: number;
    domain: number;
    learning: number;
    curriculum: number;
  };
  weightedSum: number; // raw weighted sum (0-100)
  roundedScore: number; // roundTo(clamp(weightedSum, 0, 100), 2)
}

/**
 * Normalizes program profile from 0-10 scale to 0-100 scale.
 */
function normalizeProfile(profile: number[], maxVal: number = 10): number[] {
  if (maxVal === 0) return profile.map(() => 0);
  return profile.map((v) => (v / maxVal) * 100);
}

/**
 * Pure function that computes the exact mathematical per-component breakdown
 * of an HMIM score for a given program.
 *
 * Formula:
 *   S_dim = weight_dim * similarity_dim * 100
 *   weightedSum = S_domain + S_curriculum + S_learning + S_riasec
 *
 * Guaranteed to match official engine scoring (tolerance 1e-9).
 */
export function computeScoreBreakdown(
  dimensionScores: DimensionScore,
  program: StudyProgram,
  config: AlgorithmConfig = DEFAULT_CONFIG
): ScoreBreakdown {
  const normRiasec = normalizeProfile(program.riasecProfile, 10);
  const normDomain = normalizeProfile(program.domainProfile, 10);
  const normLearning = normalizeProfile(program.learningProfile, 10);
  const normCurriculum = normalizeProfile(program.curriculumProfile, 10);

  const simRiasec = cosineSimilarity(dimensionScores.riasec, normRiasec);
  const simDomain = cosineSimilarity(dimensionScores.domain, normDomain);
  const simLearning = cosineSimilarity(dimensionScores.learning, normLearning);
  const simCurriculum = cosineSimilarity(dimensionScores.curriculum, normCurriculum);

  const cRiasec = config.weights.riasec * simRiasec * 100;
  const cDomain = config.weights.domain * simDomain * 100;
  const cLearning = config.weights.learning * simLearning * 100;
  const cCurriculum = config.weights.curriculum * simCurriculum * 100;

  const weightedSum = cRiasec + cDomain + cLearning + cCurriculum;
  const roundedScore = roundTo(clamp(weightedSum, 0, 100), 2);

  // Identify top subdimension for each dimension
  const findTopSubdimension = (
    userVec: number[],
    progNormVec: number[],
    indexMap: Record<string, number>,
    labelMap: Record<string, string>
  ) => {
    let bestKey: string | null = null;
    let bestProd = -1;

    for (const [key, idx] of Object.entries(indexMap)) {
      const u = userVec[idx] || 0;
      const p = progNormVec[idx] || 0;
      const prod = u * p;
      if (prod > bestProd) {
        bestProd = prod;
        bestKey = key;
      }
    }

    // Only assign label if product is strictly positive (> 0)
    const valid = bestProd > 0 && bestKey !== null;
    return {
      key: valid ? bestKey : null,
      label: valid && bestKey ? labelMap[bestKey] || bestKey : null,
      product: valid ? bestProd : 0,
    };
  };

  const topRiasec = findTopSubdimension(
    dimensionScores.riasec,
    normRiasec,
    RIASEC_INDEX,
    SUBDIMENSION_LABELS.riasec
  );
  const topDomain = findTopSubdimension(
    dimensionScores.domain,
    normDomain,
    DOMAIN_INDEX,
    SUBDIMENSION_LABELS.domain
  );
  const topLearning = findTopSubdimension(
    dimensionScores.learning,
    normLearning,
    LEARNING_INDEX,
    SUBDIMENSION_LABELS.learning
  );
  const topCurriculum = findTopSubdimension(
    dimensionScores.curriculum,
    normCurriculum,
    CURRICULUM_INDEX,
    SUBDIMENSION_LABELS.curriculum
  );

  return {
    riasec: {
      dimension: 'riasec',
      dimensionLabel: 'Minat Umum (RIASEC)',
      weight: config.weights.riasec,
      similarity: simRiasec,
      contribution: cRiasec,
      topSubdimensionKey: topRiasec.key,
      topSubdimensionLabel: topRiasec.label,
      topSubdimensionProduct: topRiasec.product,
    },
    domain: {
      dimension: 'domain',
      dimensionLabel: 'Bidang Keilmuan',
      weight: config.weights.domain,
      similarity: simDomain,
      contribution: cDomain,
      topSubdimensionKey: topDomain.key,
      topSubdimensionLabel: topDomain.label,
      topSubdimensionProduct: topDomain.product,
    },
    learning: {
      dimension: 'learning',
      dimensionLabel: 'Preferensi Belajar',
      weight: config.weights.learning,
      similarity: simLearning,
      contribution: cLearning,
      topSubdimensionKey: topLearning.key,
      topSubdimensionLabel: topLearning.label,
      topSubdimensionProduct: topLearning.product,
    },
    curriculum: {
      dimension: 'curriculum',
      dimensionLabel: 'Minat Kurikulum',
      weight: config.weights.curriculum,
      similarity: simCurriculum,
      contribution: cCurriculum,
      topSubdimensionKey: topCurriculum.key,
      topSubdimensionLabel: topCurriculum.label,
      topSubdimensionProduct: topCurriculum.product,
    },
    contributions: {
      riasec: cRiasec,
      domain: cDomain,
      learning: cLearning,
      curriculum: cCurriculum,
    },
    weightedSum,
    roundedScore,
  };
}

// =============================================================================
// Sentence Templates for Match Reasons (Tone: Neutral, Encouraging, No Guarantees)
// =============================================================================

/**
 * Builds a single reason string from a dimension contribution.
 * Strictly adheres to tone rules:
 * - Neutral & encouraging
 * - No claims about admission chances or passing PTN selection
 * - No guarantees of career success or salary
 * - Concise (max 2 lines on phones)
 */
function buildDimensionReason(contrib: DimensionContribution): string | null {
  if (contrib.contribution <= 0 || !contrib.topSubdimensionLabel) {
    return null;
  }

  const label = contrib.topSubdimensionLabel;

  switch (contrib.dimension) {
    case 'domain':
      return `Minat pada bidang ${label} selaras dengan fokus materi utama prodi ini.`;
    case 'curriculum':
      return `Ketertarikan pada kurikulum ${label} sesuai dengan kompetensi yang dikembangkan di prodi ini.`;
    case 'riasec':
      return `Karakteristik minat ${label}-mu mendukung metode eksplorasi akademik di prodi ini.`;
    case 'learning':
      return `Preferensi belajar ${label} sejalan dengan aktivitas perkuliahan prodi ini.`;
    default:
      return null;
  }
}

/**
 * Generates 2-3 concise, personalized match reasons in plain Indonesian
 * for a ranked program based on its top contributing dimensions.
 *
 * Rules:
 * - Deterministic output.
 * - Only references dimensions with strictly positive contributions (> 0).
 * - No duplicate reasons.
 * - Hides (returns empty array []) when data is missing or contributions are 0.
 * - Returns at most `maxReasons` (default 3, minimum 2 if available).
 */
export function getMatchReasons(
  dimensionScores: DimensionScore | null | undefined,
  program: StudyProgram | null | undefined,
  maxReasons: number = 3,
  config: AlgorithmConfig = DEFAULT_CONFIG
): string[] {
  if (!dimensionScores || !program) {
    return [];
  }

  const breakdown = computeScoreBreakdown(dimensionScores, program, config);

  // Collect the 4 dimension contributions
  const candidateDims: DimensionContribution[] = [
    breakdown.domain,
    breakdown.curriculum,
    breakdown.riasec,
    breakdown.learning,
  ];

  // Filter to positive contributions with valid subdimensions
  const validDims = candidateDims.filter(
    (dim) => dim.contribution > 0.05 && dim.topSubdimensionProduct > 0 && dim.topSubdimensionLabel
  );

  // Sort descending by contribution to THAT program
  validDims.sort((a, b) => b.contribution - a.contribution);

  const reasons: string[] = [];
  const seenTexts = new Set<string>();

  for (const dim of validDims) {
    if (reasons.length >= maxReasons) break;
    const text = buildDimensionReason(dim);
    if (text && !seenTexts.has(text)) {
      seenTexts.add(text);
      reasons.push(text);
    }
  }

  return reasons;
}

// =============================================================================
// Top 3 Enhanced Recommendation Explanation & Comparison Helpers (Round 11)
// =============================================================================

export interface TopProgramExplanation {
  programId: string;
  programName: string;
  facultyName: string;
  rank: number;
  score: number;
  tier: string;
  primaryReason: string;
  dominantDimension: {
    name: string;
    weightPercent: number;
    subdimension: string;
    contribution: number;
  };
  interestAlignment: string;
  explorationTip: string;
  curriculumHighlights: string[];
}

export interface TopThreeComparison {
  explanations: TopProgramExplanation[];
  gap1_2: number;
  gap2_3: number;
  comparisonSummary: string;
}

/**
 * Builds an in-depth, structured explanation for a top-ranked program
 * based on its exact score decomposition and curriculum data.
 */
export function getTopProgramExplanation(
  dimensionScores: DimensionScore,
  program: StudyProgram,
  score: number,
  tier: string,
  rank: number,
  facultyName: string = ''
): TopProgramExplanation {
  const breakdown = computeScoreBreakdown(dimensionScores, program);

  // Determine top contributing dimension
  const dims: DimensionContribution[] = [
    breakdown.domain,
    breakdown.curriculum,
    breakdown.riasec,
    breakdown.learning,
  ].sort((a, b) => b.contribution - a.contribution);

  const topDim = dims[0];
  const subLabel = topDim.topSubdimensionLabel || topDim.dimensionLabel;

  let primaryReason = '';
  switch (topDim.dimension) {
    case 'domain':
      primaryReason = `Minat pada bidang ${subLabel} memberikan keselarasan terbesar (${topDim.contribution.toFixed(1)} poin) terhadap materi pokok prodi ini.`;
      break;
    case 'curriculum':
      primaryReason = `Ketertarikan pada kurikulum ${subLabel} sejalan dengan kompetensi inti yang dikembangkan dalam pembelajaran prodi ini.`;
      break;
    case 'riasec':
      primaryReason = `Karakter minat ${subLabel}-mu mendukung gaya eksplorasi akademik dan metode studi di prodi ini.`;
      break;
    case 'learning':
      primaryReason = `Preferensi belajar ${subLabel} sangat cocok dengan pola perkuliahan dan praktikum di prodi ini.`;
      break;
  }

  const interestAlignment = `Keselarasan didukung oleh ketertarikan pada ${subLabel}, sejalan dengan kurikulum ${program.degreeLevel} ${program.name}.`;

  const highlights = (program.curriculumKeywords && program.curriculumKeywords.length > 0)
    ? program.curriculumKeywords.slice(0, 3)
    : (program.competencies && program.competencies.length > 0)
    ? program.competencies.slice(0, 3)
    : [];

  const explorationTip = highlights.length > 0
    ? `Cari tahu lebih lanjut mengenai mata kuliah seperti ${highlights.join(', ')} untuk memahami kegiatan perkuliahannya.`
    : `Telusuri kurikulum dan prospek bidang ini di laman resmi fakultas.`;

  return {
    programId: program.id,
    programName: program.name,
    facultyName,
    rank,
    score,
    tier,
    primaryReason,
    dominantDimension: {
      name: topDim.dimensionLabel,
      weightPercent: Math.round(topDim.weight * 100),
      subdimension: subLabel,
      contribution: roundTo(topDim.contribution, 2),
    },
    interestAlignment,
    explorationTip,
    curriculumHighlights: highlights,
  };
}

/**
 * Computes comparative contrast and score gap explanations across top 3 recommendations.
 */
export function getTopThreeComparison(
  dimensionScores: DimensionScore,
  topThree: { programId: string; totalScore: number; tier: string }[],
  allPrograms: StudyProgram[],
  facultyLookup: Record<string, string> = {}
): TopThreeComparison {
  const explanations: TopProgramExplanation[] = [];

  for (let i = 0; i < Math.min(3, topThree.length); i++) {
    const item = topThree[i];
    const prog = allPrograms.find((p) => p.id === item.programId);
    if (prog) {
      const facName = facultyLookup[prog.facultyId] || prog.facultyId;
      explanations.push(
        getTopProgramExplanation(dimensionScores, prog, item.totalScore, item.tier, i + 1, facName)
      );
    }
  }

  const gap1_2 = explanations.length >= 2 ? roundTo(Math.abs(explanations[0].score - explanations[1].score), 2) : 0;
  const gap2_3 = explanations.length >= 3 ? roundTo(Math.abs(explanations[1].score - explanations[2].score), 2) : 0;

  let comparisonSummary = '';
  if (explanations.length >= 2) {
    const p1 = explanations[0];
    const p2 = explanations[1];

    if (gap1_2 < 1.0) {
      comparisonSummary = `Pilihan #1 (${p1.programName}) dan #2 (${p2.programName}) memiliki skor yang sangat berdekatan (selisih ${gap1_2.toFixed(1)}%), menunjukkan keselarasan minat yang seimbang antara fokus ${p1.dominantDimension.subdimension} dan ${p2.dominantDimension.subdimension}.`;
    } else {
      comparisonSummary = `Pilihan #1 (${p1.programName}) unggul ${gap1_2.toFixed(1)}% di atas #2 (${p2.programName}), didorong oleh kecocokan lebih tinggi pada dimensi ${p1.dominantDimension.name}.`;
    }

    if (explanations.length >= 3) {
      const p3 = explanations[2];
      comparisonSummary += ` Sementara pilihan #3 (${p3.programName}) menjadi alternatif kuat berikutnya dengan fokus pada ${p3.dominantDimension.subdimension}.`;
    }
  }

  return {
    explanations,
    gap1_2,
    gap2_3,
    comparisonSummary,
  };
}
