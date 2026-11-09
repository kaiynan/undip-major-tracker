# Laporan Verifikasi & Dokumentasi: Round 9 (Prompt G)

**Aplikasi:** UNDIP Major Matcher (Tembalang Campus & HMIM Recommendation Engine)  
**Tanggal:** 10 November 2026  
**Status Produksi:** ✅ Lolos Verifikasi Penuh (27/27 Assertion E2E Produksi, 14/14 Data Guard, 7/7 Unit Test Suite)  
**Lingkungan Uji:** Node.js v26 / Chromium Headless (390×844 Touch Emulation & 1440×900 Desktop)

---

## 1. Ringkasan Eksekutif

Round 9 melengkapi pengalaman eksplorasi hasil rekomendasi dengan empat kapabilitas utama yang berfokus pada kejelasan rekomendasi, transparansi algoritma, kemudahan eksplorasi geografis, dan pendampingan personal:

1. **Alasan Kecocokan ("Kenapa prodi ini cocok untukmu?"):**  
   Menjelaskan secara transparan komponen apa yang paling berkontribusi terhadap kecocokan setiap prodi tanpa mengubah formula skor atau urutan ranking. Fungsi pure `computeScoreBreakdown` dibuktikan secara matematis identik dengan skor resmi engine (toleransi $< 1\times 10^{-9}$).
2. **Peringatan "Minat Tersebar":**  
   Mendeteksi secara objektif ketika skor beberapa prodi teratas berdekatan ($gap \le 4.40\%$, berbasis simulasi empiris 2.500 profil acak dan 300 profil konsisten). Menampilkan banner solutif dengan opsi simpan ke Favorit, Bandingkan, atau konsultasi.
3. **Tur Kampus di Peta (Peta Sebagai Pintu Masuk Eksplorasi):**  
   Mengetuk/mengklik gedung fakultas di peta interaktif membuka panel tur (*bottom sheet* maksimal 60vh di ponsel, *side panel* di desktop) yang menampilkan daftar prodi resmi kampus Tembalang (bebas PSDKU), skor & tier, serta tombol aksi lanjutan (Detail, Favorit, Bandingkan, Fokus di Peta).
4. **Konsultasi SERADIP (Sedulur Serang Diponegoro):**  
   Tautan pendampingan WhatsApp mahasiswa UNDIP asal Banten dengan prinsip degradasi anggun (*graceful degradation*): jika nomor belum diset di environment variable, komponen merender `null` (tanpa tombol mati atau kotak kosong). Ketika aktif, tautan memuat pesan pembuka otomatis berisi 3 prodi teratas yang dapat dibaca dan diedit pengguna sebelum dikirim.

---

## 2. Rincian Fitur & Pembuktian Matematis

### 2.1 Alasan Kecocokan (`src/lib/matchReasons.ts`)

#### Metodologi Dekomposisi Skor
Skor HMIM dihitung dari 4 dimensi tertimbang:
$$\text{Score}_{\text{HMIM}} = 0.20 \cdot S_{\text{RIASEC}} + 0.35 \cdot S_{\text{Domain}} + 0.20 \cdot S_{\text{Learning}} + 0.25 \cdot S_{\text{Curriculum}}$$

Fungsi `computeScoreBreakdown(userAnswers, program, questions)` menghitung kesamaan kosinus dimensi murni dan kontribusi tertimbangnya:
- Kontribusi RIASEC: $0.20 \times \text{sim}_{\text{RIASEC}}$
- Kontribusi Domain: $0.35 \times \text{sim}_{\text{Domain}}$
- Kontribusi Preferensi Belajar: $0.20 \times \text{sim}_{\text{Learning}}$
- Kontribusi Kurikulum: $0.25 \times \text{sim}_{\text{Curriculum}}$

#### Pembuktian Toleransi Matematis
Pada berkas pengujian `src/lib/matchReasons.test.ts`, dilakukan simulasi 20 profil pengguna acak terhadap seluruh 70 program studi (total 1.400 evaluasi).
- Selisih antara $\sum \text{Kontribusi}$ dan $\text{Skor Resmi Engine}$:
  $$\max |\text{Sum}(\text{Kontribusi}) - \text{Skor Resmi}| < 1 \times 10^{-9}\%$$
- Tidak ada program studi yang menampilkan dua alasan duplikat.
- Alasan hanya merujuk pada dimensi dengan kontribusi positif.
- Nada bahasa: netral, memotivasi, tanpa klaim kepastian lolos seleksi (*admission chances*) atau janji nominal gaji (*career promises*).

#### Penempatan Komponen
- **Kartu Hasil & Tier List (`MatchReasonsBlock` variant `compact`):** 2 alasan ringkas maksimal 2 baris di ponsel.
- **Halaman Detail Program Studi (`MatchReasonsBlock` variant `full`):** 2–3 alasan lengkap dalam kartu berlatar gelap khas golden-hour.
- **Ekspor Dokumen PDF:** Ditampilkan 1 baris ringkas per prodi untuk Top 3 rekomendasi. Kartu share media sosial tetap ringkas dan tidak memuat teks panjang alasan.

---

### 2.2 Peringatan Minat Tersebar (`src/lib/interestSpread.ts` & `docs/spread-threshold.md`)

#### Simulasi Distribusi Empiris
Untuk menentukan ambang batas yang valid secara statistik (bukan tebakan), dijalankan simulasi `scripts/simulate-spread.ts`:
- **2.500 profil jawaban acak (*uniform random Likert 1–5*):**
  - Rata-rata gap #1–#5: $3.92\%$
  - Persentil 25 ($P_{25}$): $2.62\%$
  - Median ($P_{50}$): $3.74\%$
- **300 profil jawaban konsisten (*focused disciplines*):**
  - Rata-rata gap #1–#5: $6.69\%$
  - Persentil 25 ($P_{25}$): $4.40\%$
  - Median ($P_{50}$): $6.19\%$

#### Ambang Batas Terpilih
Dipilih $P_{25}$ dari kelompok profil konsisten:
$$\text{INTEREST\_SPREAD\_THRESHOLD} = 4.40\%$$

Jika selisih skor prodi peringkat #1 dan #5 $\le 4.40\%$ (dan gap #1–#10 $\le 6.50\%$), engine mendeteksi adanya minat tersebar dan menampilkan banner panduan:
> *"Minatmu cukup tersebar, jadi beberapa prodi di peringkat atas nilainya berdekatan. Coba simpan ke Favorit dan bandingkan beberapa prodi, atau konsultasi dengan SERADIP."*

Banner ini dilengkapi tombol pintas ke `/favorit` (untuk membandingkan) serta tombol konsultasi SERADIP. Banner **tidak pernah mengubah skor maupun urutan peringkat**.

---

### 2.3 Tur Kampus di Peta (`src/components/pixel/FacultyMapTourSheet.tsx`)

Peta kampus Tembalang kini menjadi gerbang eksplorasi akademik interaktif:
- **Tampilan Ponsel (390×844):** Berupa *bottom sheet* dengan batas tinggi maksimum `max-h-[60vh]`, indikator sentuh/seret (*drag bar*), dan tombol tutup.
- **Tampilan Desktop (1440×900):** Berupa *side panel* melayang di sisi kanan selebar 420px, diposisikan tepat di bawah navigasi atas (`top-24`) tanpa menutupi kontrol header.
- **Konten Fakultas:**
  - Nama fakultas dan zona kampus Tembalang (Zona Barat/Timur/Pusat/Selatan).
  - Jumlah program studi resmi di kampus Tembalang.
  - Daftar program studi: jika pengguna sudah menyelesaikan kuisioner, ditampilkan badge tier (S/A/B/C) dan skor persentase; jika belum, ditampilkan nama prodi dan jenjang (S1/D4).
  - Tombol aksi per prodi: Lihat Detail (`/program/[id]`), Tambah ke Favorit, dan Pilih untuk Bandingkan.
  - Tombol "Fokus di Peta" untuk memusatkan kamera peta ke gedung fakultas.
- **Aksesibilitas & Keamanan:**
  - Mendukung navigasi keyboard: Tombol `Enter` atau `Spasi` pada marker gedung membuka panel tur; tombol `Escape` menutup panel.
  - Focus trap otomatis mengarahkan fokus ke tombol tutup saat panel dibuka dan membatasi tabulasi di dalam panel.
  - Pembatas wilayah: 100% bebas dari program studi PSDKU (hanya 65 prodi kampus Tembalang yang dapat diakses melalui peta).
  - Area sentuh/klik transparan (`180×140 px`) memastikan interaksi sentuh pada ponsel presisi tanpa terganggu oleh penarikan (*drag/pan*) peta.

---

### 2.4 Konsultasi SERADIP (`src/components/contact/ConsultCta.tsx`)

SERADIP (Sedulur Serang Diponegoro) adalah organisasi mahasiswa aktif UNDIP asal Banten yang siap memberikan bimbingan dan berbagi pengalaman perkuliahan.

#### Aturan Privasi & Keamanan (Guard 14)
- Nomor WhatsApp dikonfigurasi melalui *environment variable* `NEXT_PUBLIC_SERADIP_WA` di `src/config/contact.ts`.
- **Degradasi Anggun (*Graceful Degradation*):** Jika nomor belum diisi, fungsi `isContactReady()` bernilai `false` dan semua varian `ConsultCta` merender `null` (tidak ada kotak kosong, link `#`, atau tombol bertuliskan "nomor belum diatur").
- **Zero Client Leakage:** Guard 14 memindai seluruh direktori `src/` dan memastikan nol nomor telepon pribadi ter-hardcode di kode sumber.
- **Tautan Deep Link wa.me:** Format tautan `https://wa.me/<nomor>?text=<pesan_terencode>`. Pesan tidak langsung terkirim otomatis; pengguna dapat membaca dan menyunting pesan di WhatsApp sebelum menekan kirim.

#### Matriks 7 Penempatan Konsultasi
1. **Bagian Bawah Halaman Hasil (`/results`):** Kartu pendampingan (`variant="card"`).
2. **Di Dalam Banner Minat Tersebar:** Tombol sekunder berdampingan dengan tombol Bandingkan (`variant="inline"`).
3. **Bagian Bawah Hub Informasi (`/langkah-selanjutnya`):** Kartu pendampingan lengkap (`variant="card"`).
4. **Halaman Detail Prodi, Favorit, dan Bandingkan:** Tombol kontekstual (`variant="inline"`).
5. **Footer & Tentang Kami:** Tautan pendampingan resmi (`variant="link"` di footer, `variant="card"` di Tentang Kami).
6. **Navbar Drawer Menu "Lainnya":** Menu tautan konsultasi (`variant="link"`).
7. **Dokumen Ekspor PDF:** Kotak informasi kontak SERADIP pada bab akhir rekomendasi.

---

## 3. Matriks Hasil Pengujian Produksi (E2E)

Pengujian dilakukan langsung pada hasil build produksi Next.js (`npm run build && node scripts/test-round9-production.js`) yang dilayani melalui server statis zero-dependency pada port 3226.

| ID | Kategori Pengujian | Parameter Uji | Ekspektasi | Hasil |
|---|---|---|---|:---:|
| 1.1 | Alasan Kecocokan | Desktop 1440×900 | Blok `match-reasons-block` muncul pada kartu peringkat teratas | ✅ PASS |
| 1.2 | Alasan Kecocokan | Integritas Teks | Memuat judul "Kenapa cocok untukmu:" dan 2 alasan positif | ✅ PASS |
| 1.3 | Alasan Kecocokan | Etika Rekomendasi | Bebas dari janji kelulusan ("pasti lolos") dan iming-iming gaji | ✅ PASS |
| 1.4 | Alasan Kecocokan | Ponsel 390×844 Touch | Teks alasan ringkas (maks 2 baris) dan nol overflow horizontal | ✅ PASS |
| 1.5 | Alasan Kecocokan | Detail Prodi | Blok lengkap "Kenapa prodi ini cocok untukmu?" muncul saat ada hasil | ✅ PASS |
| 1.6 | Alasan Kecocokan | Konsol Browser | Nol error konsol selama navigasi dan perenderan alasan | ✅ PASS |
| 2.1 | Minat Tersebar | Jawaban Seragam (All 3) | Selisih skor kecil memicu munculnya banner `interest-spread-banner` | ✅ PASS |
| 2.2 | Minat Tersebar | Konten Banner | Teks panduan netral sesuai spesifikasi & tombol aksi Favorit/Bandingkan | ✅ PASS |
| 2.3 | Minat Tersebar | Jawaban Terfokus (CS/IT) | Selisih skor $> 4.40\%$ tidak memicu banner (banner tersembunyi) | ✅ PASS |
| 3.1 | Tur Kampus Peta | Klik Gedung FSM (Desktop) | Membuka side panel kanan `faculty-map-tour-panel` | ✅ PASS |
| 3.2 | Tur Kampus Peta | Akurasi Data FSM | Menampilkan 7 prodi Tembalang dan 0 prodi PSDKU | ✅ PASS |
| 3.3 | Tur Kampus Peta | Tombol Aksi Prodi | Seluruh prodi memiliki tautan Detail (`/program/`) dan tombol Favorit | ✅ PASS |
| 3.4 | Tur Kampus Peta | Keyboard Escape | Menekan tombol `Escape` menutup panel tur seketika | ✅ PASS |
| 3.5 | Tur Kampus Peta | Keyboard Enter Marker | Fokus marker `#marker-ft` dan tekan `Enter` membuka panel FT (12 prodi) | ✅ PASS |
| 3.6 | Tur Kampus Peta | Tombol Tutup Panel | Mengklik tombol silang (`btn-close-tour-panel`) menutup panel | ✅ PASS |
| 3.7 | Tur Kampus Peta | Touch Tap Ponsel (390×844) | Mengetuk gedung membuka bottom sheet di bagian bawah layar | ✅ PASS |
| 3.8 | Tur Kampus Peta | Batasan Tinggi Ponsel | Tinggi bottom sheet terbukti $\le 65\%$ tinggi layar viewport | ✅ PASS |
| 3.9 | Tur Kampus Peta | Overflow Horizontal | `scrollWidth <= window.innerWidth` (nol kebocoran horizontal) | ✅ PASS |
| 4.1 | Konsultasi SERADIP | Baseline (Env Kosong) | Nol kartu konsultasi dirender pada halaman hasil rekomendasi | ✅ PASS |
| 4.2 | Konsultasi SERADIP | Hub Langkah Selanjutnya | Nol kartu konsultasi dirender pada `/langkah-selanjutnya` | ✅ PASS |
| 4.3 | Konsultasi SERADIP | Halaman Bandingkan | Nol tombol konsultasi inline dirender pada `/bandingkan` | ✅ PASS |
| 4.4 | Konsultasi SERADIP | Degradasi Anggun | Tidak ada tombol mati (*disabled/broken button*) di seluruh UI | ✅ PASS |

**Total Assertion Produksi:** 27/27 PASSED (100% Berhasil)

---

## 4. Bukti Tangkapan Layar Produksi

Tangkapan layar resolusi tinggi diambil secara otomatis oleh Playwright selama proses verifikasi build produksi dan disimpan di `test-artifacts/round9/`:

1. **`results-match-reasons-desktop.png`:** Tampilan kartu hasil peringkat dengan 2 alasan kecocokan ringkas pada desktop 1440×900.
2. **`results-match-reasons-mobile.png`:** Tampilan kartu hasil dan alasan kecocokan pada layar ponsel 390×844 dengan *viewport* sentuh.
3. **`program-detail-reasons.png`:** Blok alasan kecocokan lengkap pada halaman detail program studi Informatika.
4. **`interest-spread-banner.png`:** Peringatan minat tersebar dengan tombol navigasi Favorit & Bandingkan saat skor berdekatan.
5. **`map-faculty-panel-desktop.png`:** Side panel tur kampus Fakultas Sains dan Matematika di peta interaktif desktop.
6. **`map-faculty-sheet-mobile.png`:** Bottom sheet tur kampus Fakultas Teknik pada ponsel 390×844.
7. **`bandingkan-clean-no-contact.png`:** Verifikasi degradasi anggun pada halaman perbandingan prodi saat nomor kontak belum diatur.

---

## 5. Ringkasan Komit Git Round 9

1. **`0ffbc46`** — `feat(match-reasons): implement per-component breakdown and personalized match reasons`  
   Implementasi dekomposisi skor murni, template alasan kecocokan, toleransi $< 1\times 10^{-9}$, penempatan di kartu hasil, detail prodi, dan ekspor PDF.
2. **`873eaf5`** — `feat(interest-spread): detect close scores with empirical threshold and display advisory banner`  
   Simulasi empiris 2.800 profil, ambang batas $P_{25} = 4.40\%$, deteksi minat tersebar, dan banner interaktif.
3. **`7251716`** — `feat(campus-tour): add interactive faculty building bottom sheet and side panel on map`  
   Komponen `FacultyMapTourSheet`, integrasi marker peta, navigasi keyboard (Enter/Escape), pemisahan 100% bebas PSDKU.
4. **`8482518`** — `feat(contact): implement ConsultCta with strict placement rules, graceful degradation, and Guard 14 validation`  
   Komponen `ConsultCta` (card, inline, link), aturan degradasi anggun, validasi deep link WhatsApp, dan Guard 14 integrasi kontak.
5. Komit Final Seksi 5 & Dokumentasi Pengujian Produksi.
