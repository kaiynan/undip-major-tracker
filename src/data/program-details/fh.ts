import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fhProgramDetails: Record<string, ProgramDetail> = {
  'fh-hukum': {
    programId: 'fh-hukum',
    ringkasan: {
      value: 'Ilmu Hukum FH UNDIP adalah salah satu fakultas hukum tertua dan terkemuka di Indonesia, berakar pada aliran Hukum Progresif Prof. Satjipto Rahardjo. Kurikulum membekali mahasiswa dengan penguasaan hukum pidana, perdata, tata negara, administrasi negara, dan hukum bisnis internasional.',
      sourceUrl: 'https://fh.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Hukum Progresif & Filsafat Hukum',
        'Hukum Acara Perdata & Pidana',
        'Hukum Bisnis & Perusahaan Multinasional',
        'Perancangan Kontrak (Legal Drafting)',
        'Perancangan Perundang-undangan (Legislative Drafting)',
        'Praktik Peradilan Semu (Moot Court)',
      ],
      sourceUrl: 'https://fh.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun dokumen legal audit, legal opinion, dan analisis kasus hukum secara komprehensif',
        'Mahir menyusun draft perjanjian bisnis dan peraturan perundang-undangan',
        'Terampil melakukan mediasi, advokasi, dan simulasi peradilan semu (litigasi dan non-litigasi)',
        'Memahami etika profesi hukum dan kepekaan sosial terhadap keadilan substantif',
      ],
      sourceUrl: 'https://fh.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Advokat / Pengacara Korporasi & Litigasi',
        'Hakim & Jaksa (setelah seleksi kedinasan)',
        'Corporate Legal Counsel & Legal Officer',
        'Notaris & Pejabat Pembuat Akta Tanah (PPAT - setelah Magister Kenotariatan)',
        'Analis Regulasi di Kementerian / Lembaga Negara',
      ],
      sourceUrl: 'https://fh.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://fh.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://fh.undip.ac.id',
      sourceUrl: 'https://fh.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
