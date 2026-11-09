import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fkmProgramDetails: Record<string, ProgramDetail> = {
  'fkm-kesmas': {
    programId: 'fkm-kesmas',
    ringkasan: {
      value: 'Kesehatan Masyarakat FKM UNDIP mendalami epidemiologi penyakit menular dan tidak menular, biostatistika kesehatan, promosi kesehatan, administrasi kebijakan kesehatan, serta kesehatan lingkungan pesisir.',
      sourceUrl: 'https://kesmas.fkm.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Epidemiologi Lapangan & Surveilans Kesehatan',
        'Promosi Kesehatan & Ilmu Perilaku',
        'Administrasi Kebijakan Kesehatan (AKK)',
        'Biostatistika Inferensial Kesehatan',
        'Kesehatan Lingkungan Wilayah Pesisir',
        'Manajemen Program Kesehatan Puskesmas',
      ],
      sourceUrl: 'https://kesmas.fkm.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu melakukan investigasi wabah dan analisis data surveilans epidemiologi',
        'Mampu merancang intervensi promosi kesehatan dan advokasi kebijakan publik sehat',
        'Menguasai evaluasi kinerja program kesehatan di Puskesmas dan Dinas Kesehatan',
      ],
      sourceUrl: 'https://kesmas.fkm.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Epidemiolog Kesehatan di Kemenkes / Dinas Kesehatan',
        'Sanitarian & Tenaga Promosi Kesehatan',
        'Administrator Layanan Kesehatan di Rumah Sakit / BPJS',
        'Program Officer Kesehatan Masyarakat di UNICEF / WHO',
      ],
      sourceUrl: 'https://kesmas.fkm.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAM-PTKes',
        tahun: 2022,
      },
      sourceUrl: 'https://kesmas.fkm.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://kesmas.fkm.undip.ac.id',
      sourceUrl: 'https://kesmas.fkm.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fkm-k3': {
    programId: 'fkm-k3',
    ringkasan: {
      value: 'Keselamatan dan Kesehatan Kerja (K3) FKM UNDIP fokus pada identifikasi bahaya kerja, penilaian risiko kecelakaan, higiene industri, ergonomi stasiun kerja, dan penerapan Sistem Manajemen K3 (SMK3) berbasis ISO 45001.',
      sourceUrl: 'https://k3.fkm.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Identifikasi Bahaya & Penilaian Risiko (HIRADC)',
        'Higiene Industri & Toksikologi Lingkungan Kerja',
        'Sistem Manajemen K3 (SMK3 PP 50/2012 & ISO 45001)',
        'Investigasi Kecelakaan Kerja & Analisis Akar Masalah (RCA)',
        'Ergonomi Kerja & Faal Industri',
        'Keselamatan Kebakaran & Tanggap Darurat Bencana',
      ],
      sourceUrl: 'https://k3.fkm.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun matriks HIRADC dan Job Safety Analysis (JSA) untuk berbagai aktivitas industri',
        'Mampu melakukan inspeksi dan audit internal SMK3 di lingkungan manufaktur, konstruksi, dan migas',
        'Mampu melakukan pengukuran faktor fisik, kimiawi, dan biologi di tempat kerja',
      ],
      sourceUrl: 'https://k3.fkm.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'HSE (Health, Safety & Environment) Officer di Migas, Tambang & Konstruksi',
        'Industrial Hygienist & Safety Inspector',
        'Auditor SMK3 / ISO 45001',
        'Pengawas Ketenagakerjaan di Kemenaker',
      ],
      sourceUrl: 'https://k3.fkm.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAM-PTKes',
        tahun: 2023,
      },
      sourceUrl: 'https://k3.fkm.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://k3.fkm.undip.ac.id',
      sourceUrl: 'https://k3.fkm.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
