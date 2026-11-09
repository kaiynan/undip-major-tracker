// =============================================================================
// undip-major-matcher — Database Katalog Beasiswa Resmi & Terverifikasi
// =============================================================================
// Aturan ketat:
// 1. Setiap beasiswa memiliki penyelenggara jelas, link resmi, sourceUrl, dan retrievedAt.
// 2. Tidak ada angka nominal rupiah rekaan/fiktif (Guard 1/Guard 3).
// 3. Status 'official' untuk program yang memiliki dokumen/portal rujukan resmi.
// =============================================================================

export type KategoriPenyelenggara = 'Pemerintah' | 'Yayasan' | 'Perusahaan' | 'Kampus';
export type JenjangBeasiswa = 'S1' | 'D4';

export interface Scholarship {
  id: string;
  nama: string;
  penyelenggara: string;
  kategoriPenyelenggara: KategoriPenyelenggara;
  jenjang: JenjangBeasiswa[];
  jenisBantuan: string;
  syaratUmum: string[];
  periodeBuka: string;
  linkResmi: string;
  sourceUrl: string;
  retrievedAt: string;
  status: 'official' | 'pending';
  coverageType: 'biaya_kuliah' | 'uang_saku' | 'penuh';
}

export const scholarshipsData: Scholarship[] = [
  {
    id: 'kip-kuliah',
    nama: 'KIP-Kuliah (Kartu Indonesia Pintar Kuliah)',
    penyelenggara: 'Puslapdik Kemdiktisaintek / Kemendikbudristek',
    kategoriPenyelenggara: 'Pemerintah',
    jenjang: ['S1', 'D4'],
    jenisBantuan: 'Pembebasan biaya kuliah (UKT) penuh ke perguruan tinggi dan bantuan biaya hidup bulanan',
    syaratUmum: [
      'Lulusan SMA/SMK/MA/sederajat tahun berjalan atau maksimal 2 tahun sebelumnya.',
      'Lolos seleksi masuk perguruan tinggi negeri (SNBP, SNBT, atau Mandiri) pada program studi terakreditasi.',
      'Memiliki keterbatasan ekonomi yang dibuktikan dengan kepemilikan KIP SMA, KKS, terdata di DTKS/P3KE, atau Surat Keterangan Tidak Mampu (SKTM) yang valid.',
      'Memiliki potensi akademik baik dan belum pernah menerima bantuan pendidikan sejenis.',
    ],
    periodeBuka: 'Februari – Juli (menyesuaikan jadwal SNBP, SNBT, dan Seleksi Mandiri; dapat berubah)',
    linkResmi: 'https://kip-kuliah.kemdikbud.go.id/',
    sourceUrl: 'https://kip-kuliah.kemdikbud.go.id/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'penuh',
  },
  {
    id: 'beasiswa-unggulan',
    nama: 'Beasiswa Unggulan Masyarakat Berprestasi',
    penyelenggara: 'Kemendikdasmen / Kemdiktisaintek RI',
    kategoriPenyelenggara: 'Pemerintah',
    jenjang: ['S1'],
    jenisBantuan: 'Bantuan biaya pendidikan (UKT), bantuan biaya hidup, dan biaya buku penunjang studi',
    syaratUmum: [
      'Mahasiswa baru yang diterima di PTN terakreditasi minimal B/Baik Sekali atau on-going maksimal semester 3.',
      'Memiliki sertifikat prestasi kejuaraan/kompetisi minimal tingkat nasional atau internasional.',
      'Memiliki sertifikat Uji Kemahiran Berbahasa Indonesia (UKBI) dengan predikat yang dipersyaratkan.',
      'Menulis esai komitmen kebangsaan dan kontribusi bagi Indonesia pasca kelulusan.',
      'Tidak sedang menerima beasiswa lain yang bersumber dari APBN atau APBD.',
    ],
    periodeBuka: 'Juli – Agustus (dapat berubah sesuai pengumuman resmi kementerian)',
    linkResmi: 'https://beasiswaunggulan.kemdikbud.go.id/',
    sourceUrl: 'https://beasiswaunggulan.kemdikbud.go.id/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'penuh',
  },
  {
    id: 'beasiswa-bi-genbi',
    nama: 'Beasiswa Bank Indonesia & Komunitas GenBI',
    penyelenggara: 'Bank Indonesia',
    kategoriPenyelenggara: 'Pemerintah',
    jenjang: ['S1', 'D4'],
    jenisBantuan: 'Tunjangan biaya pendidikan per semester serta pembinaan kepemimpinan berkala melalui wadah Generasi Baru Indonesia (GenBI)',
    syaratUmum: [
      'Mahasiswa aktif jenjang S1/D4 di PTN mitra Bank Indonesia (termasuk UNDIP) yang telah menyelesaikan minimal 40 SKS.',
      'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4.00).',
      'Berasal dari keluarga prasejahtera atau mahasiswa berprestasi dengan surat rekomendasi kampus.',
      'Bersedia aktif dan berkontribusi nyata dalam kegiatan sosial dan kepemimpinan komunitas GenBI.',
      'Tidak sedang menerima beasiswa atau ikatan dinas dari pihak lain.',
    ],
    periodeBuka: 'Februari – Maret (dapat berubah sesuai koordinasi Ditmawa UNDIP dan KPw BI)',
    linkResmi: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/generasi-baru-indonesia.aspx',
    sourceUrl: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/generasi-baru-indonesia.aspx',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'uang_saku',
  },
  {
    id: 'beasiswa-baznas',
    nama: 'Beasiswa Cendekia BAZNAS (BCB)',
    penyelenggara: 'Badan Amil Zakat Nasional (BAZNAS) RI',
    kategoriPenyelenggara: 'Pemerintah',
    jenjang: ['S1', 'D4'],
    jenisBantuan: 'Subsidi bantuan biaya kuliah/UKT per semester hingga semester 8 dan pembinaan pengembangan diri terstruktur',
    syaratUmum: [
      'Mahasiswa aktif semester 5 di perguruan tinggi mitra BAZNAS (termasuk Universitas Diponegoro).',
      'Termasuk ke dalam kategori mustahik (asnaf zakat) atau keluarga prasejahtera.',
      'Memiliki IPK minimal 3.00 pada semester berjalan.',
      'Mendapatkan surat rekomendasi dari tokoh masyarakat atau pimpinan fakultas/kampus.',
      'Berkomitmen mengikuti seluruh agenda pembinaan rutin bersama mentor BAZNAS.',
    ],
    periodeBuka: 'Juni – Juli (dapat berubah sesuai jadwal seleksi nasional BAZNAS)',
    linkResmi: 'https://beasiswa.baznas.go.id/',
    sourceUrl: 'https://beasiswa.baznas.go.id/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'biaya_kuliah',
  },
  {
    id: 'beasiswa-tanoto',
    nama: 'Program TELADAN Tanoto Foundation',
    penyelenggara: 'Tanoto Foundation',
    kategoriPenyelenggara: 'Yayasan',
    jenjang: ['S1'],
    jenisBantuan: 'Biaya kuliah (UKT) penuh yang dibayarkan langsung ke kampus, tunjangan hidup bulanan, dan program kepemimpinan terstruktur hingga semester 8',
    syaratUmum: [
      'Warga Negara Indonesia (WNI) yang terdaftar sebagai mahasiswa baru reguler semester 1 di universitas mitra (termasuk UNDIP).',
      'Memiliki prestasi akademik baik dengan nilai rapor SMA/SMK semester 1–5 rata-rata konsisten tinggi.',
      'Memiliki jiwa kepemimpinan, kepedulian sosial, dan aktif dalam kegiatan ekstrakurikuler/organisasi.',
      'Berkomitmen mengikuti seluruh jenjang pelatihan kepemimpinan Tanoto Foundation.',
      'Tidak sedang menerima beasiswa dari institusi lain.',
    ],
    periodeBuka: 'Agustus – Oktober (khusus mahasiswa baru semester 1; dapat berubah)',
    linkResmi: 'https://www.tanotofoundation.org/id/teladan/',
    sourceUrl: 'https://www.tanotofoundation.org/id/teladan/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'penuh',
  },
  {
    id: 'djarum-beasiswa-plus',
    nama: 'Djarum Beasiswa Plus',
    penyelenggara: 'Djarum Foundation',
    kategoriPenyelenggara: 'Yayasan',
    jenjang: ['S1', 'D4'],
    jenisBantuan: 'Dana beasiswa berkala selama 1 tahun dan program pelatihan soft skills (Character Building, Leadership Development, Nation Building)',
    syaratUmum: [
      'Mahasiswa aktif jenjang S1 atau D4 yang sedang menempuh semester 4 di PTN mitra (termasuk UNDIP).',
      'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 pada akhir semester 3.',
      'Aktif mengikuti organisasi kemahasiswaan intra maupun ekstra kampus.',
      'Tidak sedang menerima beasiswa dari instansi, lembaga, atau korporasi lain.',
      'Lulus serangkaian seleksi berkas, tes tertulis online, dan wawancara personal.',
    ],
    periodeBuka: 'Maret – Mei (dapat berubah sesuai kalender tahunan Djarum Foundation)',
    linkResmi: 'https://djarumbeasiswaplus.org/',
    sourceUrl: 'https://djarumbeasiswaplus.org/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'uang_saku',
  },
  {
    id: 'beasiswa-pertamina-sobat-bumi',
    nama: 'Beasiswa Sobat Bumi Pertamina Foundation',
    penyelenggara: 'Pertamina Foundation',
    kategoriPenyelenggara: 'Yayasan',
    jenjang: ['S1'],
    jenisBantuan: 'Bantuan biaya kuliah (UKT), bantuan biaya hidup bulanan, serta dana stimulus proyek inisiatif ramah lingkungan (Aksi Sobat Bumi)',
    syaratUmum: [
      'Mahasiswa aktif program S1 reguler minimal semester 2 dan maksimal semester 6 di perguruan tinggi mitra (termasuk UNDIP).',
      'Memiliki IPK minimal 3.00.',
      'Memiliki kepedulian nyata terhadap pelestarian lingkungan hidup dan pemanfaatan energi terbarukan.',
      'Menulis esai rencana aksi lingkungan dan komitmen sustainability.',
      'Tidak sedang menerima beasiswa dari instansi atau korporasi lain.',
    ],
    periodeBuka: 'Februari – April (dapat berubah sesuai kalender Pertamina Foundation)',
    linkResmi: 'https://pertaminafoundation.org/',
    sourceUrl: 'https://pertaminafoundation.org/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'penuh',
  },
  {
    id: 'paragon-scholarship',
    nama: 'Paragon Scholarship Program (PSP)',
    penyelenggara: 'PT Paragon Technology and Innovation (ParagonCorp)',
    kategoriPenyelenggara: 'Perusahaan',
    jenjang: ['S1', 'D4'],
    jenisBantuan: 'Bantuan dana pendidikan/UKT, tunjangan saku bulanan, program kepemimpinan berjenjang, dan peluang jejaring industri/magang di ParagonCorp',
    syaratUmum: [
      'Mahasiswa aktif jenjang S1/D4 semester 3 atau 5 di universitas mitra Paragon (termasuk UNDIP).',
      'Memiliki IPK minimal 3.00.',
      'Memenuhi salah satu kategori: Kategori Prestasi, Kategori Pemberdayaan, atau Kategori Tugas Akhir.',
      'Bersedia mengikuti pembinaan pengembangan diri dan kepemimpinan secara berkala.',
      'Tidak terikat ikatan dinas yang membatasi keterlibatan magang industri.',
    ],
    periodeBuka: 'Juli – September (dapat berubah sesuai pengumuman resmi ParagonCorp)',
    linkResmi: 'https://www.paragon-innovation.com/',
    sourceUrl: 'https://www.paragon-innovation.com/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'penuh',
  },
  {
    id: 'beasiswa-internal-undip',
    nama: 'Bantuan Biaya Pendidikan & Beasiswa Internal UNDIP',
    penyelenggara: 'Universitas Diponegoro (Ditmawa / Ikatan Alumni Bakti UNDIP)',
    kategoriPenyelenggara: 'Kampus',
    jenjang: ['S1', 'D4'],
    jenisBantuan: 'Keringanan/pembebasan tarif UKT, bantuan biaya pendidikan melalui dana alumni, dan beasiswa prestasi mahasiswa berprestasi',
    syaratUmum: [
      'Mahasiswa aktif Universitas Diponegoro jenjang Sarjana (S1) atau Sarjana Terapan (D4).',
      'Mengalami kendala finansial mendesak (seperti penurunan kemampuan ekonomi orang tua) atau memiliki prestasi unggul kejuaraan membawa nama UNDIP.',
      'Mengajukan permohonan resmi secara berkala melalui portal SSO (Single Sign-On) Kemahasiswaan UNDIP.',
      'Melampirkan dokumen pembuktian sah dan telah diverifikasi oleh bagian kemahasiswaan fakultas/sekolah masing-masing.',
    ],
    periodeBuka: 'Setiap awal semester menjelang batas akhir pembayaran UKT (Januari–Februari & Juli–Agustus; dapat berubah)',
    linkResmi: 'https://bak.undip.ac.id/',
    sourceUrl: 'https://bak.undip.ac.id/',
    retrievedAt: '2026-11-09',
    status: 'official',
    coverageType: 'biaya_kuliah',
  },
];

export function getAllScholarships(): Scholarship[] {
  return scholarshipsData;
}

export function getScholarshipById(id: string): Scholarship | undefined {
  return scholarshipsData.find((s) => s.id === id);
}

export function getScholarshipsCount(): number {
  return scholarshipsData.length;
}
