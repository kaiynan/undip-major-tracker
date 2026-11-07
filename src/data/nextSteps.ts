// =============================================================================
// UNDIP Major Matcher — Panduan Langkah Selanjutnya
// =============================================================================
// Informasi resmi biaya kuliah (UKT & IPI), beasiswa KIP-Kuliah,
// dan kalender linimasa seleksi penerimaan mahasiswa baru di Universitas Diponegoro.
// Semua entri wajib menyertakan sourceUrl, retrievedAt, dan status verifikasi.
// =============================================================================

export interface NextStepSource {
  sourceUrl: string;
  retrievedAt: string;
  status: 'official' | 'reference' | 'pending';
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

export const nextStepsData: NextStepsData = {
  disclaimerFooter:
    'Informasi dapat berubah sewaktu-waktu. Selalu merujuk ke situs resmi PMB UNDIP (pmb.undip.ac.id) dan SNPMB (snpmb.bppp.kemdikbud.go.id).',

  ukt: {
    title: 'Biaya Kuliah — Uang Kuliah Tunggal (UKT)',
    summary:
      'Universitas Diponegoro menerapkan sistem Uang Kuliah Tunggal (UKT) yang dibagi menjadi 8 golongan berdasarkan verifikasi kemampuan ekonomi orang tua atau penanggung biaya mahasiswa. Jalur SNBP dan SNBT hanya dikenakan UKT per semester tanpa uang pangkal/IPI.',
    sourceUrl: 'https://pmb.undip.ac.id/biaya-studi/',
    retrievedAt: '2026-11-08',
    status: 'official',
    officialDecisionUrl: 'https://pmb.undip.ac.id/biaya-studi/',
    verificationNote:
      'TODO(verify): Besaran nominal per program studi untuk TA 2027/2028 menunggu penetapan Keputusan Rektor terbaru. Tabel di bawah mengacu pada struktur UKT resmi yang berlaku.',
    ipiNote:
      'Iuran Pengembangan Institusi (IPI) / Uang Pangkal hanya berlaku bagi mahasiswa yang diterima melalui Jalur Ujian Mandiri (UM). Mahasiswa yang diterima melalui jalur SNBP dan SNBT 100% BEBAS IPI.',
    groups: [
      {
        group: 1,
        label: 'Golongan 1',
        nominalRange: 'Rp500.000 / semester',
        description: 'Tarif subsidi penuh nasional untuk mahasiswa dari keluarga prasejahtera.',
      },
      {
        group: 2,
        label: 'Golongan 2',
        nominalRange: 'Rp1.000.000 / semester',
        description: 'Tarif bersubsidi pemerintah untuk kemampuan ekonomi tingkat bawah.',
      },
      {
        group: 3,
        label: 'Golongan 3',
        nominalRange: 'Rp2.500.000 – Rp4.500.000 / semester',
        description: 'Penetapan berdasarkan verifikasi penghasilan orang tua, PBB, dan daya listrik rumah.',
      },
      {
        group: 4,
        label: 'Golongan 4',
        nominalRange: 'Rp3.500.000 – Rp7.500.000 / semester',
        description: 'Rentang menengah disesuaikan dengan rumpun ilmu dan fasilitas laboratorium prodi.',
      },
      {
        group: 5,
        label: 'Golongan 5',
        nominalRange: 'Rp4.500.000 – Rp10.000.000 / semester',
        description: 'Rentang menengah-atas untuk prodi sains, teknik, dan rumpun bisnis.',
      },
      {
        group: 6,
        label: 'Golongan 6',
        nominalRange: 'Rp5.500.000 – Rp14.000.000 / semester',
        description: 'Penetapan bagi penanggung biaya dengan kapasitas ekonomi kuat.',
      },
      {
        group: 7,
        label: 'Golongan 7',
        nominalRange: 'Rp6.500.000 – Rp19.000.000 / semester',
        description: 'Rentang atas untuk program studi dengan kebutuhan fasilitas klinis/lab tingkat tinggi.',
      },
      {
        group: 8,
        label: 'Golongan 8',
        nominalRange: 'Rp7.500.000 – Rp22.000.000 / semester',
        description: 'Tarif batas tertinggi (maksimal Rp22.000.000 pada Kedokteran Umum; Sosum berkisar Rp7.000.000–Rp9.000.000).',
      },
    ],
  },

  kipk: {
    title: 'Beasiswa KIP-Kuliah (Kartu Indonesia Pintar Kuliah)',
    summary:
      'Program bantuan biaya pendidikan dari Pemerintah Republik Indonesia melalui Kemendikbudristek untuk lulusan SMA/SMK/MA sederajat berprestasi yang memiliki keterbatasan ekonomi, agar dapat berkuliah di UNDIP secara gratis hingga lulus.',
    sourceUrl: 'https://kip-kuliah.kemdikbud.go.id/',
    portalUrl: 'https://kip-kuliah.kemdikbud.go.id/',
    retrievedAt: '2026-11-08',
    status: 'official',
    criteria: [
      {
        category: 'Kelulusan Sekolah',
        details: [
          'Siswa SMA/SMK/MA atau sederajat yang lulus pada tahun berjalan atau maksimal 2 tahun sebelumnya.',
          'Memiliki NISN, NPSN, dan NIK yang valid dan terdaftar di Dapodik Kemendikbudristek.',
        ],
      },
      {
        category: 'Prestasi Akademik',
        details: [
          'Lulus seleksi penerimaan mahasiswa baru di UNDIP pada prodi terakreditasi A/B atau Unggul/Baik Sekali.',
          'Memiliki potensi akademik baik yang direkomendasikan oleh sekolah.',
        ],
      },
      {
        category: 'Keterbatasan Ekonomi (Salah satu terpenuhi)',
        details: [
          'Pemegang Kartu Indonesia Pintar (KIP) Pendidikan Menengah saat di SMA/SMK.',
          'Keluarga terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS) Kemensos RI.',
          'Keluarga masuk dalam kelompok Desil 1–3 data Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem (P3KE).',
          'Berasal dari panti sosial/asuhan atau memiliki SKTM dengan pendapatan kotor gabungan orang tua maks Rp4.000.000/bulan (atau jika dibagi jumlah keluarga maks Rp750.000/bulan).',
        ],
      },
    ],
    benefits: [
      {
        title: 'Bebas Biaya Pendaftaran',
        description: 'Gratis biaya pendaftaran seleksi masuk nasional UTBK-SNBT bagi pendaftar terverifikasi KIP-Kuliah.',
      },
      {
        title: 'Bebas Biaya Kuliah 100%',
        description: 'Pembebasan 100% biaya UKT semesteran selama masa studi normal (8 semester untuk S1/D4) yang dibayarkan langsung oleh negara ke rekening UNDIP.',
      },
      {
        title: 'Bantuan Biaya Hidup Bulanan',
        description: 'Uang saku bulanan yang ditransfer langsung ke rekening mahasiswa setiap semester (Klaster wilayah Kota Semarang sekitar Rp1.100.000/bulan).',
      },
    ],
    registrationSteps: [
      {
        step: 1,
        title: 'Registrasi Akun Mandiri',
        description: 'Buka portal kip-kuliah.kemdikbud.go.id, masukkan NIK, NISN, NPSN, dan email aktif yang valid.',
      },
      {
        step: 2,
        title: 'Validasi & Kelengkapan Berkas',
        description: 'Sistem memvalidasi kelayakan ekonomi melalui sinkronisasi DTKS/P3KE atau unggah berkas SKTM dan bukti penghasilan.',
      },
      {
        step: 3,
        title: 'Sinkronisasi Jalur Seleksi',
        description: 'Pilih jalur seleksi yang diikuti (SNBP, SNBT, atau UM UNDIP yang mendukung KIP-Kuliah) pada dashboard akun KIP-K.',
      },
      {
        step: 4,
        title: 'Verifikasi di UNDIP',
        description: 'Setelah dinyatakan lolos seleksi masuk UNDIP, lakukan verifikasi berkas registrasi ulang di portal PMB UNDIP dengan melampirkan nomor registrasi KIP-Kuliah.',
      },
    ],
  },

  calendar: {
    title: 'Kalender Seleksi Penerimaan Mahasiswa Baru',
    disclaimer2027:
      'Jadwal resmi 2027 belum diumumkan; pola di bawah mengacu pada tahun sebelumnya sebagai gambaran.',
    sourceUrl: 'https://snpmb.bppp.kemdikbud.go.id/',
    retrievedAt: '2026-11-08',
    status: 'reference',
    pathways: [
      {
        pathwayId: 'snbp',
        pathwayName: 'Seleksi Nasional Berdasarkan Prestasi (SNBP)',
        shortName: 'SNBP',
        quotaShare: 'Minimal 20% dari total daya tampung',
        description: 'Seleksi nasional tanpa tes tertulis yang menitikberatkan pada konsistensi nilai rapor semester 1–5 dan portofolio prestasi siswa eligible.',
        timeline: [
          { stage: 'Pengumuman Kuota Sekolah & Registrasi Akun SNPMB', estimatedPeriod: 'Januari – Februari' },
          { stage: 'Penetapan Siswa Eligible oleh Pihak Sekolah', estimatedPeriod: 'Januari' },
          { stage: 'Pendaftaran SNBP oleh Siswa Eligible', estimatedPeriod: 'Pertengahan – Akhir Februari' },
          { stage: 'Pengumuman Hasil Kelulusan SNBP', estimatedPeriod: 'Akhir Maret' },
          { stage: 'Registrasi Ulang Online Mahasiswa Baru di UNDIP', estimatedPeriod: 'April – Mei' },
        ],
      },
      {
        pathwayId: 'snbt',
        pathwayName: 'Seleksi Nasional Berdasarkan Tes (SNBT - UTBK)',
        shortName: 'SNBT',
        quotaShare: 'Minimal 30% dari total daya tampung',
        description: 'Seleksi nasional berbasis tes komputer (UTBK) mengukur Tes Potensi Skolastik (TPS), Literasi Bahasa Indonesia & Inggris, dan Penalaran Matematika.',
        timeline: [
          { stage: 'Registrasi Akun SNPMB Siswa', estimatedPeriod: 'Awal Februari – Awal Maret' },
          { stage: 'Pendaftaran UTBK-SNBT', estimatedPeriod: 'Akhir Maret – Awal April' },
          { stage: 'Pelaksanaan UTBK Gelombang 1', estimatedPeriod: 'Awal – Pertengahan Mei' },
          { stage: 'Pelaksanaan UTBK Gelombang 2', estimatedPeriod: 'Akhir Mei' },
          { stage: 'Pengumuman Hasil Seleksi Jalur SNBT', estimatedPeriod: 'Pertengahan Juni' },
          { stage: 'Masa Unduh Sertifikat Nilai UTBK', estimatedPeriod: 'Pertengahan Juni – Juli' },
        ],
      },
      {
        pathwayId: 'um',
        pathwayName: 'Ujian Mandiri Universitas Diponegoro (UM UNDIP)',
        shortName: 'UM UNDIP',
        quotaShare: 'Maksimal 50% dari total daya tampung (PTN-BH)',
        description: 'Jalur seleksi internal yang diselenggarakan langsung oleh UNDIP meliputi Ujian Tulis Berbasis Komputer (CBT Mandiri), Seleksi Bibit Unggul Berprestasi (SBUB), dan Program Kemitraan.',
        timeline: [
          { stage: 'Pendaftaran Online Jalur Prestasi (SBUB)', estimatedPeriod: 'Awal Mei – Akhir Mei' },
          { stage: 'Pendaftaran Online CBT Mandiri (Sarjana & Vokasi)', estimatedPeriod: 'Awal Mei – Pertengahan Juni' },
          { stage: 'Pelaksanaan Ujian Tulis CBT Daring / Luring', estimatedPeriod: 'Akhir Juni' },
          { stage: 'Pengumuman Kelulusan Jalur Mandiri', estimatedPeriod: 'Awal Juli' },
          { stage: 'Pembayaran UKT/IPI & Verifikasi Registrasi Ulang', estimatedPeriod: 'Juli' },
          { stage: 'Penerimaan Mahasiswa Baru & PKKMB Kampus', estimatedPeriod: 'Awal Agustus' },
        ],
      },
    ],
  },
};
