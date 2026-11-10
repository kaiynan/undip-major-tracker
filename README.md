# Define Your Next Move — Find Your Potential, Define Your Next Move

Platform eksplorasi dan rekomendasi program studi Universitas Diponegoro (UNDIP) berbasis **Hybrid Multi-Dimensional Interest Matching (HMIM)** untuk siswa SMA/SMK/MA.
Diselenggarakan dalam rangka **Roadshow Sedulur Serang Diponegoro 2027 — Unlock The Unseen**.

> **Tagline:** *"Find Your Potential, Define Your Next Move"*  
> **Tema:** *"Roadshow Sedulur Serang Diponegoro 2027 — Unlock The Unseen"*  
> **Disclaimer:** Aplikasi ini adalah instrumen eksplorasi minat akademik dan rekomendasi prodi, **bukan diagnosis psikologis klinis atau penentu kelulusan seleksi masuk PTN**.

---

## 🚀 Fitur Utama

1. **Kuesioner Minat 36 Pertanyaan (4 Dimensi Terkalibrasi & Bobot Dinamis):**
   - **RIASEC:** Realistic, Investigative, Artistic, Social, Enterprising, Conventional.
   - **Domain-Specific Interest:** 12 bidang ilmu (D1–D12).
   - **Learning & Activity Preference:** 8 gaya dan aktivitas belajar.
   - **Curriculum & Competency:** 8 karakteristik kurikulum dan prodi.
   - *Bobot Adaptif & Terkalibrasi:* Menggunakan bobot bawaan standar (RIASEC: 20%, Domain: 35%, Learning: 20%, Curriculum: 25%) yang dikonfigurasi secara transparan di panel inspeksi sistem.
2. **Mesin Rekomendasi HMIM (Cosine Similarity):**
   - Perhitungan keselarasan vektor multi-dimensi dengan normalisasi skor 0–100%.
   - Tier klasifikasi: **S** (85–100, Sangat Cocok), **A** (75–84.9, Rekomendasi Utama), **B** (65–74.9, Cukup Cocok), **C** (50–64.9, Potensi Alternatif), **D** (0–49.9, Eksplorasi Alternatif). Label Tier D menggunakan pendekatan suportif disertai penjelasan *"Bukan berarti tidak bisa — jelajahi alasan dan pilihan lainnya."*
   - Perumusan skor agregat fakultas: $Score_F = \frac{S_1 + S_2 + S_3}{n}$ (rata-rata 3 prodi tertinggi).
   - **Critical Consistency Rule:** Skor dan tier setiap prodi 100% identik di View 1 (*All Major Tier List*) dan View 2 (*Faculty Tier List*).
3. **Database Resmi 70 Program Studi Terverifikasi:**
   - 54 Program Sarjana (S1) Kampus Utama Semarang.
   - 11 Program Sarjana Terapan (D4) Sekolah Vokasi (termasuk TISPA, TRKP, TLI, TRKI, RPM, dll.).
   - 5 Program PSDKU (PWK Pekalongan, Teknik Industri Batang, Agribisnis Batang, Informatika Rembang, Administrasi Publik Rembang). Program PSDKU disajikan pada direktori prodi khusus dan dikecualikan dari pemeringkatan kuesioner.
4. **Integrasi Daya Tampung Resmi (SNBP, SNBT, Mandiri):**
   - Kuota kursi resmi tahun akademik 2026/2027 per jalur seleksi (SK Rektor No. 41/2026).
   - Visualisasi proporsi jalur dan perbandingan kuota tanpa mengubah skor minat HMIM.
5. **Hybrid Mobile & Progressive Web App (PWA):**
   - Desain responsif (360px – 1440px+).
   - Mobile Bottom Navigation Bar dengan indikator progres kuisioner.
   - PWA Service Worker (`/sw.js`), Manifest (`manifest.webmanifest`), dan Halaman Offline (`/offline`).
   - Konfigurasi Capacitor (`capacitor.config.ts`) siap build Android/iOS.
6. **Alat Pendukung:**
   - Komparasi berdampingan hingga 3 program studi.
   - Registri data akademik, inspektor bobot & batas tier interaktif (`/admin`).
   - Profil instan untuk pengujian cepat (Teknik, Medis, Bisnis, Humaniora, Maritim).

---

## 📐 Formula Rekomendasi — HMIM

Skor kecocokan dihitung secara deterministik menggunakan bobot multi-dimensi:

$$S_{\text{prodi}} = w_{\text{RIASEC}} \times S_{\text{RIASEC}} + w_{\text{Domain}} \times S_{\text{Domain}} + w_{\text{Learning}} \times S_{\text{Learning}} + w_{\text{Curriculum}} \times S_{\text{Curriculum}}$$

*(dengan bobot standar: $w_{\text{RIASEC}} = 0.20$, $w_{\text{Domain}} = 0.35$, $w_{\text{Learning}} = 0.20$, $w_{\text{Curriculum}} = 0.25$, dan $\sum w_i = 1.0$)*

Di mana setiap dimensi dihitung melalui Cosine Similarity antara vektor jawaban pengguna ($\mathbf{u}$) dan vektor karakteristik prodi ($\mathbf{p}$):

$$\text{Sim}(\mathbf{u}, \mathbf{p}) = \frac{\sum_{i=1}^n u_i \cdot p_i}{\sqrt{\sum_{i=1}^n u_i^2} \cdot \sqrt{\sum_{i=1}^n p_i^2}} \times 100$$

---

## 📊 Struktur Fakultas & Program Studi UNDIP (67 Prodi)

| No | Fakultas / Sekolah | Kode | Jumlah S1 | Jumlah D4 | Total Prodi |
|---|---|---|---|---|---|
| 1 | Fakultas Teknik | `ft` | 12 | - | 12 |
| 2 | Fakultas Sains dan Matematika | `fsm` | 7 | - | 7 |
| 3 | Fakultas Kedokteran | `fk` | 5 | - | 5 |
| 4 | Fakultas Ekonomika dan Bisnis | `feb` | 5 | - | 5 |
| 5 | Fakultas Hukum | `fh` | 1 | - | 1 |
| 6 | Fakultas Ilmu Sosial dan Ilmu Politik | `fisip` | 5 + 1 (PSDKU) | - | 6 |
| 7 | Fakultas Ilmu Budaya | `fib` | 6 | - | 6 |
| 8 | Fakultas Kesehatan Masyarakat | `fkm` | 2 | - | 2 |
| 9 | Fakultas Perikanan dan Ilmu Kelautan | `fpik` | 6 | - | 6 |
| 10 | Fakultas Peternakan dan Pertanian | `fpp` | 4 + 1 (PSDKU) | - | 5 |
| 11 | Fakultas Psikologi | `fpsi` | 1 | - | 1 |
| 12 | Sekolah Vokasi | `sv` | - | 11 | 11 |
| **Total** | **12 Unit Akademik** | | **56** | **11** | **67** |

---

## 🛠️ Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js 18+ (atau Node.js 20+)
- npm / yarn / pnpm

### Instalasi & Menjalankan

```bash
# Clone atau buka repositori
cd undip-major-matcher

# Install dependensi
npm install

# Jalankan pengujian engine (10 test suites)
npm test

# Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada peramban.

### Menjalankan Build Produksi

Aplikasi menggunakan `output: "export"` (static HTML export). Perhatikan bahwa `next start` **tidak dapat digunakan** untuk static export; gunakan `npm run serve:out` untuk menjalankan server lokal static build.

```bash
npm run build
npm run serve:out
```

---

## 📱 Panduan Hybrid Mobile & PWA

### Akses sebagai Web App (PWA)
1. Buka situs di Google Chrome (Android) atau Safari (iOS).
2. Pilih menu **"Tambahkan ke Layar Utama" / "Install App"**.
3. Aplikasi akan terinstal dengan ikon UNDIP dan dapat dibuka dalam jendela standalone dengan dukungan offline caching.

### Ekspor ke Android APK / iOS via Capacitor
1. Lakukan build statis:
   ```bash
   npm run build
   ```
2. Instal Capacitor CLI & platform yang diinginkan:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Next Move" "id.ac.undip.majormatcher" --web-dir out
   npx cap add android
   npx cap sync
   npx cap open android
   ```

---

## 🧪 Hasil Pengujian Otomatis

Pengujian dijalankan melalui script `src/lib/engine.test.ts` (`npm test`):

- **Test 1:** Kelengkapan 36 pertanyaan kuesioner pada 4 dimensi terdistribusi sempurna.
- **Test 2:** Validasi 12 fakultas dan 67 program studi tanpa ID menggantung.
- **Test 3:** Properti matematis Cosine Similarity (identitas, ortogonalitas, vektor nol).
- **Test 4:** Normalisasi skala Likert 1–5 menjadi rentang 0–100.
- **Test 5:** Klasifikasi batas tier (S, A, B, C, D) tanpa celah desimal.
- **Test 6:** Diskriminasi profil (misal: Teknik Kimia vs Kimia Murni).
- **Test 7:** Skor agregat fakultas konsisten menggunakan rata-rata top 3 prodi.
- **Test 8:** **Critical Consistency Rule**: Kesamaan 100% antara skor prodi di Tab 1 dan Tab 2.
- **Test 9:** Determinisme kalkulasi dan penanganan jawaban parsial.
- **Test 10:** Verifikasi database daya tampung resmi (SNBP + SNBT + Mandiri = Total) dan invariansi skor minat HMIM.

---

## 📄 Lisensi & Hak Cipta

Dikembangkan untuk calon mahasiswa Universitas Diponegoro.  
Data program studi dan daya tampung merujuk pada publikasi resmi **PMB UNDIP** dan **SNPMB BPPP Kemendikbudristek RI**.
