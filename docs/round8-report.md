# Laporan Implementasi Prompt F (Round 8): Favorit & Bandingkan, Detail Prodi, Beasiswa Lengkap, Pratinjau Tautan

**Aplikasi:** UNDIP Major Matcher (Roadshow Sedulur Serang Diponegoro 2027)  
**Versi Target:** Next.js 16.4.5 (Turbopack, Static Export `output: "export"`), Tailwind CSS v4, React 19  
**Tanggal Pengujian:** 10 November 2026  
**Status Produksi:** ✅ Lolos Verifikasi Penuh (Zero Error, Zero Warning, 37/37 E2E Assertions Passed)

---

## 1. Ringkasan Eksekutif & Arsitektur Implementasi

Prompt F (Round 8) berhasil diselesaikan secara bertahap melalui 5 komit atomik berurutan tanpa mengubah identitas pixel-art / golden-hour kampus dan tanpa melanggar pembekuan instrumen evaluasi HMIM (36 butir kuisioner, model skoring, kuota TA 2026/2027, dan tarif UKT tetap beku).

### 1.1 Favorit Prodi (Section 1)
- **Komponen & State:** Dikelola melalui `src/contexts/FavoritesContext.tsx` dengan kunci penyimpanan `undip_matcher_favorites_v1`.
- **Kapasitas & Batas:** Dibatasi maksimal 12 program studi dengan proteksi de-duplikasi dan sanitasi otomatis terhadap ID kadaluarsa/tidak valid.
- **Toleransi Penyimpanan Terblokir (Privacy / Private Browsing):** Dilengkapi penanganan `try/catch` komprehensif. Jika `localStorage` diblokir oleh browser pengguna, sistem beralih otomatis ke *in-memory state* dan menampilkan notifikasi ramah: *"Penyimpanan browser dinonaktifkan. Pilihan favorit Anda tersimpan sementara selama sesi ini aktif."*
- **Aksesibilitas & UI:** Tombol hati berukuran target interaktif minimal 44×44 px dengan atribut `aria-pressed`, label dinamis *"Simpan ke Favorit"* / *"Hapus dari Favorit"*, serta audio blip retro. Terpasang pada kartu hasil (`AllMajorTierList.tsx`, `FacultyTierList.tsx`), direktori (`ProgramDirectoryClient.tsx`), dan detail jurusan (`ProgramDetailContent.tsx`).
- **Halaman `/favorit`:** Menampilkan daftar prodi favorit, tombol hapus per item, tombol komparasi (aktif jika 2–3 prodi dipilih), tautan kembali ke hasil, serta panduan state kosong (*empty state guidance*).
- **Navbar Menu Integration:** Menambahkan pintasan *"Favoritku (n)"* dengan badge angka dinamis pada laci menu navigasi (grup *"Lainnya"*), **tanpa menyentuh atau menggeser top bar**, sehingga menjaga integritas subpixel top bar anti-tabrakan.

### 1.2 Bandingkan Prodi (Section 2)
- **Rute URL:** `/bandingkan?ids=a,b,c` dibungkus `<Suspense>` untuk `useSearchParams()`. Mendukung 2 hingga 3 program studi (termasuk program studi PSDKU).
- **Penanganan Input Tidak Valid:** Jika ID kurang dari 2 atau tidak terdaftar, halaman menyajikan pesan peringatan yang ramah dan mengarahkan pengguna kembali ke direktori atau halaman favorit.
- **Matriks Komparasi Obyektif:** Menampilkan perbandingan berdampingan:
  1. Fakultas dan Departemen Induk
  2. Jenjang Pendidikan (S1 / D4) dan Lokasi Kampus (Tembalang / Kampus PSDKU)
  3. Struktur UKT Golongan 1 dan Golongan Tertinggi (dari SK Rektor TA 2026/2027)
  4. Total Daya Tampung dan Distribusi Kuota per Jalur (SNBP, SNBT, Mandiri)
  5. Skor Keselarasan HMIM & Tier (hanya jika pengguna telah mengisi kuisioner; jika belum, menampilkan panduan *"Belum ada hasil — ikuti tes"*)
  6. Akreditasi Resmi BAN-PT / LAM
  7. Fokus Mata Kuliah Khas & Prospek Karier Lulusan
- **Responsivitas & Anti-Overflow:** Pada layar ponsel (390×844 px), kolom kriteria bersifat *sticky* di sebelah kiri dengan area *scroll* horizontal terisolasi di dalam kontainer tabel (`overflow-x-auto`), menjamin **0 px horizontal overflow** pada tingkat dokumen `<html>`/`<body>`. Pada layar desktop (1440×900 px), tersaji dalam tabel 3 kolom yang lapang.
- **Fitur Ekspor & Berbagi:** Tombol *"Salin Tautan"* dengan notifikasi clipboard, tombol *"Bagikan"* (menggunakan Web Share API dengan fallback clipboard), dan *print stylesheet* `@media print` yang mengoptimalkan tata letak ke 1 halaman A4 rapi tanpa elemen navigasi.
- **Pintasan dari Detail Prodi:** Tombol *"Bandingkan dengan..."* pada `/program/[id]` membuka modal pencarian cepat untuk memilih prodi pembanding secara instan.

### 1.3 Detail Prodi yang Lebih Kaya & Terverifikasi (Section 3)
- **Database Terstruktur:** File baru `src/data/programDetails.ts` dan modul per fakultas (`src/data/program-details/*.ts`), memetakan 70 program studi secara modular tanpa mengubah skoring `programs.ts`.
- **Disiplin Bukti (Evidence Rule):** Setiap kelompok atribut memuat `sourceUrl`, `retrievedAt`, dan `status: 'official' | 'pending'`. Tidak ada klaim promosi, tidak ada angka gaji khayalan (*no salary claims*), dan tidak ada persentase serapan kerja fiktif.
- **UI `/program/[id]`:** Komponen `<ProgramRichDetails />` menyajikan akordeon interaktif yang terbuka secara default di desktop dan tertutup rapi di ponsel. Setiap bagian menampilkan baris atribusi rujukan: `Sumber: <hostname>, diakses <tanggal>` dan badge *Resmi*.

### 1.4 Halaman Beasiswa Lengkap (Section 4)
- **Katalog Terpadu:** Rute `/langkah-selanjutnya/beasiswa` mempertahankan seluruh informasi KIP-Kuliah yang sudah ada, diperkaya dengan katalog terverifikasi `scholarshipsData` (`src/data/scholarships.ts`) berisi 9 program beasiswa resmi pemerintah, yayasan filantropi, korporasi, dan internal UNDIP.
- **Filter Chips & Live Search:** Filter multi-kategori (Semua, Pemerintah, Yayasan, Perusahaan, Kampus), jenis bantuan (Semua, Biaya Kuliah, Uang Saku), serta pencarian nama langsung (*live search*).
- **Blok Edukasi:** *"Tips Sukses Persiapan Beasiswa Kuliah"* menyajikan 4 tips actionable berdasarkan regulasi resmi (persiapan SKTM, stabilitas IPK ≥ 3.00, portofolio organisasi, dan aturan anti-beasiswa ganda).
- **Cross-links:** Halaman Biaya UKT (`/langkah-selanjutnya/biaya-ukt`) dan kartu hub (`LangkahSelanjutnyaHub.tsx`) secara dinamis menampilkan tautan silang *"Mencari bantuan biaya? Lihat 9 beasiswa terdata"*.

### 1.5 Pratinjau Tautan Open Graph & Twitter Cards (Section 5)
- **Generator Statis (`scripts/gen-og.js`):** Menggunakan Playwright Chromium/Chrome untuk merender kartu HTML 1200×630 berlatar *golden-hour* dan mengekspor 6 gambar PNG ke `public/og/`:
  - `og-default.png` (Home / Beranda) — 189 KB
  - `og-results.png` (Hasil Rekomendasi) — 193 KB
  - `og-program-studi.png` (Direktori Program Studi) — 192 KB
  - `og-langkah-selanjutnya.png` (Langkah Selanjutnya: UKT & Beasiswa) — 194 KB
  - `og-bandingkan.png` (Komparasi Multi-Jurusan) — 194 KB
  - `og-favorit.png` (Program Studi Favorit) — 191 KB
  *(Seluruh file di bawah batas maksimal 300 KB)*.
- **Metadata Lengkap:** Dikonfigurasi dengan `metadataBase: new URL(SITE_URL)` pada `src/app/layout.tsx` serta metadata spesifik di setiap sub-rute dan dynamic route `/program/[id]`.
- **Theme Color:** `<meta name="theme-color" content="#002060">` terpasang valid di seluruh halaman hasil ekspor HTML.

### 1.6 Konsultasi Kakak SERADIP (Section 5B)
- **Arsitektur:** Terisolasi dalam `src/config/contact.ts` dan `<SeradipContactButton />`.
- **Graceful Degradation:** Karena nomor kontak panitia SERADIP belum diserahkan, `isContactReady()` mengembalikan `false` dan seluruh penempatan tombol konsultasi (di `/results`, `/bandingkan`, `/favorit`, dan `/program/[id]`) merender `null` tanpa merusak tata letak atau meninggalkan tautan kosong. Begitu nomor diisi di `.env.local` (`NEXT_PUBLIC_SERADIP_WA`), tombol langsung aktif dengan *deep link* WhatsApp dan pesan terformat otomatis.

---

## 2. Tabel Cakupan Data Program Studi (Data Coverage)

Status kelengkapan data rujukan resmi pada 70 program studi (65 program studi kampus utama Semarang + 5 program studi PSDKU) di 12 Fakultas/Sekolah Universitas Diponegoro:

| Fakultas / Sekolah | Singkatan | Jumlah Prodi | Ringkasan | MK Khas | Kompetensi | Karier | Akreditasi | Laman Resmi | Cakupan |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Fakultas Teknik | FT | 14 | 14/14 | 14/14 | 14/14 | 14/14 | 14/14 | 14/14 | **100%** |
| Fakultas Sains dan Matematika | FSM | 8 | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 | **100%** |
| Fakultas Kedokteran | FK | 5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **100%** |
| Fakultas Ekonomika dan Bisnis | FEB | 5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **100%** |
| Fakultas Hukum | FH | 1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | **100%** |
| Fakultas Ilmu Sosial dan Ilmu Politik | FISIP | 6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | **100%** |
| Fakultas Ilmu Budaya | FIB | 6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | **100%** |
| Fakultas Kesehatan Masyarakat | FKM | 2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | **100%** |
| Fakultas Perikanan dan Ilmu Kelautan | FPIK | 6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | **100%** |
| Fakultas Peternakan dan Pertanian | FPP | 5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **100%** |
| Fakultas Psikologi | FPsi | 1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | **100%** |
| Sekolah Vokasi | SV | 11 | 11/11 | 11/11 | 11/11 | 11/11 | 11/11 | 11/11 | **100%** |
| **TOTAL KESELURUHAN** | **12 Unit** | **70 Prodi** | **70/70** | **70/70** | **70/70** | **70/70** | **70/70** | **70/70** | **100.0%** |

*Catatan:* Semua 70 program studi memiliki URL rujukan resmi, tanggal akses verifikasi (`2026-11-09`), dan status `official`. Tidak ditemukan klaim gaji nominal atau garansi kerja.

---

## 3. Tabel Katalog Beasiswa Resmi & Terverifikasi

| Nama Program Beasiswa | Penyelenggara | Kategori | Jenjang | Cakupan Bantuan | Host Sumber Rujukan Resmi |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **KIP-Kuliah (Kartu Indonesia Pintar Kuliah)** | Puslapdik Kemdiktisaintek / Kemdikbudristek | Pemerintah | S1, D4 | Pembebasan UKT Penuh & Biaya Hidup Bulanan | [kip-kuliah.kemdikbud.go.id](https://kip-kuliah.kemdikbud.go.id/) |
| **Beasiswa Unggulan Masyarakat Berprestasi** | Kemendikdasmen / Kemdiktisaintek RI | Pemerintah | S1 | UKT Penuh, Biaya Hidup & Buku Penunjang | [beasiswaunggulan.kemdikbud.go.id](https://beasiswaunggulan.kemdikbud.go.id/) |
| **Beasiswa Bank Indonesia & Komunitas GenBI** | Bank Indonesia | Pemerintah | S1, D4 | Tunjangan Studi per Semester & Pembinaan Kepemimpinan | [bi.go.id](https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/generasi-baru-indonesia.aspx) |
| **Beasiswa Cendekia BAZNAS (BCB)** | Badan Amil Zakat Nasional (BAZNAS) RI | Pemerintah | S1, D4 | Subsidi Bantuan UKT & Pembinaan Rutin | [beasiswa.baznas.go.id](https://beasiswa.baznas.go.id/) |
| **Program TELADAN Tanoto Foundation** | Tanoto Foundation | Yayasan | S1 | UKT Penuh Langsung ke Kampus, Uang Saku & Leadership | [tanotofoundation.org](https://www.tanotofoundation.org/id/teladan/) |
| **Djarum Beasiswa Plus** | Djarum Foundation | Yayasan | S1, D4 | Dana Beasiswa 1 Tahun & Pelatihan Soft Skills | [djarumbeasiswaplus.org](https://djarumbeasiswaplus.org/) |
| **Beasiswa Sobat Bumi Pertamina** | Pertamina Foundation | Yayasan | S1 | Bantuan UKT, Biaya Hidup & Stimulus Aksi Lingkungan | [pertaminafoundation.org](https://pertaminafoundation.org/) |
| **Paragon Scholarship Program (PSP)** | PT Paragon Technology and Innovation | Perusahaan | S1, D4 | Bantuan Dana Pendidikan/UKT, Uang Saku & Magang | [paragon-innovation.com](https://www.paragon-innovation.com/) |
| **Bantuan Biaya Pendidikan & Internal UNDIP** | Universitas Diponegoro (Ditmawa / Bakti Alumni) | Kampus | S1, D4 | Keringanan/Pembebasan UKT & Bantuan Alumni | [bak.undip.ac.id](https://bak.undip.ac.id/) |

---

## 4. Matriks Pengujian Produksi (Production E2E Matrix)

Pengujian dilakukan langsung pada hasil kompilasi statis (`output: "export"`) yang dilayani oleh `scripts/serve-out.js` pada port `3225` menggunakan browser Chromium/Chrome via Playwright:

| No | Modul / Skenario Uji | Viewport / Input | Mode Interaksi | Hasil Pengujian | Catatan Verifikasi |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | **Favorit - Penyimpanan Berkelanjutan** | 1440×900 px | Mouse / Click | ✅ **PASS** | 2 prodi disimpan di `/program-studi`, tersimpan di `localStorage` `undip_matcher_favorites_v1`. |
| 2 | **Favorit - Persistensi Pasca Reload** | 1440×900 px | Reload | ✅ **PASS** | Halaman `/favorit` dimuat ulang; 2 prodi tetap tersimpan utuh. |
| 3 | **Favorit - Fallback Storage Terblokir** | 1440×900 px | Script Error Injection | ✅ **PASS** | Ketika `localStorage` melempar *Access Denied*, muncul alert informatif & fallback in-memory aktif. |
| 4 | **Bandingkan - Mobile Layout & Anti-Overflow** | 390×844 px | Touch Emulation | ✅ **PASS** | `scrollWidth` dokumen = `clientWidth` (390 px). Nol horizontal page overflow. |
| 5 | **Bandingkan - Sticky Column & Rincian Kuota** | 390×844 px & 1440×900 px | Touch & Mouse | ✅ **PASS** | Header 3 prodi, baris Fakultas, Lokasi Kampus, UKT, dan Kuota tampil presisi. |
| 6 | **Bandingkan - Salin Tautan & Berbagi** | 1440×900 px | Mouse / Click | ✅ **PASS** | Tombol *"Salin Tautan"* menyalin URL ke clipboard; Web Share siap pakai. |
| 7 | **Bandingkan - ID Tidak Valid** | 1440×900 px | URL Query | ✅ **PASS** | URL `/bandingkan?ids=prodi-palsu,prodi-ngasal` menampilkan pesan ramah dan daftar ID yang keliru. |
| 8 | **Program Detail - Akordeon Terbuka/Tertutup** | 1440×900 & 390×844 px | Responsive | ✅ **PASS** | Terbuka di desktop, terlipat rapi di ponsel dengan target sentuh min 44 px. |
| 9 | **Program Detail - Bukti Atribusi & Keamanan URL** | 1440×900 px | Inspection | ✅ **PASS** | Semua link eksternal memiliki atribut `rel="noopener noreferrer"`. |
| 10 | **Program Detail - Modal Picker Pembanding** | 1440×900 px | Modal Trigger | ✅ **PASS** | Klik *"Bandingkan dengan..."* membuka modal pencarian 70 jurusan tanpa error. |
| 11 | **Program Detail - Notifikasi Khusus PSDKU** | 1440×900 px | Routing (`psdku-pwk-pekalongan`) | ✅ **PASS** | Banner informasi kampus di luar Tembalang muncul jelas. |
| 12 | **Beasiswa - Filter Chips Penyelenggara** | 1440×900 px | Mouse / Click | ✅ **PASS** | Filter *"Yayasan"* menyaring hanya Tanoto, Djarum, dan Pertamina; beasiswa BI tersembunyi. |
| 13 | **Beasiswa - Pencarian Live Nama/Mitra** | 1440×900 px | Keyboard Input | ✅ **PASS** | Ketik *"Djarum"* langsung mengisolasi kartu Djarum Beasiswa Plus secara reaktif. |
| 14 | **Beasiswa - Blok Tips & Tautan Balik UKT** | 1440×900 px | Inspection | ✅ **PASS** | Blok *"Tips Sukses Persiapan Beasiswa"* aktif; cross-link pada UKT page berfungsi. |
| 15 | **Open Graph - Dimensi & Ukuran File** | 1200×630 px | Asset Verification | ✅ **PASS** | 6 file PNG berada di kisaran 189–194 KB (< 300 KB) dengan font raster tajam. |
| 16 | **Integritas Konsol & Error Global** | Semua Rute | Automated Listener | ✅ **PASS** | **0 console errors, 0 unhandled rejections** di seluruh skenario pengujian. |

---

## 5. Pratinjau Tautan Sosial & URL Validator

Seluruh halaman telah dilengkapi meta tag absolut sesuai basis `SITE_URL` (`https://undipmajormatcher.com`):

### 5.1 URL Uji Validator Sosial:
- **Facebook Sharing Debugger:**  
  `https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fundipmajormatcher.com%2F`
- **Twitter Card Validator:**  
  `https://cards-dev.twitter.com/validator` (atau masukkan `https://undipmajormatcher.com/results`)
- **LinkedIn Post Inspector:**  
  `https://www.linkedin.com/post-inspector/inspect/https:%2F%2Fundipmajormatcher.com%2Fprogram-studi`
- **WhatsApp Link Preview Test:**  
  Kirim tautan `https://undipmajormatcher.com/bandingkan` atau `https://undipmajormatcher.com/langkah-selanjutnya/beasiswa` ke obrolan WhatsApp untuk memverifikasi pratinjau kartu judul, deskripsi, dan banner OG resolusi tinggi.

---

## 6. Riwayat Komit Atomik (Git History)

1. `4c4c319` — `feat(favorites): implement persistent favorites management, UI buttons, and favorites page`
2. `7997806` — `feat(compare): add multi-program comparison page with share, print, and modal picker`
3. `92a5477` — `feat(program-details): add rich verified curriculum, accreditation, and career details for all 70 programs`
4. `3b72120` — `feat(scholarships): expand comprehensive scholarship catalogue with verified sources and filter chips`
5. `c554b8b` — `feat(og-social): add static 1200x630 OG image generation, route social metadata, and SERADIP consultation button`
6. `51da1ac` — `test(round8): add automated production E2E suite covering favorites, compare, rich details, and scholarships`
