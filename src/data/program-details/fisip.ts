import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fisipProgramDetails: Record<string, ProgramDetail> = {
  'fisip-adm-publik': {
    programId: 'fisip-adm-publik',
    ringkasan: {
      value: 'Administrasi Publik FISIP UNDIP mengkaji perumusan kebijakan publik, reformasi birokrasi, tata kelola pemerintahan digital (e-government), dan manajemen pelayanan publik prima untuk memecahkan persoalan masyarakat.',
      sourceUrl: 'https://admpublik.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Analisis & Evaluasi Kebijakan Publik',
        'Manajemen Pelayanan Publik & Standar Pelayanan',
        'Tata Kelola Pemerintahan Digital (E-Government)',
        'Reformasi Birokrasi & Akuntabilitas Kinerja',
        'Manajemen Sumber Daya Aparatur Publik',
        'Keuangan Sektor Publik & Penganggaran APBD',
      ],
      sourceUrl: 'https://admpublik.fisip.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun naskah akademis dan rekomendasi kebijakan publik berbasis bukti',
        'Mampu merancang indeks kepuasan masyarakat (IKM) dan standar operasional pelayanan publik',
        'Menguasai strategi implementasi sistem informasi pelayanan publik digital',
      ],
      sourceUrl: 'https://admpublik.fisip.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Analis Kebijakan Publik (Policy Analyst)',
        'Aparatur Sipil Negara (ASN) di Kementerian / Lembaga / Pemda',
        'Public Sector Consultant',
        'Manajer Program di LSM & Organisasi Non-Profit',
      ],
      sourceUrl: 'https://admpublik.fisip.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://admpublik.fisip.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://admpublik.fisip.undip.ac.id',
      sourceUrl: 'https://admpublik.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fisip-adm-bisnis': {
    programId: 'fisip-adm-bisnis',
    ringkasan: {
      value: 'Administrasi Bisnis FISIP UNDIP mempelajari tata kelola korporasi, perancangan model bisnis, strategi pemasaran komersial, manajemen operasional niaga, dan kewirausahaan berbasis inovasi.',
      sourceUrl: 'https://admbisnis.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Perencanaan & Pengembangan Bisnis',
        'Manajemen Pemasaran Niaga',
        'Manajemen Keuangan Bisnis',
        'Negosiasi & Komunikasi Bisnis',
        'Tata Kelola Ekspor Impor & Kepabeanan',
        'Kewirausahaan & Inkubasi Bisnis Ritel',
      ],
      sourceUrl: 'https://admbisnis.fisip.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun studi kelayakan bisnis komprehensif untuk pengajuan modal usaha',
        'Mampu merancang prosedur operasional standar (SOP) tata kelola bisnis niaga',
        'Menguasai strategi negosiasi kontrak komersial dan kemitraan usaha',
      ],
      sourceUrl: 'https://admbisnis.fisip.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Business Development Officer',
        'Corporate Administrator / Sekretaris Perusahaan',
        'Account Executive & Sales Manager',
        'Wirausahawan Mandiri (Entrepreneur)',
      ],
      sourceUrl: 'https://admbisnis.fisip.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://admbisnis.fisip.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://admbisnis.fisip.undip.ac.id',
      sourceUrl: 'https://admbisnis.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fisip-pemerintahan': {
    programId: 'fisip-pemerintahan',
    ringkasan: {
      value: 'Ilmu Pemerintahan FISIP UNDIP mendalami dinamika kekuasaan politik lokal, otonomi daerah, kepemimpinan demokratis, lembaga legislatif dan eksekutif, serta tata kelola konflik sosial politik.',
      sourceUrl: 'https://ilpemerintahan.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Teori Pemerintahan & Otonomi Daerah',
        'Politik Lokal & Pemilu Kepala Daerah',
        'Kepemimpinan Sektor Publik & Etika Pemerintahan',
        'Manajemen Konflik & Resolusi Sosial',
        'Sistem Perwakilan Legislatif & Parlemen',
        'Tata Kelola Pemerintahan Desa Terpadu',
      ],
      sourceUrl: 'https://ilpemerintahan.fisip.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu memetakan aktor dan dinamika politik kebijakan di tingkat lokal maupun nasional',
        'Mampu menyusun kajian naskah peraturan daerah (Perda) dan tata kelola desa',
        'Menguasai strategi mediasi konflik dan fasilitasi dialog pemangku kepentingan',
      ],
      sourceUrl: 'https://ilpemerintahan.fisip.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Analis Politik & Pemerintahan',
        'Tenaga Ahli Anggota Parlemen (DPR / DPRD)',
        'Aparatur Sipil Negara di Kemendagri / Kesbangpol / Pemda',
        'Peneliti Opini Publik & Konsultan Pemilu',
      ],
      sourceUrl: 'https://ilpemerintahan.fisip.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://ilpemerintahan.fisip.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://ilpemerintahan.fisip.undip.ac.id',
      sourceUrl: 'https://ilpemerintahan.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fisip-komunikasi': {
    programId: 'fisip-komunikasi',
    ringkasan: {
      value: 'Ilmu Komunikasi FISIP UNDIP mempelajari komunikasi strategis, hubungan masyarakat (public relations), jurnalistik multimedia, produksi media penyiaran, dan komunikasi pemasaran terpadu di era media digital.',
      sourceUrl: 'https://komunikasi.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Hubungan Masyarakat Strategis (Corporate PR)',
        'Jurnalistik Multimedia & Data Journalism',
        'Komunikasi Pemasaran Terpadu (IMC)',
        'Produksi Siaran Televisi & Media Digital',
        'Manajemen Komunikasi Krisis',
        'Riset Khalayak & Analitik Media Sosial',
      ],
      sourceUrl: 'https://komunikasi.fisip.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu merancang rencana komunikasi krisis dan reputasi korporasi',
        'Mampu memproduksi konten jurnalistik multimedia berbasis verifikasi fakta dan etika pers',
        'Terampil mengelola strategi konten media sosial dan relasi media massa (media relations)',
      ],
      sourceUrl: 'https://komunikasi.fisip.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Public Relations / Corporate Communications Specialist',
        'Jurnalis Multimedia & Produser Konten Media',
        'Social Media & Digital Content Strategist',
        'Brand Communications Officer',
      ],
      sourceUrl: 'https://komunikasi.fisip.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://komunikasi.fisip.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://komunikasi.fisip.undip.ac.id',
      sourceUrl: 'https://komunikasi.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fisip-hi': {
    programId: 'fisip-hi',
    ringkasan: {
      value: 'Hubungan Internasional FISIP UNDIP mengkaji diplomasi antarnegara, politik keamanan global, ekonomi politik internasional, hukum perjanjian internasional, dan peran organisasi multilateral di kawasan Asia-Pasifik.',
      sourceUrl: 'https://hi.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Diplomasi & Praktik Negosiasi Multilateral',
        'Ekonomi Politik Internasional',
        'Keamanan Global & Studi Strategis',
        'Politik Luar Negeri Republik Indonesia',
        'Kajian Kawasan Asia Tenggara & Indo-Pasifik',
        'Hukum Organisasi Internasional',
      ],
      sourceUrl: 'https://hi.fisip.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menganalisis isu geopolitik dan geostrategi internasional secara sistematis',
        'Mampu menyusun policy brief diplomasi dan analisis risiko negara (country risk assessment)',
        'Terampil bernegosiasi dalam forum simulasi sidang multilateral (Model United Nations/MUN)',
      ],
      sourceUrl: 'https://hi.fisip.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Diplomat / Pejabat Dinas Luar Negeri di Kemlu RI',
        'International NGO Officer (PBB, ASEAN, Palang Merah Internasional)',
        'International Business Development Specialist',
        'Analis Geopolitik & Riset Kebijakan Global',
      ],
      sourceUrl: 'https://hi.fisip.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://hi.fisip.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://hi.fisip.undip.ac.id',
      sourceUrl: 'https://hi.fisip.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'psdku-adm-publik-rembang': {
    programId: 'psdku-adm-publik-rembang',
    ringkasan: {
      value: 'Program S1 Administrasi Publik Kampus Rembang membekali mahasiswa dengan kompetensi tata kelola birokrasi pemerintahan daerah, pelayanan publik pesisir, dan pengelolaan program pembangunan desa pesisir Pantura timur.',
      sourceUrl: 'https://psdku.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Manajemen Pelayanan Publik Daerah',
        'Kebijakan Pembangunan Pesisir & Desa',
        'Pemerintahan Digital & Transparansi Publik',
        'Penganggaran Sektor Publik Daerah',
        'Manajemen Konflik & Advokasi Kebijakan',
      ],
      sourceUrl: 'https://psdku.undip.ac.id/kurikulum-ap/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun standar pelayanan publik pada kantor kecamatan dan desa',
        'Mampu melakukan evaluasi kinerja program pembangunan daerah pesisir',
      ],
      sourceUrl: 'https://psdku.undip.ac.id/profil-ap/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Aparatur Sipil Negara Pemda Kabupaten Rembang & Sekitarnya',
        'Pendamping Desa & Program Sosial',
        'Staf Administrasi di Instansi Pelayanan Publik',
      ],
      sourceUrl: 'https://psdku.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Baik Sekali',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://psdku.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://psdku.undip.ac.id',
      sourceUrl: 'https://psdku.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
