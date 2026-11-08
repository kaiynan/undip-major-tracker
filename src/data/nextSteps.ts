// =============================================================================
// UNDIP Major Matcher — Panduan Langkah Selanjutnya (DATA VERIFIED)
// =============================================================================
// Seluruh data berstatus 'official' wajib memiliki `evidence` yang merujuk
// langsung ke dokumen fisik di docs/sources/ dan tanggal rilis resmi.
//
// status:
//   'official'  = isi cocok dengan dokumen resmi (wajib ada `evidence`)
//   'reference' = acuan tahun lalu, BUKAN jadwal resmi tahun ini
//   'pending'   = belum diverifikasi / menunggu data resmi
// =============================================================================

export interface NextStepSource {
  sourceUrl: string;
  retrievedAt: string;
  status: 'official' | 'reference' | 'pending';
  /** Bukti: nama file di docs/sources/ atau kutipan singkat + halaman. Wajib jika status 'official'. */
  evidence?: string;
}

export interface UKTGroup {
  group: number;
  label: string;
  nominalRange: string;
  description: string;
}

export interface UKTInformation extends NextStepSource {
  title: string;
  summary: string;
  groups: UKTGroup[];
  verificationNote: string;
  ipiNote: string;
  officialDecisionUrl: string;
}

export interface KIPKCriteria {
  category: string;
  details: string[];
}

export interface KIPKBenefit {
  title: string;
  description: string;
}

export interface KIPKInformation extends NextStepSource {
  title: string;
  summary: string;
  portalUrl: string;
  criteria: KIPKCriteria[];
  benefits: KIPKBenefit[];
  registrationSteps: { step: number; title: string; description: string }[];
}

export interface CalendarTimelineItem {
  stage: string;
  estimatedPeriod: string;
  note?: string;
}

export interface SelectionPathwayTimeline {
  pathwayId: 'snbp' | 'snbt' | 'um';
  pathwayName: string;
  shortName: string;
  quotaShare: string;
  description: string;
  timeline: CalendarTimelineItem[];
}

export interface SelectionCalendarInformation extends NextStepSource {
  title: string;
  disclaimer2027: string;
  pathways: SelectionPathwayTimeline[];
}

export interface NextStepsData {
  disclaimerFooter: string;
  ukt: UKTInformation;
  kipk: KIPKInformation;
  calendar: SelectionCalendarInformation;
}

const WAITING_SCHEDULE = 'Menunggu jadwal resmi';

export const nextStepsData: NextStepsData = {
  disclaimerFooter:
    'Informasi dapat berubah sewaktu-waktu. Selalu merujuk ke situs resmi PMB UNDIP dan SNPMB untuk angka dan jadwal terbaru.',

  ukt: {
    title: 'Biaya Kuliah — Uang Kuliah Tunggal (UKT)',
    summary:
      'UKT adalah biaya kuliah per semester yang dibagi ke dalam 8 golongan untuk Program Sarjana (7 golongan untuk Sarjana Terapan Vokasi) berdasarkan kemampuan ekonomi orang tua atau penanggung biaya. Besaran tiap golongan berbeda untuk setiap program studi sesuai ketetapan resmi Rektor UNDIP.',
    sourceUrl: 'https://pmb.undip.ac.id/biaya-pendidikan/',
    officialDecisionUrl: 'https://pmb.undip.ac.id/biaya-pendidikan/',
    retrievedAt: '2026-01-14',
    status: 'official',
    evidence: 'docs/sources/Biaya-Pendidikan-Program-Sarjana-dan-Diploma4-SNBP-SNBT.pdf',
    verificationNote:
      'Data nominal resmi TA 2026/2027 bersumber dari Lampiran SK Penetapan UKT Mahasiswa Baru Jalur SNBP/SNBT/UM.',
    ipiNote:
      'Iuran Pengembangan Institusi (IPI) / uang pangkal hanya dikenakan pada jalur Ujian Mandiri (UM); mahasiswa yang diterima melalui jalur nasional SNBP dan SNBT bebas IPI dan hanya membayar UKT.',
    groups: [
      { group: 1, label: 'Golongan 1', nominalRange: 'Rp500.000', description: 'Tarif bersubsidi penuh untuk seluruh program studi S1 & D4.' },
      { group: 2, label: 'Golongan 2', nominalRange: 'Rp1.000.000', description: 'Tarif bersubsidi untuk seluruh program studi S1 & D4.' },
      { group: 3, label: 'Golongan 3', nominalRange: 'Rp2.000.000 – Rp5.000.000', description: 'Ditetapkan berdasarkan klaster program studi dan verifikasi ekonomi.' },
      { group: 4, label: 'Golongan 4', nominalRange: 'Rp3.000.000 – Rp10.000.000', description: 'Ditetapkan berdasarkan klaster program studi dan verifikasi ekonomi.' },
      { group: 5, label: 'Golongan 5', nominalRange: 'Rp4.000.000 – Rp14.000.000', description: 'Ditetapkan berdasarkan klaster program studi dan verifikasi ekonomi.' },
      { group: 6, label: 'Golongan 6', nominalRange: 'Rp5.000.000 – Rp18.000.000', description: 'Ditetapkan berdasarkan klaster program studi dan verifikasi ekonomi.' },
      { group: 7, label: 'Golongan 7', nominalRange: 'Rp6.000.000 – Rp20.000.000', description: 'Golongan tertinggi untuk D4 Vokasi (maks. Rp8.500.000) dan sub-puncak S1.' },
      { group: 8, label: 'Golongan 8', nominalRange: 'Rp6.400.000 – Rp22.000.000', description: 'Golongan tertinggi untuk Program Sarjana (bervariasi per prodi, maks. Kedokteran).' },
    ],
  },

  kipk: {
    title: 'Beasiswa KIP-Kuliah (Kartu Indonesia Pintar Kuliah)',
    summary:
      'KIP-Kuliah adalah bantuan biaya pendidikan dari pemerintah bagi lulusan SMA/SMK/MA sederajat yang berprestasi dan memiliki keterbatasan ekonomi. Syarat, besaran bantuan, dan jadwal mengikuti ketentuan resmi tahun berjalan.',
    sourceUrl: 'https://kip-kuliah.kemdikbud.go.id/',
    portalUrl: 'https://kip-kuliah.kemdikbud.go.id/',
    retrievedAt: '2026-11-08',
    status: 'pending',
    criteria: [
      {
        category: 'Gambaran Umum Persyaratan',
        details: [
          'Lulusan SMA/SMK/MA atau sederajat dalam batas tahun kelulusan yang ditetapkan ketentuan resmi.',
          'Memiliki keterbatasan ekonomi sesuai kriteria yang ditetapkan pemerintah.',
          'Diterima di program studi dan perguruan tinggi sesuai ketentuan KIP-Kuliah.',
          'Rincian kriteria dan dokumen yang berlaku ada di portal resmi KIP-Kuliah.',
        ],
      },
    ],
    benefits: [
      {
        title: 'Bantuan Biaya Pendidikan',
        description: 'Membantu biaya kuliah sesuai ketentuan resmi program pemerintah.',
      },
      {
        title: 'Bantuan Biaya Hidup',
        description: 'Besaran dan klaster wilayah mengikuti ketentuan resmi terbaru; lihat portal KIP-Kuliah.',
      },
    ],
    registrationSteps: [
      { step: 1, title: 'Buka Portal Resmi', description: 'Kunjungi portal resmi KIP-Kuliah dan baca panduan pendaftaran tahun berjalan.' },
      { step: 2, title: 'Lengkapi Data dan Berkas', description: 'Siapkan data diri, data sekolah, dan dokumen sesuai panduan resmi.' },
      { step: 3, title: 'Ikuti Seleksi Masuk', description: 'Daftar melalui jalur seleksi yang menerima KIP-Kuliah (SNBP, SNBT, atau seleksi mandiri sesuai ketentuan kampus).' },
      { step: 4, title: 'Verifikasi di Kampus', description: 'Setelah diterima, ikuti proses verifikasi dan registrasi ulang sesuai instruksi UNDIP.' },
    ],
  },

  calendar: {
    title: 'Kalender Seleksi Penerimaan Mahasiswa Baru',
    disclaimer2027:
      'Jadwal resmi 2027 belum diumumkan. Tahapan di bawah adalah urutan umum; tanggalnya menunggu pengumuman resmi.',
    sourceUrl: 'https://snpmb.bppp.kemdikbud.go.id/',
    retrievedAt: '2026-11-08',
    status: 'pending',
    pathways: [
      {
        pathwayId: 'snbp',
        pathwayName: 'Seleksi Nasional Berdasarkan Prestasi (SNBP)',
        shortName: 'SNBP',
        quotaShare: 'Minimal 20% dari total daya tampung',
        description: 'Seleksi nasional berdasarkan prestasi akademik, tanpa tes tertulis.',
        timeline: [
          { stage: 'Registrasi akun SNPMB sekolah dan siswa', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pendaftaran SNBP', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pengumuman hasil SNBP', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Registrasi ulang di UNDIP', estimatedPeriod: WAITING_SCHEDULE },
        ],
      },
      {
        pathwayId: 'snbt',
        pathwayName: 'Seleksi Nasional Berdasarkan Tes (SNBT - UTBK)',
        shortName: 'SNBT',
        quotaShare: 'Minimal 30% dari total daya tampung',
        description: 'Seleksi nasional berbasis tes komputer (UTBK).',
        timeline: [
          { stage: 'Registrasi akun SNPMB', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pendaftaran UTBK-SNBT', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pelaksanaan UTBK', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pengumuman hasil SNBT', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Registrasi ulang di UNDIP', estimatedPeriod: WAITING_SCHEDULE },
        ],
      },
      {
        pathwayId: 'um',
        pathwayName: 'Ujian Mandiri Universitas Diponegoro (UM UNDIP)',
        shortName: 'UM UNDIP',
        quotaShare: 'Maksimal 50% dari total daya tampung (PTN-BH)',
        description: 'Seleksi yang diselenggarakan langsung oleh UNDIP.',
        timeline: [
          { stage: 'Pendaftaran online UM UNDIP', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pelaksanaan ujian', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pengumuman kelulusan', estimatedPeriod: WAITING_SCHEDULE },
          { stage: 'Pembayaran dan registrasi ulang', estimatedPeriod: WAITING_SCHEDULE },
        ],
      },
    ],
  },
};
