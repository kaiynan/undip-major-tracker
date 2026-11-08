// =============================================================================
// UNDIP Major Matcher — Core Type Definitions
// =============================================================================
// Semua interface dan tipe data yang digunakan di seluruh aplikasi.
// =============================================================================

/**
 * Representasi sebuah Fakultas atau Sekolah di UNDIP.
 */
export interface Faculty {
  id: string;
  name: string;
  shortName: string;
  description: string;
  websiteUrl: string;
}

/**
 * Jalur Penerimaan Mahasiswa Baru.
 */
export interface AdmissionPathway {
  id: string;
  name: string;
  shortName: string;
  description: string;
  percentageStandard: string;
}

/**
 * Data Sumber Rujukan Daya Tampung & Kurikulum.
 */
export interface DataSource {
  id: string;
  name: string;
  url: string;
  publicationDate: string;
  retrievedAt: string;
  sourceType: 'official_portal' | 'sk_rektor' | 'snpmb' | 'pddikti';
}

/**
 * Rekor Kuota & Daya Tampung Resmi Program Studi per Tahun Akademik.
 */
export interface AdmissionQuota {
  id: string;
  programId: string;
  academicYear: string;
  snbpQuota: number | null;     // null = "Data belum tersedia", distinct from 0
  snbtQuota: number | null;
  mandiriQuota: number | null;
  otherQuota?: number | null;
  totalCapacity: number | null;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  status: 'verified' | 'provisional' | 'unavailable';
}

/**
 * Representasi sebuah Program Studi di UNDIP beserta profil minatnya.
 *
 * Profil minat terdiri dari 4 dimensi:
 * - riasecProfile: 6 nilai [R, I, A, S, E, C] masing-masing 0-10
 * - domainProfile: 12 nilai [D1-D12] masing-masing 0-10
 * - learningProfile: 8 nilai masing-masing 0-10
 * - curriculumProfile: 8 nilai masing-masing 0-10
 */
export interface StudyProgram {
  id: string;
  name: string;
  facultyId: string;
  department?: string; // Departemen resmi di bawah Fakultas/Sekolah
  departmentSourceUrl?: string; // URL bukti atau path file bukti
  departmentEvidence?: string; // Kutipan dokumen bukti
  degreeLevel: 'S1' | 'D4' | 'S2' | 'S3' | 'Profesi' | 'Spesialis';
  campusLocation?: string; // e.g., 'Semarang (Kampus Utama)', 'Batang', 'Rembang'
  description: string;
  websiteUrl: string;
  learningOutcomes: string[];
  competencies: string[];
  riasecProfile: number[]; // 6 values [R, I, A, S, E, C] each 0-10
  domainProfile: number[]; // 12 values [D1-D12] each 0-10
  learningProfile: number[]; // 8 values each 0-10
  curriculumProfile: number[]; // 8 values each 0-10
  curriculumKeywords: string[];
  academicYear: string;
  lastVerified: string;
  verificationStatus: 'verified' | 'provisional' | 'sample';
}

/**
 * Pertanyaan kuesioner yang digunakan untuk menilai minat pengguna.
 */
export interface Question {
  id: number;
  dimension: 'riasec' | 'domain' | 'learning' | 'curriculum';
  subdimension: string; // e.g., 'R', 'I', 'D1', 'D2', etc.
  text: string;
  category: string;
}

/**
 * Jawaban pengguna terhadap kuesioner (skala Likert 1-5).
 */
export interface UserAnswers {
  [questionId: number]: number; // 1-5 Likert scale
}

/**
 * Skor dimensi yang sudah dinormalisasi dari jawaban pengguna.
 */
export interface DimensionScore {
  riasec: number[];   // 6 normalized scores
  domain: number[];   // 12 normalized scores
  learning: number[]; // 8 normalized scores
  curriculum: number[]; // 8 normalized scores
}

/**
 * Skor kecocokan sebuah program studi terhadap profil pengguna.
 */
export interface ProgramScore {
  programId: string;
  totalScore: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  dimensionScores: {
    riasec: number;
    domain: number;
    learning: number;
    curriculum: number;
  };
  explanation: string;
}

/**
 * Skor agregat sebuah fakultas berdasarkan program studi di dalamnya.
 */
export interface FacultyScore {
  facultyId: string;
  aggregateScore: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  programScores: ProgramScore[];
}

/**
 * Konfigurasi ambang batas untuk setiap tier kecocokan.
 */
export interface TierThreshold {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Konfigurasi algoritma pencocokan.
 */
export interface AlgorithmConfig {
  version: string;
  weights: {
    riasec: number;
    domain: number;
    learning: number;
    curriculum: number;
  };
  tierThresholds: TierThreshold[];
}
