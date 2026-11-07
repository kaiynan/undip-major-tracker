// =============================================================================
// UNDIP Major Matcher — Verified Campus Geographic & Architectural Data
// =============================================================================
// Reconstructed based on verified route specifications and official UNDIP
// Tembalang GIS coordinates and masterplan:
// - Entrance (North): UPT Lab (right), Jogging Track & PMB (left).
// - Junction to Student Centre & UNDIP Tower.
// - Branch to FISIP, Architecture, Civil Engineering, and PWK.
// - Geology building leading to the First Roundabout (Bundaran Pertama).
// - Prof. Soedarto Building (GSG), Geodesy, Computer Engineering, and Naval Architecture.
// - Faculty of Engineering Dean's Office, Taman Inspirasi, and Widya Puraya Core
//   (Taman Widya Puraya, Prince Diponegoro White Horse Statue, Rectorate).
// - Road left to Art Centre, FISIP, Law (FH), Humanities (FIB), and Vocational School (SV).
// - Road right to Electrical Engineering, then Three-Way Junction.
// - Left branch to Psychology (FPsi).
// - Right branch to FEB (left side) and FSM (right side).
// - Right turn to Medicine (FK) and RSND (behind FK).
// - Continuing forward to Public Health (FKM), Marine & Fisheries (FPIK),
//   Mechanical, Industrial, Environmental, Chemical Engineering, and Animal/Agro Sciences (FPP).
// =============================================================================

export interface CampusFacultyLocation {
  id: string; // matches Faculty.id ('ft', 'fsm', 'fk', etc.)
  name: string;
  shortName: string;
  zone: 'Zona Barat' | 'Zona Utara' | 'Zona Timur' | 'Zona Selatan' | 'Zona Pusat';
  realCoordinates: {
    lat: number;
    lng: number;
  };
  /**
   * Normalized coordinates on the 16-bit campus map virtual canvas (2000 x 1400 px)
   */
  mapPosition: {
    x: number; // 0 - 2000
    y: number; // 0 - 1400
  };
  landmarkName: string;
  architecturalStyle: {
    silhouette: string;
    dominantColors: string[];
    roofType: string;
    facadeDescription: string;
    distinctiveFeatures: string[];
  };
  referenceSource: string;
  verificationDate: string;
}

export interface CampusLandmarkLocation {
  id: string;
  name: string;
  zone: string;
  mapPosition: {
    x: number;
    y: number;
  };
  description: string;
}

export const campusFacultyLocations: CampusFacultyLocation[] = [
  {
    id: 'ft',
    name: 'Fakultas Teknik',
    shortName: 'FT',
    zone: 'Zona Barat',
    realCoordinates: { lat: -7.052, lng: 110.435 },
    mapPosition: { x: 720, y: 500 },
    landmarkName: 'Gedung Dekanat FT & Jembatan Kaca Penghubung',
    architecturalStyle: {
      silhouette: 'Gedung bertingkat modern dengan jembatan penghubung dan atrium kaca luas',
      dominantColors: ['#991B1B', '#B45309', '#1E293B', '#F8FAFC'],
      roofType: 'Atap dak modern dengan skylight kaca dan cantilever baja ekspos',
      facadeDescription: 'Fasad bata merah terakota khas teknik berpadu kisi-kisi aluminium abu-abu dan kaca tirai biru gelap',
      distinctiveFeatures: ['Jembatan penghubung antar-sayap', 'Plaza teknik luas', 'Monumen gir teknik'],
    },
    referenceSource: 'Masterplan Resmi UNDIP & Arsip Geografis FT Tembalang',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fisip',
    name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    shortName: 'FISIP',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.05, lng: 110.444 },
    mapPosition: { x: 1540, y: 300 },
    landmarkName: 'Gedung Dekanat & Ruang Kuliah Bersama FISIP',
    architecturalStyle: {
      silhouette: 'Kompleks multisedimenter bata ekspos dengan inner-court terbuka dan koridor angin sejuk',
      dominantColors: ['#C2410C', '#78350F', '#FDE68A', '#334155'],
      roofType: 'Atap perisai bersusun dengan ventilasi silang udara alami',
      facadeDescription: 'Dinding terakota oranye kecokelatan dipadu jendela kisi louvre kayu dan kanopi peneduh pejalan kaki',
      distinctiveFeatures: ['Panggung amfiteater terbuka', 'Breezeway koridor angin', 'Taman diskusi mahasiswa'],
    },
    referenceSource: 'Peta Zona FISIP UNDIP Tembalang Timur',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fh',
    name: 'Fakultas Hukum',
    shortName: 'FH',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.052, lng: 110.445 },
    mapPosition: { x: 1540, y: 440 },
    landmarkName: 'Gedung Prof. Satjipto Rahardjo FH',
    architecturalStyle: {
      silhouette: 'Gedung megah berkarakter yudisial dengan kolonade pilar formal tegak dan atap limasan berwibawa',
      dominantColors: ['#991B1B', '#FEF3C7', '#451A03', '#CBD5E1'],
      roofType: 'Atap tajuk Jawa bertingkat dengan overstek genteng merah terakota',
      facadeDescription: 'Deretan pilar neo-klasik putih gading menopang entablatur resmi, melambangkan keadilan dan supremasi hukum',
      distinctiveFeatures: ['Kolonade pilar keadilan', 'Ruang sidang peradilan semu', 'Plaza yustisia'],
    },
    referenceSource: 'Profil Fasilitas FH UNDIP & Peta Tata Ruang Tembalang',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fib',
    name: 'Fakultas Ilmu Budaya',
    shortName: 'FIB',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.053, lng: 110.442 },
    mapPosition: { x: 1320, y: 500 },
    landmarkName: 'Gedung Dekanat & Pendopo Seni Budaya FIB',
    architecturalStyle: {
      silhouette: 'Struktur bernuansa vernakular tradisional Jawa dengan pendopo joglo kayu berukir dan taman bambu',
      dominantColors: ['#78350F', '#451A03', '#D97706', '#F59E0B'],
      roofType: 'Atap Joglo Lambang Gantung asli dengan mahkota tiang tumpangsari',
      facadeDescription: 'Elemen kayu jati ekspos, pilar pendopo kayu berukir, berpadu dinding batu kali dan plesteran hangat',
      distinctiveFeatures: ['Pendopo pentas seni budaya', 'Taman rimbun bambu & mahoni', 'Gedung gamelan karawitan'],
    },
    referenceSource: 'Profil Kebudayaan FIB UNDIP & Peta Kampus Tembalang',
    verificationDate: '2026-11-06',
  },
  {
    id: 'sv',
    name: 'Sekolah Vokasi',
    shortName: 'SV',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.053, lng: 110.448 },
    mapPosition: { x: 1760, y: 500 },
    landmarkName: 'Menara Vokasi & Gedung Teaching Factory (SV)',
    architecturalStyle: {
      silhouette: 'Menara tinggi modern multi-lantai berpadu workshop bengkel terapan industri',
      dominantColors: ['#1E3A8A', '#2563EB', '#F1F5F9', '#475569'],
      roofType: 'Atap bertingkat kontemporer dengan dek observasi teknologi',
      facadeDescription: 'Fasad kaca modern dengan panel komposit biru tua dan abu-abu metalik bergaya industri terapan 4.0',
      distinctiveFeatures: ['Menara perkuliahan Vokasi', 'Bengkel rekayasa terapan', 'Plaza inkubator bisnis terapan'],
    },
    referenceSource: 'Direktorat Sarpras & Masterplan Sekolah Vokasi UNDIP',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fpsi',
    name: 'Fakultas Psikologi',
    shortName: 'FPsi',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.055, lng: 110.446 },
    mapPosition: { x: 1440, y: 740 },
    landmarkName: 'Gedung Dekanat & Laboratorium Psikodiagnostik FPsi',
    architecturalStyle: {
      silhouette: 'Gedung ramah humanistik bertingkat rendah dengan inner garden tenang untuk konseling dan observasi',
      dominantColors: ['#EA580C', '#FFEDD5', '#9A3412', '#475569'],
      roofType: 'Atap limasan kontemporer berteras kanopi peneduh',
      facadeDescription: 'Dinding bernuansa hangat terakota lembut dan krem pastel yang menenangkan dan ramah',
      distinctiveFeatures: ['Taman zen refleksi diri', 'Ruang konseling observasi one-way mirror', 'Lobi ramah interaksi'],
    },
    referenceSource: 'Profil Sarana Prasarana Fakultas Psikologi UNDIP Tembalang',
    verificationDate: '2026-11-06',
  },
  {
    id: 'feb',
    name: 'Fakultas Ekonomika dan Bisnis',
    shortName: 'FEB',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.056, lng: 110.444 },
    mapPosition: { x: 1320, y: 900 },
    landmarkName: 'Gedung Pertamina Hall & Dekanat FEB',
    architecturalStyle: {
      silhouette: 'Gedung dekanat simetris prestisius dengan hall kubah melengkung dan pilar kokoh',
      dominantColors: ['#B45309', '#78350F', '#FEF3C7', '#1E3A8A'],
      roofType: 'Kubah auditorium perunggu-tembaga berpadu atap limasan klasik',
      facadeDescription: 'Kombinasi dinding bata terakota hangat dengan portico pilar putih gading dan kubah sentral',
      distinctiveFeatures: ['Auditorium Hall Pertamina', 'Pilar gerbang megah', 'Plaza pertukaran bursa efek'],
    },
    referenceSource: 'Dokumentasi Arsitektur FEB UNDIP Tembalang Timur',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fsm',
    name: 'Fakultas Sains dan Matematika',
    shortName: 'FSM',
    zone: 'Zona Pusat',
    realCoordinates: { lat: -7.056, lng: 110.439 },
    mapPosition: { x: 1000, y: 920 },
    landmarkName: 'Gedung Acintyacunyata FSM',
    architecturalStyle: {
      silhouette: 'Struktur sains modern bertingkat empat dengan sayap laboratorium komputasi dan sains dasar',
      dominantColors: ['#0284C7', '#0F172A', '#E2E8F0', '#38BDF8'],
      roofType: 'Atap miring bertingkat kontemporer dengan panel ventilasi aerodinamis',
      facadeDescription: 'Dinding putih krem beraksen garis vertikal biru elektrik dan jendela laboratorium berpola modular rapi',
      distinctiveFeatures: ['Menara observasi kubah kecil', 'Fasad kisi surya geometris', 'Taman sains botanika'],
    },
    referenceSource: 'Masterplan Kampus UNDIP Tembalang & Profil FSM UNDIP',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fk',
    name: 'Fakultas Kedokteran',
    shortName: 'FK',
    zone: 'Zona Selatan',
    realCoordinates: { lat: -7.058, lng: 110.443 },
    mapPosition: { x: 1240, y: 1080 },
    landmarkName: 'Kompleks Fakultas Kedokteran & RSND (Rumah Sakit Nasional Diponegoro)',
    architecturalStyle: {
      silhouette: 'Kompleks rumah sakit pendidikan dan gedung dekanat kedokteran megah bertingkat',
      dominantColors: ['#047857', '#F8FAFC', '#065F46', '#10B981'],
      roofType: 'Kombinasi atap modern rumah sakit dengan kanopi drop-off darurat',
      facadeDescription: 'Dinding putih klinis bersih beraksen hijau zamrud medis, lobi kaca ganda, dan sayap rawat terpadu',
      distinctiveFeatures: ['Emblem silang medis hijau', 'Drop-off lobi luas', 'Akses terhubung ke paviliun RSND'],
    },
    referenceSource: 'Direktorat Sarana Prasarana UNDIP & GIS RSND Kampus Tembalang',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fkm',
    name: 'Fakultas Kesehatan Masyarakat',
    shortName: 'FKM',
    zone: 'Zona Selatan',
    realCoordinates: { lat: -7.058, lng: 110.438 },
    mapPosition: { x: 960, y: 1140 },
    landmarkName: 'Gedung Dekanat & Laboratorium Terpadu FKM',
    architecturalStyle: {
      silhouette: 'Gedung bertingkat tiga yang asri dengan teras terbuka dan laboratorium sanitasi lingkungan',
      dominantColors: ['#0D9488', '#F0FDFA', '#115E59', '#64748B'],
      roofType: 'Atap pelana bertingkat modern dengan ventilasi sanitasi lingkungan',
      facadeDescription: 'Fasad bernuansa hijau toska cerah dan krem bersih dengan selasar sirkulasi udara optimal',
      distinctiveFeatures: ['Sayap lab epidemiologi & K3', 'Taman toga tanaman obat', 'Plaza promosi kesehatan'],
    },
    referenceSource: 'Masterplan FKM UNDIP Kampus Tembalang Selatan',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fpik',
    name: 'Fakultas Perikanan dan Ilmu Kelautan',
    shortName: 'FPIK',
    zone: 'Zona Selatan',
    realCoordinates: { lat: -7.058, lng: 110.435 },
    mapPosition: { x: 760, y: 1140 },
    landmarkName: 'Gedung Marine Science Center & Hatchery FPIK',
    architecturalStyle: {
      silhouette: 'Gedung bernuansa maritim dengan aksen haluan kapal dan kolam percontohan akuakultur',
      dominantColors: ['#0369A1', '#0284C7', '#E0F2FE', '#0C4A6E'],
      roofType: 'Bentuk atap terinspirasi gelombang samudra dan haluan kapal oseanografi',
      facadeDescription: 'Dinding biru bahari dengan garis putih ombak, jendela bulat kapal, serta instalasi akuarium riset perairan',
      distinctiveFeatures: ['Kolam percobaan basah', 'Hatchery benih ikan', 'Laboratorium oseanografi terpadu'],
    },
    referenceSource: 'Dokumen Kelautan FPIK UNDIP & Peta Citra Satelit Kampus Selatan',
    verificationDate: '2026-11-06',
  },
  {
    id: 'fpp',
    name: 'Fakultas Peternakan dan Pertanian',
    shortName: 'FPP',
    zone: 'Zona Selatan',
    realCoordinates: { lat: -7.058, lng: 110.431 },
    mapPosition: { x: 480, y: 1140 },
    landmarkName: 'Agro-Kompleks Green House & Dekanat FPP',
    architecturalStyle: {
      silhouette: 'Kompleks agrosains dengan green house kaca bening, kandang percontohan modern, dan laboratorium pangan',
      dominantColors: ['#15803D', '#4D7C0F', '#FEF9C3', '#713F12'],
      roofType: 'Atap gable ventilasi agrikultur dengan struktur green house panel bening',
      facadeDescription: 'Warna hijau daun dan bata tanah liat dengan hamparan kebun percobaan agroteknologi di sekitarnya',
      distinctiveFeatures: ['Green house riset hidroponik', 'Lahan ternak mini percontohan', 'Laboratorium teknologi pangan'],
    },
    referenceSource: 'Peta Agro-Kompleks FPP UNDIP Tembalang Barat Daya',
    verificationDate: '2026-11-06',
  },
];

export const campusLandmarks: CampusLandmarkLocation[] = [
  {
    id: 'gerbang-utama',
    name: 'Pintu Gerbang Utama Tembalang',
    zone: 'Zona Utara',
    mapPosition: { x: 800, y: 60 },
    description: 'Pintu gerbang monumental penyambut selamat datang di Kampus UNDIP Tembalang Jl. Prof. Soedarto',
  },
  {
    id: 'upt-lab',
    name: 'UPT Laboratorium Terpadu',
    zone: 'Zona Utara',
    mapPosition: { x: 640, y: 100 },
    description: 'Laboratorium terpadu universitas di sisi kanan setelah gerbang utama',
  },
  {
    id: 'pmb',
    name: 'Gedung PMB & Trek Jogging Lama',
    zone: 'Zona Utara',
    mapPosition: { x: 1040, y: 100 },
    description: 'Gedung Penerimaan Mahasiswa Baru dan lintasan jogging track lama di sisi kiri gerbang',
  },
  {
    id: 'student-centre',
    name: 'Student Centre & Menara UNDIP Tower',
    zone: 'Zona Utara',
    mapPosition: { x: 1220, y: 130 },
    description: 'Gedung Student Centre kegiatan mahasiswa dan Menara UNDIP Tower di percabangan kiri jalan masuk',
  },
  {
    id: 'teknik-geologi',
    name: 'Gedung Teknik Geologi',
    zone: 'Zona Barat',
    mapPosition: { x: 730, y: 240 },
    description: 'Gedung Teknik Geologi sebelum mencapai Bundaran Pertama',
  },
  {
    id: 'bundaran-pertama',
    name: 'Bundaran Pertama (Prof. Soedarto)',
    zone: 'Zona Barat',
    mapPosition: { x: 800, y: 340 },
    description: 'Bundaran pertama yang menghubungkan GSG, Geodesi, Komputer, dan Perkapalan',
  },
  {
    id: 'gsg',
    name: 'Gedung Pertemuan Prof. Soedarto (GSG)',
    zone: 'Zona Barat',
    mapPosition: { x: 580, y: 320 },
    description: 'Gedung pertemuan dan wisuda utama di sebelah barat Bundaran Pertama',
  },
  {
    id: 'teknik-sipil-arsitektur-pwk',
    name: 'Kompleks Arsitektur, Sipil, & PWK',
    zone: 'Zona Timur',
    mapPosition: { x: 1180, y: 230 },
    description: 'Klaster departemen Arsitektur, Teknik Sipil, dan Perencanaan Wilayah dan Kota (PWK)',
  },
  {
    id: 'teknik-komputer-geodesi',
    name: 'Gedung Komputer, Geodesi, & Perkapalan',
    zone: 'Zona Barat',
    mapPosition: { x: 960, y: 380 },
    description: 'Sayap departemen Teknik Komputer, Teknik Geodesi, dan Teknik Perkapalan',
  },
  {
    id: 'dekanat-ft',
    name: 'Gedung Dekanat Fakultas Teknik',
    zone: 'Zona Barat',
    mapPosition: { x: 720, y: 500 },
    description: 'Pusat dekanat Fakultas Teknik sebelum percabangan ke Widya Puraya',
  },
  {
    id: 'taman-inspirasi',
    name: 'Taman Inspirasi',
    zone: 'Zona Barat',
    mapPosition: { x: 730, y: 600 },
    description: 'Taman terbuka asri di seberang kawasan Widya Puraya',
  },
  {
    id: 'widya-puraya',
    name: 'Kawasan Widya Puraya & Patung Kuda Pangeran Diponegoro',
    zone: 'Zona Pusat',
    mapPosition: { x: 980, y: 580 },
    description: 'Kawasan ikonik Rektorat dengan atap joglo megah, Lapangan Widya Puraya, dan Patung Kuda Pangeran Diponegoro putih gagah',
  },
  {
    id: 'art-centre',
    name: 'Art Centre UNDIP',
    zone: 'Zona Timur',
    mapPosition: { x: 1320, y: 380 },
    description: 'Pusat seni dan kebudayaan mahasiswa di dekat area FISIP',
  },
  {
    id: 'teknik-elektro',
    name: 'Gedung Teknik Elektro',
    zone: 'Zona Barat',
    mapPosition: { x: 860, y: 700 },
    description: 'Departemen Teknik Elektro di sisi kanan setelah Widya Puraya',
  },
  {
    id: 'pertigaan-timur',
    name: 'Pertigaan Tiga Arah (FPsi, FEB, FSM)',
    zone: 'Zona Pusat',
    mapPosition: { x: 1080, y: 800 },
    description: 'Persimpangan strategis bercabang ke kiri menuju Psikologi, dan ke kanan menuju FEB & FSM',
  },
  {
    id: 'rsnd',
    name: 'Rumah Sakit Nasional Diponegoro (RSND)',
    zone: 'Zona Selatan',
    mapPosition: { x: 1480, y: 1100 },
    description: 'Rumah sakit pendidikan rujukan tipe B milik UNDIP tepat di belakang Fakultas Kedokteran',
  },
  {
    id: 'teknik-mesin-industri-kimia',
    name: 'Kompleks Mesin, Industri, Lingkungan, & Kimia',
    zone: 'Zona Selatan',
    mapPosition: { x: 620, y: 980 },
    description: 'Sayap selatan departemen Teknik Mesin, Teknik Industri, Teknik Lingkungan, dan Teknik Kimia',
  },
];
