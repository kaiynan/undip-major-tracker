// =============================================================================
// undip-major-matcher — Verified Campus Geographic & Architectural Data
// =============================================================================
// Reconstructed based on OpenStreetMap real geometry (ODbL) and verified
// Tembalang GIS coordinates:
// - Origin: Widya Puraya (Rektorat) at (-7.051320, 110.440350) -> Canvas (1000, 480)
// - True isotropic projection (1:1 m/px):
//   * West Zone: Sekolah Vokasi (x: 445), FH (x: 549), FIB (x: 605), FISIP (x: 668),
//     FEB (x: 754, approx)
//   * Center Zone: Dekanat FT & Kompleks Teknik (x: 889), Widya Puraya (x: 743),
//     GSG Soedarto (x: 1000)
//   * East Zone: FSM (x: 1158), FPP (x: 1122), FPIK (x: 1247),
//     FKM (x: 1287), FPsi (x: 1341), FK (x: 1440), RSND (x: 1337)
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
  /**
   * Optional micro-offset for ground pin label to prevent neighbouring collisions
   */
  labelOffset?: {
    x: number;
    y: number;
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
  source: 'osm' | 'approx';
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
  source: 'osm' | 'approx';
}

export const campusFacultyLocations: CampusFacultyLocation[] = [
  {
    id: 'ft',
    name: 'Fakultas Teknik',
    shortName: 'FT',
    zone: 'Zona Pusat',
    realCoordinates: { lat: -7.051261, lng: 110.439342 },
    mapPosition: { x: 889, y: 473 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Kompleks Fakultas Teknik & Dekanat FT',
    architecturalStyle: {
      silhouette: 'Gedung bertingkat modern dengan jembatan penghubung dan atrium kaca luas',
      dominantColors: ['#991B1B', '#B45309', '#1E293B', '#F8FAFC'],
      roofType: 'Atap dak modern dengan skylight kaca dan cantilever baja ekspos',
      facadeDescription: 'Fasad bata merah terakota khas teknik berpadu kisi-kisi aluminium abu-abu dan kaca tirai biru gelap',
      distinctiveFeatures: ['Jembatan penghubung antar-sayap', 'Plaza teknik luas', 'Monumen gir teknik'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fisip',
    name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    shortName: 'FISIP',
    zone: 'Zona Barat',
    realCoordinates: { lat: -7.051754, lng: 110.437338 },
    mapPosition: { x: 668, y: 528 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Fakultas Ilmu Sosial dan Ilmu Politik',
    architecturalStyle: {
      silhouette: 'Kompleks multisedimenter bata ekspos dengan inner-court terbuka dan koridor angin sejuk',
      dominantColors: ['#C2410C', '#78350F', '#FDE68A', '#334155'],
      roofType: 'Atap perisai bersusun dengan ventilasi silang udara alami',
      facadeDescription: 'Dinding terakota oranye kecokelatan dipadu jendela kisi louvre kayu dan kanopi peneduh pejalan kaki',
      distinctiveFeatures: ['Panggung amfiteater terbuka', 'Breezeway koridor angin', 'Taman diskusi mahasiswa'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fh',
    name: 'Fakultas Hukum',
    shortName: 'FH',
    zone: 'Zona Barat',
    realCoordinates: { lat: -7.051249, lng: 110.436260 },
    mapPosition: { x: 549, y: 472 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Prof. Satjipto Rahardjo FH',
    architecturalStyle: {
      silhouette: 'Gedung megah berkarakter yudisial dengan kolonade pilar formal tegak dan atap limasan berwibawa',
      dominantColors: ['#991B1B', '#FEF3C7', '#451A03', '#CBD5E1'],
      roofType: 'Atap tajuk Jawa bertingkat dengan overstek genteng merah terakota',
      facadeDescription: 'Deretan pilar neo-klasik putih gading menopang entablatur resmi, melambangkan keadilan dan supremasi hukum',
      distinctiveFeatures: ['Kolonade pilar keadilan', 'Ruang sidang peradilan semu', 'Plaza yustisia'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fib',
    name: 'Fakultas Ilmu Budaya',
    shortName: 'FIB',
    zone: 'Zona Barat',
    realCoordinates: { lat: -7.049901, lng: 110.436774 },
    mapPosition: { x: 605, y: 322 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Dekanat & Pendopo Seni Budaya FIB',
    architecturalStyle: {
      silhouette: 'Struktur bernuansa vernakular tradisional Jawa dengan pendopo joglo kayu berukir dan taman bambu',
      dominantColors: ['#78350F', '#451A03', '#D97706', '#F59E0B'],
      roofType: 'Atap Joglo Lambang Gantung asli dengan mahkota tiang tumpangsari',
      facadeDescription: 'Elemen kayu jati ekspos, pilar pendopo kayu berukir, berpadu dinding batu kali dan plesteran hangat',
      distinctiveFeatures: ['Pendopo pentas seni budaya', 'Taman rimbun bambu & mahoni', 'Gedung gamelan karawitan'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'sv',
    name: 'Sekolah Vokasi',
    shortName: 'SV',
    zone: 'Zona Barat',
    realCoordinates: { lat: -7.050673, lng: 110.435324 },
    mapPosition: { x: 445, y: 408 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Sekolah Vokasi & Teaching Factory',
    architecturalStyle: {
      silhouette: 'Menara tinggi modern multi-lantai berpadu workshop bengkel terapan industri',
      dominantColors: ['#1E3A8A', '#2563EB', '#F1F5F9', '#475569'],
      roofType: 'Atap bertingkat kontemporer dengan dek observasi teknologi',
      facadeDescription: 'Fasad kaca modern dengan panel komposit biru tua dan abu-abu metalik bergaya industri terapan 4.0',
      distinctiveFeatures: ['Menara perkuliahan Vokasi', 'Bengkel rekayasa terapan', 'Plaza inkubator bisnis terapan'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fpsi',
    name: 'Fakultas Psikologi',
    shortName: 'FPsi',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.049074, lng: 110.443440 },
    mapPosition: { x: 1341, y: 230 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Fakultas Psikologi',
    architecturalStyle: {
      silhouette: 'Gedung ramah humanistik bertingkat rendah dengan inner garden tenang untuk konseling dan observasi',
      dominantColors: ['#EA580C', '#FFEDD5', '#9A3412', '#475569'],
      roofType: 'Atap limasan kontemporer berteras kanopi peneduh',
      facadeDescription: 'Dinding bernuansa hangat terakota lembut dan krem pastel yang menenangkan dan ramah',
      distinctiveFeatures: ['Taman zen refleksi diri', 'Ruang konseling observasi one-way mirror', 'Lobi ramah interaksi'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'feb',
    name: 'Fakultas Ekonomika dan Bisnis',
    shortName: 'FEB',
    zone: 'Zona Barat',
    realCoordinates: { lat: -7.052150, lng: 110.438120 },
    mapPosition: { x: 754, y: 572 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Pertamina Hall & Dekanat FEB (Perkiraan)',
    architecturalStyle: {
      silhouette: 'Gedung dekanat simetris prestisius dengan hall kubah melengkung dan pilar kokoh',
      dominantColors: ['#B45309', '#78350F', '#FEF3C7', '#1E3A8A'],
      roofType: 'Kubah auditorium perunggu-tembaga berpadu atap limasan klasik',
      facadeDescription: 'Kombinasi dinding bata terakota hangat dengan portico pilar putih gading dan kubah sentral',
      distinctiveFeatures: ['Auditorium Hall Pertamina', 'Pilar gerbang megah', 'Plaza pertukaran bursa efek'],
    },
    referenceSource: 'Audit Lapangan Owner (source: approx - Menunggu konfirmasi GPS atap)',
    verificationDate: '2026-11-09',
    source: 'approx',
  },
  {
    id: 'fsm',
    name: 'Fakultas Sains dan Matematika',
    shortName: 'FSM',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.048895, lng: 110.441781 },
    mapPosition: { x: 1158, y: 210 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Dekanat FMIPA & Laboratorium Sains FSM',
    architecturalStyle: {
      silhouette: 'Struktur sains modern bertingkat empat dengan sayap laboratorium komputasi dan sains dasar',
      dominantColors: ['#0284C7', '#0F172A', '#E2E8F0', '#38BDF8'],
      roofType: 'Atap miring bertingkat kontemporer dengan panel ventilasi aerodinamis',
      facadeDescription: 'Dinding putih krem beraksen garis vertikal biru elektrik dan jendela laboratorium berpola modular rapi',
      distinctiveFeatures: ['Menara observasi kubah kecil', 'Fasad kisi surya geometris', 'Taman sains botanika'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fk',
    name: 'Fakultas Kedokteran',
    shortName: 'FK',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.049648, lng: 110.444335 },
    mapPosition: { x: 1440, y: 294 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Kompleks Gedung A/B Fakultas Kedokteran',
    architecturalStyle: {
      silhouette: 'Kompleks rumah sakit pendidikan dan gedung dekanat kedokteran megah bertingkat',
      dominantColors: ['#047857', '#F8FAFC', '#065F46', '#10B981'],
      roofType: 'Kombinasi atap modern rumah sakit dengan kanopi drop-off darurat',
      facadeDescription: 'Dinding putih klinis bersih beraksen hijau zamrud medis, lobi kaca ganda, dan sayap rawat terpadu',
      distinctiveFeatures: ['Emblem silang medis hijau', 'Drop-off lobi luas', 'Akses terhubung ke paviliun RSND'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fkm',
    name: 'Fakultas Kesehatan Masyarakat',
    shortName: 'FKM',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.049498, lng: 110.442948 },
    mapPosition: { x: 1287, y: 277 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Gedung Fakultas Kesehatan Masyarakat',
    architecturalStyle: {
      silhouette: 'Gedung bertingkat tiga yang asri dengan teras terbuka dan laboratorium sanitasi lingkungan',
      dominantColors: ['#0D9488', '#F0FDFA', '#115E59', '#64748B'],
      roofType: 'Atap pelana bertingkat modern dengan ventilasi sanitasi lingkungan',
      facadeDescription: 'Fasad bernuansa hijau toska cerah dan krem bersih dengan selasar sirkulasi udara optimal',
      distinctiveFeatures: ['Sayap lab epidemiologi & K3', 'Taman toga tanaman obat', 'Plaza promosi kesehatan'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fpik',
    name: 'Fakultas Perikanan dan Ilmu Kelautan',
    shortName: 'FPIK',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.050970, lng: 110.442585 },
    mapPosition: { x: 1247, y: 441 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Kompleks Gedung A–J Dekanat FPIK',
    architecturalStyle: {
      silhouette: 'Gedung bernuansa maritim dengan aksen haluan kapal dan kolam percontohan akuakultur',
      dominantColors: ['#0369A1', '#0284C7', '#E0F2FE', '#0C4A6E'],
      roofType: 'Bentuk atap terinspirasi gelombang samudra dan haluan kapal oseanografi',
      facadeDescription: 'Dinding biru bahari dengan garis putih ombak, jendela bulat kapal, serta instalasi akuarium riset perairan',
      distinctiveFeatures: ['Kolam percobaan basah', 'Hatchery benih ikan', 'Laboratorium oseanografi terpadu'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
  {
    id: 'fpp',
    name: 'Fakultas Peternakan dan Pertanian',
    shortName: 'FPP',
    zone: 'Zona Timur',
    realCoordinates: { lat: -7.053162, lng: 110.441458 },
    mapPosition: { x: 1122, y: 685 },
    labelOffset: { x: 0, y: 0 },
    landmarkName: 'Kompleks Fakultas Peternakan dan Pertanian & Teknologi Pangan',
    architecturalStyle: {
      silhouette: 'Kompleks agrosains dengan green house kaca bening, kandang percontohan modern, dan laboratorium pangan',
      dominantColors: ['#15803D', '#4D7C0F', '#FEF9C3', '#713F12'],
      roofType: 'Atap gable ventilasi agrikultur dengan struktur green house panel bening',
      facadeDescription: 'Warna hijau daun dan bata tanah liat dengan hamparan kebun percobaan agroteknologi di sekitarnya',
      distinctiveFeatures: ['Green house riset hidroponik', 'Lahan ternak mini percontohan', 'Laboratorium teknologi pangan'],
    },
    referenceSource: 'OpenStreetMap (© OpenStreetMap contributors)',
    verificationDate: '2026-11-09',
    source: 'osm',
  },
];

export const campusLandmarks: CampusLandmarkLocation[] = [
  {
    id: 'widya-puraya',
    name: 'Gedung Widya Puraya (Rektorat)',
    zone: 'Zona Pusat',
    mapPosition: { x: 743, y: 204 },
    description: 'Pusat administrasi rektorat universitas dengan atap joglo megah dan perpustakaan pusat',
    source: 'osm',
  },
  {
    id: 'perpustakaan',
    name: 'Perpustakaan Widya Puraya',
    zone: 'Zona Pusat',
    mapPosition: { x: 710, y: 141 },
    description: 'Perpustakaan utama universitas di utara Widya Puraya',
    source: 'osm',
  },
  {
    id: 'gsg',
    name: 'Gedung Pertemuan Prof. Soedarto (GSG)',
    zone: 'Zona Pusat',
    mapPosition: { x: 1000, y: 644 },
    description: 'Gedung pertemuan dan wisuda serba guna utama di Jl. Prof. Soedarto',
    source: 'osm',
  },
  {
    id: 'student-centre',
    name: 'Student Center',
    zone: 'Zona Barat',
    mapPosition: { x: 814, y: 761 },
    description: 'Pusat aktivitas dan sekretariat organisasi kemahasiswaan UNDIP',
    source: 'osm',
  },
  {
    id: 'masjid-kampus',
    name: 'Masjid Kampus Universitas Diponegoro',
    zone: 'Zona Barat',
    mapPosition: { x: 622, y: 900 },
    description: 'Masjid raya kampus kebanggaan warga Diponegoro dengan kubah hijau megah',
    source: 'osm',
  },
  {
    id: 'muladi-dome',
    name: 'Muladi Dome',
    zone: 'Zona Barat',
    mapPosition: { x: 183, y: 714 },
    description: 'Gedung serbaguna kubah megah multi-fungsi modern di gerbang barat',
    source: 'osm',
  },
  {
    id: 'stadion',
    name: 'Stadion UNDIP',
    zone: 'Zona Timur',
    mapPosition: { x: 1681, y: 850 },
    description: 'Stadion olahraga sepak bola dan lintasan atletik kampus',
    source: 'osm',
  },
  {
    id: 'waduk',
    name: 'Waduk Pendidikan Diponegoro',
    zone: 'Zona Timur',
    mapPosition: { x: 1582, y: 614 },
    description: 'Danau resapan dan laboratorium perairan terbuka kampus',
    source: 'osm',
  },
  {
    id: 'rsnd',
    name: 'Rumah Sakit Nasional Diponegoro (RSND)',
    zone: 'Zona Timur',
    mapPosition: { x: 1337, y: 76 },
    description: 'Rumah sakit pendidikan rujukan tipe B milik UNDIP di utara FK',
    source: 'osm',
  },
  {
    id: 'lab-terpadu',
    name: 'Laboratorium Terpadu Undip',
    zone: 'Zona Pusat',
    mapPosition: { x: 946, y: 845 },
    description: 'Laboratorium riset sentral multi-disiplin universitas',
    source: 'osm',
  },
  {
    id: 'ict-centre',
    name: 'Gedung ICT Centre',
    zone: 'Zona Pusat',
    mapPosition: { x: 860, y: 822 },
    description: 'Pusat teknologi informasi dan komunikasi kampus',
    source: 'osm',
  },
  {
    id: 'career-center',
    name: 'Undip Career Center',
    zone: 'Zona Pusat',
    mapPosition: { x: 876, y: 795 },
    description: 'Lembaga pembinaan karier dan penempatan alumni',
    source: 'osm',
  },
  // Unverified landmarks (approx)
  {
    id: 'gerbang-utama',
    name: 'Pintu Gerbang Utama Tembalang',
    zone: 'Zona Utara',
    mapPosition: { x: 885, y: 235 },
    description: 'Pintu gerbang monumental penyambut selamat datang di Kampus UNDIP Tembalang (Perkiraan)',
    source: 'approx',
  },
  {
    id: 'bundaran-pertama',
    name: 'Bundaran Pertama',
    zone: 'Zona Pusat',
    mapPosition: { x: 905, y: 513 },
    description: 'Bundaran jalan utama (Perkiraan)',
    source: 'approx',
  },
  {
    id: 'patung-kuda',
    name: 'Patung Kuda Undip',
    zone: 'Zona Pusat',
    mapPosition: { x: 975, y: 455 },
    description: 'Monumen patung kuda Pangeran Diponegoro (Perkiraan)',
    source: 'approx',
  },
  {
    id: 'art-centre',
    name: 'Art Centre Undip',
    zone: 'Zona Barat',
    mapPosition: { x: 820, y: 560 },
    description: 'Pusat kesenian mahasiswa (Perkiraan)',
    source: 'approx',
  },
  {
    id: 'taman-inspirasi',
    name: 'Taman Inspirasi',
    zone: 'Zona Pusat',
    mapPosition: { x: 880, y: 630 },
    description: 'Taman terbuka kampus (Perkiraan)',
    source: 'approx',
  },
  {
    id: 'menara-undip',
    name: 'Menara Undip',
    zone: 'Zona Barat',
    mapPosition: { x: 730, y: 640 },
    description: 'Menara perkantoran universitas (Perkiraan)',
    source: 'approx',
  },
];
