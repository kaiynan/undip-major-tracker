import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fpikProgramDetails: Record<string, ProgramDetail> = {
  'fpik-akuakultur': {
    programId: 'fpik-akuakultur',
    ringkasan: {
      value: 'Akuakultur (Budidaya Perairan) FPIK UNDIP mendalami teknologi budidaya komoditas perikanan air tawar, payau, dan laut. Fokus keilmuan mencakup pemuliaan genetik induk, formulasi nutrisi pakan mandiri, rekayasa lingkungan tambak berbasis bioflok/RAS, dan manajemen kesehatan ikan.',
      sourceUrl: 'https://akuakultur.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Teknologi Pembenihan & Pemuliaan Ikan',
        'Formulasi & Nutrisi Pakan Akuakultur',
        'Rekayasa Sistem Akuakultur (RAS & Bioflok)',
        'Manajemen Kualitas Air Budidaya',
        'Parasit & Penyakit Organisme Akuatik',
        'Manajemen Bisnis & Kewirausahaan Tambak',
      ],
      sourceUrl: 'https://akuakultur.fpik.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu merancang dan mengoperasikan sistem budidaya intensif ramah lingkungan (RAS, resirkulasi, bioflok)',
        'Mampu memformulasi pakan ikan/udang berbasis bahan baku lokal bernutrisi seimbang',
        'Mampu mendiagnosis dan menangani penyakit patogenik pada komoditas perikanan',
      ],
      sourceUrl: 'https://akuakultur.fpik.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Aquaculture Farm Manager (Tambak Udang / Kolam Ikan)',
        'Hatchery Specialist / Pemulia Benih Perikanan',
        'Formulator Pakan Ikan di Industri Pakan Komersial',
        'Analis Kesehatan Ikan & Karantina Ikan KKP',
      ],
      sourceUrl: 'https://akuakultur.fpik.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://akuakultur.fpik.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://akuakultur.fpik.undip.ac.id',
      sourceUrl: 'https://akuakultur.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fpik-msp': {
    programId: 'fpik-msp',
    ringkasan: {
      value: 'Manajemen Sumberdaya Perairan (MSP) FPIK UNDIP mempelajari pengelolaan ekosistem perairan pesisir, estuari, dan tawar. Kurikulum mencakup konservasi terumbu karang dan mangrove, ekotoksikologi perairan, dan tata kelola perikanan berkelanjutan.',
      sourceUrl: 'https://msp.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Ekologi Perairan Tropis & Estuari',
        'Biologi Perikanan & Dinamika Populasi',
        'Ekotoksikologi & Pencemaran Perairan',
        'Konservasi Sumberdaya Hayati Perairan',
        'Manajemen Kawasan Pesisir Terpadu (ICZM)',
        'Analisis Mengenai Dampak Lingkungan Perairan',
      ],
      sourceUrl: 'https://msp.fpik.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menilai daya dukung dan status mutu lingkungan perairan laut dan tawar',
        'Mampu menyusun rencana zonasi kawasan konservasi perairan daerah (KKPD)',
        'Menguasai metodologi survei ekosistem mangrove, lamun, dan terumbu karang',
      ],
      sourceUrl: 'https://msp.fpik.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Spesialis Konservasi Perairan di KKP / BPSPL',
        'Analis Lingkungan Pesisir & Konsultan AMDAL',
        'Aquatic Resource Manager di Lembaga Konservasi (WWF / CTC)',
        'Peneliti Ekologi Perairan di BRIN',
      ],
      sourceUrl: 'https://msp.fpik.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://msp.fpik.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://msp.fpik.undip.ac.id',
      sourceUrl: 'https://msp.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fpik-thp': {
    programId: 'fpik-thp',
    ringkasan: {
      value: 'Teknologi Hasil Perikanan (THP) FPIK UNDIP mendalami biokimia pascapanen perikanan, pengolahan produk hasil laut bernilai tinggi, fortifikasi pangan bahari, pengemasan modern, serta penjaminan mutu HACCP produk ekspor.',
      sourceUrl: 'https://thp.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Teknologi Pascapanen & Rantai Dingin Ikan',
        'Mikrobiologi & Keamanan Pangan Hasil Laut',
        'Hazard Analysis Critical Control Point (HACCP)',
        'Bioprospeksi & Ekstraksi Senyawa Bioaktif Laut',
        'Teknologi Pengolahan Surimi & Nilai Tambah',
        'Pengemasan & Penyimpanan Pangan Bahari',
      ],
      sourceUrl: 'https://thp.fpik.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu merancang sistem penjaminan mutu HACCP dan Good Manufacturing Practices (GMP) industri perikanan',
        'Mampu mengolah produk diversifikasi hasil perikanan berdaya simpan tinggi',
        'Mampu mengekstrak produk samping perikanan (kolagen, kitosan, gelatin laut)',
      ],
      sourceUrl: 'https://thp.fpik.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Quality Assurance / Quality Control Industri Pengolahan Ikan Ekspor',
        'HACCP & Food Safety Auditor',
        'Product Development Specialist Industri Pangan Bahari',
        'Inspektur Mutu Produk Perikanan di BKIPM - KKP',
      ],
      sourceUrl: 'https://thp.fpik.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://thp.fpik.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://thp.fpik.undip.ac.id',
      sourceUrl: 'https://thp.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fpik-psp': {
    programId: 'fpik-psp',
    ringkasan: {
      value: 'Pemanfaatan Sumberdaya Perikanan (PSP) FPIK UNDIP mempelajari teknologi penangkapan ikan ramah lingkungan (eco-fishing), rancang bangun alat tangkap, navigasi kapal perikanan, akustik kelautan, dan manajemen pelabuhan perikanan modern.',
      sourceUrl: 'https://psp.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Rancang Bangun Alat Penangkap Ikan Ramah Lingkungan',
        'Navigasi & Ilmu Pelayaran Perikanan',
        'Hidroakustik Perikanan & Daerah Penangkapan Ikan (DPI)',
        'Manajemen Pelabuhan Perikanan & Logistik Ikan',
        'Tingkah Laku Ikan terhadap Alat Tangkap',
        'Hukum Laut & Kode Etik Perikanan Bertanggung Jawab (CCRF)',
      ],
      sourceUrl: 'https://psp.fpik.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu memetakan daerah penangkapan ikan potensial (fishing ground) menggunakan citra satelit dan hidroakustik',
        'Mampu merancang alat tangkap selektif sesuai ketentuan Code of Conduct for Responsible Fisheries',
        'Menguasai manajemen operasional pangkalan pendaratan ikan dan pelabuhan perikanan samudera',
      ],
      sourceUrl: 'https://psp.fpik.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Fishing Master & Nakhoda Kapal Perikanan',
        'Administrator & Manajer Pelabuhan Perikanan',
        'Surveyor Alat Tangkap & Inspektur Perikanan KKP',
        'Konsultan Logistik Rantai Dingin Hasil Laut',
      ],
      sourceUrl: 'https://psp.fpik.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://psp.fpik.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://psp.fpik.undip.ac.id',
      sourceUrl: 'https://psp.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fpik-kelautan': {
    programId: 'fpik-kelautan',
    ringkasan: {
      value: 'Ilmu Kelautan FPIK UNDIP mendalami biologi kelautan, bioteknologi bahari, pemetaan habitat bentik laut dangkal, selam ilmiah (scientific diving), dan oseanografi biologi di perairan tropis Indonesia.',
      sourceUrl: 'https://kelautan.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Biologi Laut & Ekologi Terumbu Karang',
        'Selam Ilmiah (Scientific Diving) & Metodologi Bawah Air',
        'Bioteknologi Kelautan & Senyawa Bioaktif Spons',
        'Penginderaan Jauh Kelautan & SIG Pesisir',
        'Konservasi Biodiversitas Laut Tropis',
        'Pencemaran Laut & Mikroplastik',
      ],
      sourceUrl: 'https://kelautan.fpik.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu melakukan penyelaman ilmiah untuk survei kesehatan terumbu karang (Reef Check)',
        'Mampu mengolah citra satelit oseanografi untuk memetakan padang lamun dan hutan mangrove',
        'Menguasai isolasi senyawa bioaktif dari invertebrata laut untuk aplikasi farmasi',
      ],
      sourceUrl: 'https://kelautan.fpik.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Marine Biologist / Peneliti Kelautan di BRIN / Pushidrosal',
        'Scientific Diver & Coral Reef Conservationist',
        'Marine Remote Sensing Analyst',
        'Environmental Consultant Sektor Kelautan & Migas Lepas Pantai',
      ],
      sourceUrl: 'https://kelautan.fpik.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://kelautan.fpik.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://kelautan.fpik.undip.ac.id',
      sourceUrl: 'https://kelautan.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fpik-oseanografi': {
    programId: 'fpik-oseanografi',
    ringkasan: {
      value: 'Oseanografi FPIK UNDIP mempelajari dinamika fisik dan kimiawi samudra, pasang surut, gelombang laut, arus laut global, sirkulasi massa air Arlindo, interaksi laut-atmosfer (El Nino/La Nina), dan rekayasa pantai.',
      sourceUrl: 'https://oseanografi.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Oseanografi Fisika & Dinamika Gelombang Laut',
        'Oseanografi Kimia & Siklus Biogeokimia Laut',
        'Pemodelan Numerik Hidrodinamika Laut (Delft3D / Mike21)',
        'Pasang Surut & Arus Laut Global',
        'Meteorologi Laut & Interaksi Atmosfer-Samudra',
        'Morfologi Pantai & Transport Sedimen Pesisir',
      ],
      sourceUrl: 'https://oseanografi.fpik.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu memodelkan gelombang laut, arus pasut, dan dispersi sedimen pantai menggunakan model numerik',
        'Mampu menganalisis data buoy oseanografi, pasut stasiun, dan citra satelit altimetri',
        'Menguasai perhitungan elevasi muka air laut ekstrem untuk perencanaan dermaga dan seawall',
      ],
      sourceUrl: 'https://oseanografi.fpik.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Oceanographer / Oseanograf di BMKG / BRIN / BIG',
        'Metocean Engineer di Industri Migas Lepas Pantai (Offshore)',
        'Coastal Modeler untuk Rekayasa Pelabuhan & Pesisir',
        'Analis Perubahan Iklim & Kenaikan Muka Air Laut',
      ],
      sourceUrl: 'https://oseanografi.fpik.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://oseanografi.fpik.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://oseanografi.fpik.undip.ac.id',
      sourceUrl: 'https://oseanografi.fpik.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
