import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const febProgramDetails: Record<string, ProgramDetail> = {
  'feb-manajemen': {
    programId: 'feb-manajemen',
    ringkasan: {
      value: 'Manajemen FEB UNDIP mempersiapkan pemimpin bisnis profesional dengan pemahaman mendalam tentang manajemen strategis, pemasaran digital, keuangan korporat, dan manajemen talenta sumber daya manusia dalam lanskap global.',
      sourceUrl: 'https://manajemen.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Manajemen Strategik Korporat',
        'Pemasaran Digital & Analitik Konsumen',
        'Manajemen Keuangan Korporat Lanjut',
        'Manajemen Talenta & Perilaku Organisasi',
        'Kewirausahaan & Inkubasi Bisnis',
        'Manajemen Operasi & Rantai Nilai Global',
      ],
      sourceUrl: 'https://manajemen.feb.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu merumuskan keputusan strategis bisnis berdasarkan analisis lingkungan internal dan eksternal',
        'Mampu merancang kampanye pemasaran berbasis data analytics dan riset pasar',
        'Mampu mengelola portofolio investasi dan mengevaluasi kelayakan finansial proyek korporasi',
      ],
      sourceUrl: 'https://manajemen.feb.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Management Trainee / General Manager Korporasi',
        'Brand & Digital Marketing Strategist',
        'Financial Analyst / Investment Banker',
        'Human Resource Business Partner (HRBP)',
        'Business Development Specialist & Founder',
      ],
      sourceUrl: 'https://manajemen.feb.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAMEMBA',
        tahun: 2022,
      },
      sourceUrl: 'https://manajemen.feb.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://manajemen.feb.undip.ac.id',
      sourceUrl: 'https://manajemen.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'feb-iesp': {
    programId: 'feb-iesp',
    ringkasan: {
      value: 'Ilmu Ekonomi dan Studi Pembangunan (IESP) FEB UNDIP mempelajari teori ekonomi makro-mikro, ekonometrika terapan, kebijakan moneter dan fiskal, ekonomi sumber daya alam maritim, dan strategi pengentasan kemiskinan wilayah.',
      sourceUrl: 'https://iesp.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Ekonometrika Terapan & Analisis Big Data',
        'Ekonomi Makro Lanjut & Kebijakan Fiskal',
        'Ekonomi Moneter & Lembaga Keuangan',
        'Ekonomi Pembangunan Wilayah & Perdesaan',
        'Ekonomi Lingkungan & Maritim',
        'Perencanaan & Evaluasi Proyek Pembangunan',
      ],
      sourceUrl: 'https://iesp.feb.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu memodelkan dampak kebijakan makroekonomi terhadap inflasi, pertumbuhan, dan pengangguran',
        'Mampu mengolah data ekonomi ekonometrik menggunakan perangkat lunak Stata, EViews, dan R',
        'Mampu menyusun dokumen analisis kebijakan pembangunan ekonomi bagi instansi pemerintah dan swasta',
      ],
      sourceUrl: 'https://iesp.feb.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Analis Ekonomi di Bank Indonesia / OJK / Kemenkeu',
        'Economist / Research Associate di Lembaga Riset Ekonomi',
        'Economic Development Officer di Lembaga Internasional (World Bank / ADB)',
        'Strategic Planning Analyst di BUMN & Perbankan',
      ],
      sourceUrl: 'https://iesp.feb.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAMEMBA',
        tahun: 2023,
      },
      sourceUrl: 'https://iesp.feb.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://iesp.feb.undip.ac.id',
      sourceUrl: 'https://iesp.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'feb-akuntansi': {
    programId: 'feb-akuntansi',
    ringkasan: {
      value: 'Akuntansi FEB UNDIP memadukan standar pelaporan keuangan internasional (IFRS), audit independen, akuntansi manajemen strategis, sistem informasi perpajakan, dan analitik forensik kecurangan (fraud audit).',
      sourceUrl: 'https://akuntansi.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Akuntansi Keuangan Lanjutan & IFRS',
        'Auditing & Jasa Asurans',
        'Akuntansi Forensik & Audit Investigatif',
        'Sistem Informasi Akuntansi & ERP SAP',
        'Manajemen Perpajakan Korporasi',
        'Analisis Laporan Keuangan & Penilaian Bisnis',
      ],
      sourceUrl: 'https://akuntansi.feb.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun laporan keuangan konsolidasi sesuai Standar Akuntansi Keuangan (SAK)',
        'Mampu melaksanakan prosedur audit laporan keuangan berbasis risiko (Risk-Based Audit)',
        'Mampu mengoperasikan software Enterprise Resource Planning (ERP SAP) untuk siklus akuntansi',
        'Menguasai regulasi perpajakan penghasilan badan dan PPN nasional',
      ],
      sourceUrl: 'https://akuntansi.feb.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Auditor Eksternal di Kantor Akuntan Publik (Big 4 & Nasional)',
        'Corporate Accountant & Financial Controller',
        'Tax Specialist / Tax Consultant',
        'Internal Auditor & Risk Specialist',
        'Analis Keuangan Pemerintahan (BPK / BPKP / Kemenkeu)',
      ],
      sourceUrl: 'https://akuntansi.feb.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAMEMBA',
        tahun: 2022,
      },
      sourceUrl: 'https://akuntansi.feb.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://akuntansi.feb.undip.ac.id',
      sourceUrl: 'https://akuntansi.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'feb-ekonomi-islam': {
    programId: 'feb-ekonomi-islam',
    ringkasan: {
      value: 'Ekonomi Islam FEB UNDIP mengkaji prinsip syariah dalam transaksi keuangan, perbankan syariah, pasar modal syariah, sukuk, zakat, infaq, shadaqah, dan wakaf (ZISWAF), serta tata kelola filantropi Islam modern.',
      sourceUrl: 'https://ekonomiislam.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Fiqih Muamalah Keuangan & Kontrak Syariah',
        'Manajemen Perbankan Syariah',
        'Pasar Modal Syariah & Investasi Sukuk',
        'Manajemen ZISWAF & Filantropi Islam',
        'Akuntansi Lembaga Keuangan Syariah (AAOIFI)',
        'Tata Kelola & Audit Syariah (Shariah Governance)',
      ],
      sourceUrl: 'https://ekonomiislam.feb.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menganalisis kesesuaian produk keuangan terhadap fatwa Dewan Syariah Nasional (DSN-MUI)',
        'Mampu menyusun laporan akuntansi lembaga keuangan syariah sesuai PSAK Syariah',
        'Menguasai strategi penghimpunan dan penyaluran dana wakaf produktif',
      ],
      sourceUrl: 'https://ekonomiislam.feb.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Sharia Banking Officer (Bank Syariah Indonesia / Unit Usaha Syariah)',
        'Sharia Compliance & Audit Officer',
        'Manajer Lembaga Zakat & Wakaf Produktif',
        'Sharia Financial Planner & Konsultan Investasi Halal',
      ],
      sourceUrl: 'https://ekonomiislam.feb.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAMEMBA',
        tahun: 2023,
      },
      sourceUrl: 'https://ekonomiislam.feb.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://ekonomiislam.feb.undip.ac.id',
      sourceUrl: 'https://ekonomiislam.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'feb-bisnis-digital': {
    programId: 'feb-bisnis-digital',
    ringkasan: {
      value: 'Bisnis Digital FEB UNDIP memadukan strategi bisnis modern dengan teknologi informasi, e-commerce, analitik data konsumen, fintech, dan inovasi startup digital untuk merespons transformasi ekonomi digital.',
      sourceUrl: 'https://bisnisdigital.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Model Bisnis Digital & Platform Strategy',
        'E-Commerce & Digital Marketing Analytics',
        'Fintech & Sistem Pembayaran Digital',
        'Product Management & UX Strategy',
        'Analitik Data Bisnis & Business Intelligence',
        'Manajemen Startup & Venture Capital',
      ],
      sourceUrl: 'https://bisnisdigital.feb.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu merancang proposisi nilai produk digital dan siklus hidup produk (Product Management)',
        'Mampu menganalisis conversion rate dan performa funnel penjualan e-commerce',
        'Menguasai pemanfaatan business intelligence dashboard (PowerBI / Tableau) untuk keputusan bisnis',
      ],
      sourceUrl: 'https://bisnisdigital.feb.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Digital Product Manager',
        'E-Commerce Operations Specialist',
        'Growth Hacker & Digital Marketing Lead',
        'Business Intelligence Analyst',
        'Tech Startup Founder / Entrepreneur',
      ],
      sourceUrl: 'https://bisnisdigital.feb.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Baik Sekali',
        lembaga: 'LAMEMBA',
        tahun: 2023,
      },
      sourceUrl: 'https://bisnisdigital.feb.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://bisnisdigital.feb.undip.ac.id',
      sourceUrl: 'https://bisnisdigital.feb.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
