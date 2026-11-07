// =============================================================================
// UNDIP Major Matcher — Kuesioner 36 Pertanyaan
// =============================================================================
// 36 pertanyaan dalam bahasa Indonesia, dibagi ke 4 dimensi:
//   A. RIASEC (8 pertanyaan, ID 1-8)
//   B. Domain-Specific Interest (12 pertanyaan, ID 9-20)
//   C. Learning & Activity Preference (8 pertanyaan, ID 21-28)
//   D. Curriculum & Competency Interest (8 pertanyaan, ID 29-36)
//
// Setiap pertanyaan dijawab dengan skala Likert 1-5:
//   1 = Sangat Tidak Tertarik
//   2 = Tidak Tertarik
//   3 = Netral
//   4 = Tertarik
//   5 = Sangat Tertarik
// =============================================================================

import { Question } from './types';

export const questions: Question[] = [
  // =========================================================================
  // A. RIASEC — Minat Umum (8 pertanyaan)
  // =========================================================================
  // R dan I masing-masing mendapat 2 pertanyaan karena paling relevan
  // untuk pencocokan program studi universitas.
  // =========================================================================
  {
    id: 1,
    dimension: 'riasec',
    subdimension: 'R',
    text: 'Seberapa tertarik kamu untuk bekerja dengan mesin, alat, atau bahan bangunan?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 2,
    dimension: 'riasec',
    subdimension: 'R',
    text: 'Seberapa tertarik kamu untuk merakit, memperbaiki, atau membuat sesuatu dengan tanganmu sendiri?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 3,
    dimension: 'riasec',
    subdimension: 'I',
    text: 'Seberapa tertarik kamu untuk melakukan eksperimen atau penelitian ilmiah?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 4,
    dimension: 'riasec',
    subdimension: 'I',
    text: 'Seberapa tertarik kamu untuk menganalisis data dan mencari tahu penyebab suatu masalah?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 5,
    dimension: 'riasec',
    subdimension: 'A',
    text: 'Seberapa tertarik kamu untuk berkarya seni, menulis, atau mendesain sesuatu yang kreatif?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 6,
    dimension: 'riasec',
    subdimension: 'S',
    text: 'Seberapa tertarik kamu untuk membantu, mengajar, atau membimbing orang lain?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 7,
    dimension: 'riasec',
    subdimension: 'E',
    text: 'Seberapa tertarik kamu untuk memimpin tim, membuat keputusan, atau memulai usaha?',
    category: 'Minat Umum (RIASEC)',
  },
  {
    id: 8,
    dimension: 'riasec',
    subdimension: 'C',
    text: 'Seberapa tertarik kamu untuk mengorganisir data, mengatur jadwal, atau bekerja dengan prosedur yang terstruktur?',
    category: 'Minat Umum (RIASEC)',
  },

  // =========================================================================
  // B. Domain-Specific Interest (12 pertanyaan, D1-D12)
  // =========================================================================
  {
    id: 9,
    dimension: 'domain',
    subdimension: 'D1',
    text: 'Seberapa tertarik kamu untuk mempelajari cara kerja mesin, bangunan, atau sistem industri?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 10,
    dimension: 'domain',
    subdimension: 'D2',
    text: 'Seberapa tertarik kamu untuk mempelajari fenomena alam seperti reaksi kimia, fisika, atau biologi?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 11,
    dimension: 'domain',
    subdimension: 'D3',
    text: 'Seberapa tertarik kamu untuk mempelajari tubuh manusia, penyakit, dan cara menjaga kesehatan?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 12,
    dimension: 'domain',
    subdimension: 'D4',
    text: 'Seberapa tertarik kamu untuk bekerja dengan angka, rumus matematika, atau analisis statistik?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 13,
    dimension: 'domain',
    subdimension: 'D5',
    text: 'Seberapa tertarik kamu untuk membuat program komputer, aplikasi, atau sistem digital?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 14,
    dimension: 'domain',
    subdimension: 'D6',
    text: 'Seberapa tertarik kamu untuk mempelajari ekonomi, bisnis, atau manajemen keuangan?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 15,
    dimension: 'domain',
    subdimension: 'D7',
    text: 'Seberapa tertarik kamu untuk mempelajari hukum, peraturan, atau tata kelola pemerintahan?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 16,
    dimension: 'domain',
    subdimension: 'D8',
    text: 'Seberapa tertarik kamu untuk mempelajari isu sosial, politik, atau hubungan internasional?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 17,
    dimension: 'domain',
    subdimension: 'D9',
    text: 'Seberapa tertarik kamu untuk memahami perilaku manusia, emosi, atau proses berpikir?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 18,
    dimension: 'domain',
    subdimension: 'D10',
    text: 'Seberapa tertarik kamu untuk mempelajari pertanian, peternakan, atau pengolahan pangan?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 19,
    dimension: 'domain',
    subdimension: 'D11',
    text: 'Seberapa tertarik kamu untuk mempelajari kehidupan laut, perikanan, atau oseanografi?',
    category: 'Minat Bidang Ilmu',
  },
  {
    id: 20,
    dimension: 'domain',
    subdimension: 'D12',
    text: 'Seberapa tertarik kamu untuk mempelajari bahasa, sastra, budaya, atau komunikasi massa?',
    category: 'Minat Bidang Ilmu',
  },

  // =========================================================================
  // C. Learning & Activity Preference (8 pertanyaan)
  // =========================================================================
  {
    id: 21,
    dimension: 'learning',
    subdimension: 'experimental',
    text: 'Seberapa suka kamu melakukan percobaan atau eksperimen di laboratorium?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 22,
    dimension: 'learning',
    subdimension: 'analytical',
    text: 'Seberapa suka kamu menganalisis informasi, membuat grafik, atau memecahkan teka-teki logika?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 23,
    dimension: 'learning',
    subdimension: 'design',
    text: 'Seberapa suka kamu mendesain, menggambar, atau membuat model suatu produk atau bangunan?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 24,
    dimension: 'learning',
    subdimension: 'field',
    text: 'Seberapa suka kamu melakukan kegiatan di lapangan, survei, atau eksplorasi lingkungan?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 25,
    dimension: 'learning',
    subdimension: 'human',
    text: 'Seberapa suka kamu berinteraksi langsung dengan orang lain untuk membantu menyelesaikan masalah mereka?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 26,
    dimension: 'learning',
    subdimension: 'business',
    text: 'Seberapa suka kamu membuat rencana bisnis, mengelola proyek, atau mempresentasikan ide?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 27,
    dimension: 'learning',
    subdimension: 'research',
    text: 'Seberapa suka kamu membaca jurnal ilmiah, mengumpulkan data, dan menyusun laporan penelitian?',
    category: 'Preferensi Belajar & Aktivitas',
  },
  {
    id: 28,
    dimension: 'learning',
    subdimension: 'communication',
    text: 'Seberapa suka kamu menulis artikel, membuat konten, atau berbicara di depan umum?',
    category: 'Preferensi Belajar & Aktivitas',
  },

  // =========================================================================
  // D. Curriculum & Competency Interest (8 pertanyaan)
  // =========================================================================
  {
    id: 29,
    dimension: 'curriculum',
    subdimension: 'lab_engineering',
    text: 'Seberapa tertarik kamu untuk merancang dan menguji proses produksi di pabrik atau industri?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 30,
    dimension: 'curriculum',
    subdimension: 'health_clinical',
    text: 'Seberapa tertarik kamu untuk memeriksa pasien, mendiagnosis penyakit, atau meracik obat?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 31,
    dimension: 'curriculum',
    subdimension: 'computation',
    text: 'Seberapa tertarik kamu untuk membuat algoritma, mengolah big data, atau mengembangkan kecerdasan buatan?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 32,
    dimension: 'curriculum',
    subdimension: 'legal_policy',
    text: 'Seberapa tertarik kamu untuk menganalisis kasus hukum, menyusun peraturan, atau membela hak seseorang?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 33,
    dimension: 'curriculum',
    subdimension: 'social_research',
    text: 'Seberapa tertarik kamu untuk melakukan survei sosial, wawancara masyarakat, atau menganalisis kebijakan publik?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 34,
    dimension: 'curriculum',
    subdimension: 'creative_cultural',
    text: 'Seberapa tertarik kamu untuk menerjemahkan teks, menganalisis karya sastra, atau melestarikan budaya?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 35,
    dimension: 'curriculum',
    subdimension: 'env_marine',
    text: 'Seberapa tertarik kamu untuk meneliti ekosistem, menganalisis kualitas air, atau mengelola sumber daya alam?',
    category: 'Minat Kurikulum & Kompetensi',
  },
  {
    id: 36,
    dimension: 'curriculum',
    subdimension: 'business_finance',
    text: 'Seberapa tertarik kamu untuk mengaudit laporan keuangan, menganalisis pasar saham, atau menyusun strategi bisnis?',
    category: 'Minat Kurikulum & Kompetensi',
  },
];

// =============================================================================
// Subdimension index maps — used by the engine to map subdimensions to
// their position in each profile vector.
// =============================================================================

/** Maps RIASEC codes to indices in the 6-element riasecProfile. */
export const RIASEC_INDEX: Record<string, number> = {
  R: 0,
  I: 1,
  A: 2,
  S: 3,
  E: 4,
  C: 5,
};

/** Maps domain subdimension codes to indices in the 12-element domainProfile. */
export const DOMAIN_INDEX: Record<string, number> = {
  D1: 0,
  D2: 1,
  D3: 2,
  D4: 3,
  D5: 4,
  D6: 5,
  D7: 6,
  D8: 7,
  D9: 8,
  D10: 9,
  D11: 10,
  D12: 11,
};

/** Maps learning preference subdimension codes to indices in the 8-element learningProfile. */
export const LEARNING_INDEX: Record<string, number> = {
  experimental: 0,
  analytical: 1,
  design: 2,
  field: 3,
  human: 4,
  business: 5,
  research: 6,
  communication: 7,
};

/** Maps curriculum competency subdimension codes to indices in the 8-element curriculumProfile. */
export const CURRICULUM_INDEX: Record<string, number> = {
  lab_engineering: 0,
  health_clinical: 1,
  computation: 2,
  legal_policy: 3,
  social_research: 4,
  creative_cultural: 5,
  env_marine: 6,
  business_finance: 7,
};
