import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fibProgramDetails: Record<string, ProgramDetail> = {
  'fib-sastra-indonesia': {
    programId: 'fib-sastra-indonesia',
    ringkasan: {
      value: 'Sastra Indonesia FIB UNDIP mendalami linguistik deskriptif, filologi naskah kuno Nusantara, sastra modern, penulisan kreatif, penyuntingan naskah (editing), dan pengajaran Bahasa Indonesia bagi Penutur Asing (BIPA).',
      sourceUrl: 'https://sasindo.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Filologi & Kodikologi Naskah Nusantara',
        'Linguistik Terapan & Leksikografi',
        'Kritik Sastra & Sosiologi Sastra',
        'Penyuntingan & Tata Bahasa Baku',
        'Pengajaran BIPA (Bahasa Indonesia Penutur Asing)',
        'Penulisan Kreatif & Skenario Sastra',
      ],
      sourceUrl: 'https://sasindo.fib.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyunting naskah cetak dan digital sesuai kaidah Ejaan Bahasa Indonesia yang Disempurnakan (EYD)',
        'Mampu membaca, mentransliterasi, dan menganalisis naskah manuskrip tradisional',
        'Mampu mengajarkan bahasa dan budaya Indonesia kepada pembelajar internasional',
      ],
      sourceUrl: 'https://sasindo.fib.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Editor Naskah & Penerbitan Buku',
        'Pengajar BIPA di Dalam & Luar Negeri',
        'Penulis Kreatif, Novelis & Penulis Naskah',
        'Peneliti Bahasa di Badan Bahasa Kemendikdasmen',
      ],
      sourceUrl: 'https://sasindo.fib.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://sasindo.fib.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://sasindo.fib.undip.ac.id',
      sourceUrl: 'https://sasindo.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fib-sastra-inggris': {
    programId: 'fib-sastra-inggris',
    ringkasan: {
      value: 'Sastra Inggris FIB UNDIP memadukan linguistik bahasa Inggris, penerjemahan lisan dan tulisan (interpreting & translating), kajian sastra dan budaya kontemporer dunia, serta komunikasi bisnis internasional.',
      sourceUrl: 'https://sastrainggris.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Penerjemahan Dokumen & Subtitling',
        'Interpreting Lisan Simultan & Konsekutif',
        'Analisis Wacana Kritis (Critical Discourse Analysis)',
        'Kajian Budaya Kontemporer & Sastra Dunia',
        'English for Business & Corporate Communication',
        'Sociolinguistics & Pragmatics',
      ],
      sourceUrl: 'https://sastrainggris.fib.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menerjemahkan teks hukum, medis, dan sastra dari dan ke bahasa Inggris dengan akurat',
        'Mampu melakukan penerjemahan lisan (interpreting) dalam konferensi internasional',
        'Menguasai komunikasi antarbudaya untuk relasi bisnis multinasional',
      ],
      sourceUrl: 'https://sastrainggris.fib.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Penerjemah Tersumpah & Subtitler Media',
        'Conference Interpreter Internasional',
        'International Relations & Public Relations Officer',
        'Content Writer & Copywriter Bahasa Inggris',
      ],
      sourceUrl: 'https://sastrainggris.fib.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://sastrainggris.fib.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://sastrainggris.fib.undip.ac.id',
      sourceUrl: 'https://sastrainggris.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fib-sejarah': {
    programId: 'fib-sejarah',
    ringkasan: {
      value: 'Ilmu Sejarah FIB UNDIP adalah pusat keunggulan sejarah maritim Indonesia, sejarah perkotaan kolonial, dan historiografi kritis Nusantara. Mahasiswa dididik dalam penelusuran arsip primer, kritik sumber sejarah, dan digital humanities.',
      sourceUrl: 'https://sejarah.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Sejarah Maritim Indonesia',
        'Historiografi & Metodologi Sejarah Kritis',
        'Paleografi & Pembacaan Arsip Kolonial (Bahasa Belanda)',
        'Sejarah Sosial Ekonomi & Perkotaan',
        'Sejarah Lisan (Oral History)',
        'Manajemen Warisan Budaya & Museologi',
      ],
      sourceUrl: 'https://sejarah.fib.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu meneliti dan mengkritisi sumber arsip sejarah primer di lembaga arsip nasional (ANRI)',
        'Mampu menyusun narasi sejarah lokal, korporasi, dan nasional yang ilmiah dan objektif',
        'Menguasai kurasi koleksi sejarah untuk museum dan cagar budaya',
      ],
      sourceUrl: 'https://sejarah.fib.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Sejarawan & Peneliti Sejarah Sosial',
        'Kurator Museum & Pemandu Warisan Budaya Heritage',
        'Arsiparis di Arsip Nasional RI (ANRI) / Perusahaan',
        'Penulis Dokumenter & Konsultan Sejarah Film',
      ],
      sourceUrl: 'https://sejarah.fib.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://sejarah.fib.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://sejarah.fib.undip.ac.id',
      sourceUrl: 'https://sejarah.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fib-perpustakaan': {
    programId: 'fib-perpustakaan',
    ringkasan: {
      value: 'Ilmu Perpustakaan FIB UNDIP mempelajari manajemen informasi digital, preservasi arsip digital, sistem repositori institusi, metadata temu balik informasi, dan literasi data modern.',
      sourceUrl: 'https://ilmuperpustakaan.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Pengorganisasian Informasi & Pengatalogan Metadata',
        'Sistem Temu Balik Informasi (Information Retrieval)',
        'Perpustakaan Digital & Repositori Institusi (EPrints / DSpace)',
        'Preservasi & Konservasi Dokumen Digital',
        'Literasi Informasi & Analisis Bibliometrik',
        'Manajemen Basis Data Perpustakaan (SLiMS)',
      ],
      sourceUrl: 'https://ilmuperpustakaan.fib.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu mengelola sistem otomasi perpustakaan berbasis perangkat lunak modern',
        'Mampu merancang skema metadata untuk temu kembali dokumen elektronik secara cepat',
        'Menguasai teknik preservasi kurasi data digital untuk arsip jangka panjang',
      ],
      sourceUrl: 'https://ilmuperpustakaan.fib.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Pustakawan Profesional di Universitas / Perpustakaan Nasional',
        'Information & Knowledge Management Specialist Korporasi',
        'Digital Archivist / Pengelola Arsip Digital',
        'Data Curator & Bibliometric Analyst',
      ],
      sourceUrl: 'https://ilmuperpustakaan.fib.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://ilmuperpustakaan.fib.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://ilmuperpustakaan.fib.undip.ac.id',
      sourceUrl: 'https://ilmuperpustakaan.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fib-bahasa-jepang': {
    programId: 'fib-bahasa-jepang',
    ringkasan: {
      value: 'Bahasa dan Kebudayaan Jepang FIB UNDIP menekankan kemahiran bahasa Jepang tingkat lanjutan (JLPT N2/N1), linguistik Jepang, sastra dan budaya masyarakat Jepang, serta etika bisnis Jepang (hou-ren-so) untuk karier global.',
      sourceUrl: 'https://kejepangan.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Bahasa Jepang Bisnis & Komunikasi Perusahaan',
        'Penerjemahan Lisan & Tulisan Jepang-Indonesia',
        'Kebudayaan & Etika Kerja Masyarakat Jepang',
        'Linguistik & Tata Bahasa Jepang Lanjutan',
        'Kajian Sastra & Budaya Populer Jepang',
        'Persiapan Uji Kemahiran Bahasa Jepang (JLPT N2/N1)',
      ],
      sourceUrl: 'https://kejepangan.fib.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu berkomunikasi lisan dan tulisan dalam bahasa Jepang standar bisnis internasional',
        'Mampu menerjemahkan dokumen teknik, manufaktur, dan bisnis Jepang secara akurat',
        'Menguasai etika bisnis Jepang untuk integrasi lingkungan kerja perusahaan multinasional',
      ],
      sourceUrl: 'https://kejepangan.fib.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Penerjemah / Interpreter Bahasa Jepang di Perusahaan Multinasional',
        'Japanese Corporate Coordinator di Jepang / Indonesia',
        'Staf Kedutaan Besar / Konsulat Jenderal Jepang',
        'Instruktur Bahasa & Kebudayaan Jepang',
      ],
      sourceUrl: 'https://kejepangan.fib.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2023,
      },
      sourceUrl: 'https://kejepangan.fib.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://kejepangan.fib.undip.ac.id',
      sourceUrl: 'https://kejepangan.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fib-antropologi': {
    programId: 'fib-antropologi',
    ringkasan: {
      value: 'Antropologi Sosial FIB UNDIP mempelajari keragaman budaya, etnografi masyarakat pesisir dan pedesaan, dinamika perubahan sosial, antropologi pembangunan, dan kearifan lokal dalam penyelesaian persoalan kemanusiaan.',
      sourceUrl: 'https://antropologi.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Metode Etnografi & Observasi Partisipan',
        'Antropologi Pesisir & Masyarakat Nelayan',
        'Antropologi Pembangunan & Dampak Sosial',
        'Antropologi Ekologi & Lingkungan Hidup',
        'Kajian Kebudayaan Jawa & Tradisi Nusantara',
        'Resolusi Konflik & Negosiasi Kultural',
      ],
      sourceUrl: 'https://antropologi.fib.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu melaksanakan penelitian lapangan etnografis mendalam dengan observasi partisipan',
        'Mampu menyusun Social Impact Assessment (SIA) untuk program pembangunan infrastruktur',
        'Mampu memetakan modal sosial dan kearifan lokal komunitas adat',
      ],
      sourceUrl: 'https://antropologi.fib.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Social Impact Analyst / Konsultan AMDAL Sosial',
        'Community Development Officer di Program CSR Perusahaan',
        'Peneliti Budaya & Etnografer di Lembaga Riset (BRIN)',
        'Spesialis Pemberdayaan Masyarakat di NGO / PBB',
      ],
      sourceUrl: 'https://antropologi.fib.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://antropologi.fib.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://antropologi.fib.undip.ac.id',
      sourceUrl: 'https://antropologi.fib.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
