# UNDIP Major Matcher — Audit Integritas Data & Sumber Rujukan
## Roadshow Sedulur Serang Diponegoro 2027 — Verifikasi Ronde 4

Dokumen audit ini mencatat status keabsahan, metode akses, dan bukti rujukan (*evidence*) untuk seluruh data faktual (daya tampung, UKT, KIP-Kuliah, kalender seleksi, dan struktur departemen) yang ditampilkan dalam aplikasi **UNDIP Major Matcher**.

---

### 1. Prinsip Audit
Sesuai aturan ketat Ronde 4:
- **Evidence or it does not ship**: Semua fakta angka (Rupiah, kuota, tanggal) dan struktur kelembagaan wajib merujuk ke dokumen fisik di `docs/sources/` yang diverifikasi pada sesi ini.
- **Honesty about access**: Setiap item diklasifikasikan secara jujur:
  - `provided`: Dokumen resmi diserahkan oleh pemilik proyek dan tersimpan di `docs/sources/`.
  - `opened`: Halaman web resmi dibuka dan diverifikasi langsung pada sesi ini.
  - `not-accessed`: Tidak ada dokumen di `docs/sources/` dan/atau tidak diakses langsung; data berstatus `pending` atau `reference` tanpa angka tebakan.
- **Koreksi Ronde 3**: Klaim pada laporan Ronde 3 bahwa data kuota telah *"verified 2026-02-15"* dinyatakan **keliru/tidak valid**, karena pada saat itu data di `src/data/quotas.ts` masih menggunakan data TA 2024/2025. Per Ronde 4, seluruh data kuota telah diperbarui secara sah merujuk pada SK Rektor No. 41 Tahun 2026 tanggal 14 Januari 2026.

---

### 2. Tabel Audit Data Faktual

| Item Data | Nilai yang Ditampilkan di UI | Sumber Rujukan (File / URL) | Status Akses | Status Verifikasi | Catatan Audit & Evidence |
|---|---|---|---|---|---|
| **Daya Tampung Program Sarjana (59 Prodi: 54 Semarang + 5 PSDKU)** | Kuota SNBP, SNBT, Mandiri Reguler + IUP, Total Kapasitas (Total 13.250 kursi) TA 2026/2027 | `docs/sources/SK-NO-41-TENTANG-PENETAPAN-DAYA-TAMPUNG-VOKASI-DAN-SARJANA-TAHUN-2026-2027.pdf` | `provided` | `official` | SK Rektor UNDIP No. 41/UN7.A/HK/I/2026 Lampiran II, ditetapkan 14 Januari 2026. Mencakup 5 prodi PSDKU (Pekalongan, Batang, Rembang). Semua penjumlahan `snbp + snbt + mandiri === total` diverifikasi 100%. |
| **Daya Tampung Sekolah Vokasi (11 Prodi D4)** | Kuota SNBP, SNBT, Mandiri, Total Kapasitas (Total 2.040 kursi) TA 2026/2027 | `docs/sources/SK-NO-41-TENTANG-PENETAPAN-DAYA-TAMPUNG-VOKASI-DAN-SARJANA-TAHUN-2026-2027.pdf` | `provided` | `official` | SK Rektor UNDIP No. 41/UN7.A/HK/I/2026 Lampiran I, ditetapkan 14 Januari 2026. |
| **Struktur Golongan UKT Sarjana (8 Golongan)** | Gol 1: Rp500.000 s.d. Gol 8: Rp6.400.000 – Rp22.000.000 | `docs/sources/Biaya-Pendidikan-Program-Sarjana-dan-Diploma4-SNBP-SNBT.pdf` | `provided` | `official` | Lampiran Penetapan UKT Mahasiswa Baru Jalur SNBP/SNBT/UM Reguler Golongan Tidak Mampu TA 2026/2027 (hlm. 1–3). |
| **Struktur Golongan UKT Vokasi (7 Golongan)** | Gol 1: Rp500.000 s.d. Gol 7: Rp7.500.000 – Rp8.500.000 | `docs/sources/Biaya-Pendidikan-Program-Sarjana-dan-Diploma4-SNBP-SNBT.pdf` | `provided` | `official` | Lampiran UKT Program Diploma IV Sekolah Vokasi TA 2026/2027 (hlm. 3). Maksimum Golongan 7. |
| **Tarif UKT Spesifik per Program Studi (70 Prodi: 65 Semarang + 5 PSDKU)** | Nominal Rupiah persis Gol 1–8/7 di halaman detail prodi & tab Langkah Selanjutnya | `docs/sources/Biaya-Pendidikan-Program-Sarjana-dan-Diploma4-SNBP-SNBT.pdf` | `provided` | `official` | Dimuat dalam `src/data/ukt.ts` dengan kutipan nomor urut dan halaman dokumen bukti untuk seluruh 70 program studi (termasuk 5 PSDKU hlm. 3). |
| **Program PSDKU (5 Prodi)** | PWK Pekalongan, Teknik Industri Batang, Agribisnis Batang, Informatika Rembang, Adm. Publik Rembang | SK Rektor 41/2026 (Lampiran II hlm. 7, 9, 10) & Biaya Pendidikan (hlm. 3) | `provided` | `official` | Ditampilkan pada `/program-studi` dalam kelompok mandiri "PSDKU (Kampus Luar Semarang)" & dieksklusikan dari leaderboard peringkat kecocokan hasil tes. |
| **Kebijakan IPI / Uang Pangkal** | Bebas IPI untuk jalur SNBP & SNBT; IPI hanya untuk Ujian Mandiri | `docs/sources/Biaya-Pendidikan-Program-Sarjana-dan-Diploma4-SNBP-SNBT.pdf` & Ketentuan SNPMB Kemdikbud | `provided` | `official` | Tabel resmi menunjukkan UKT SNBP/SNBT tanpa kolom IPI. |
| **Departemen Sekolah Vokasi (11 Prodi)** | 4 Departemen: Tek. Industri, Sipil & Perencanaan, Bisnis & Keuangan, Informasi & Budaya | `docs/sources/SK-NO-41-TENTANG-PENETAPAN-DAYA-TAMPUNG-VOKASI-DAN-SARJANA-TAHUN-2026-2027.pdf` | `provided` | `official` | Lampiran I SK Rektor 41/2026 membagi 11 program studi Vokasi ke dalam 4 departemen resmi. |
| **Departemen Fakultas Sarjana (56 Prodi)** | Dikelompokkan langsung di bawah Fakultas masing-masing (`department: undefined`) | Tidak ada dokumen resmi departemen fakultas di `docs/sources/` | `not-accessed` | `pending` (langsung di bawah Fakultas) | Seluruh nama departemen yang tidak berbukti resmi dari Ronde 3 telah **dihapus**. Prodi sarjana tampil langsung di bawah fakultas tanpa rekayasa nama. |
| **Beasiswa KIP-Kuliah (Kriteria & Manfaat)** | Gambaran umum kualifikasi, tahapan pendaftaran, tombol portal resmi (tanpa nominal rupiah) | `https://kip-kuliah.kemdikbud.go.id/` | `not-accessed` | `pending` | Seluruh estimasi angka (klaster uang saku, desil P3KE, angka SKTM) telah **dihapus** dari codebase karena belum ada juknis resmi yang diserahkan. |
| **Kalender Seleksi Masuk (SNBP, SNBT, UM)** | Linimasa tahapan seleksi dengan label *"Menunggu jadwal resmi"* & disclaimer 2027 | `https://snpmb.bppp.kemdikbud.go.id/` & `https://pmb.undip.ac.id/` | `not-accessed` | `pending` | Jadwal bulan estimasi telah diganti dengan status menunggu jadwal resmi 2027. |

---

### 3. Koreksi Data Spesifik dari Temuan Ronde 3

1. **Penghapusan Seluruh Angka Tebakan pada `nextSteps.ts`:**
   - Dihapus: Rentang uang saku KIP-Kuliah *"~Rp1.100.000/bulan (Klaster Semarang)"*.
   - Dihapus: Batas nominal SKTM *"Rp4.000.000 atau Rp750.000 per kapita"* dan kategori *"Desil 1–3 P3KE"*.
   - Dihapus: Estimasi bulan pelaksanaan seleksi (Desember – Juli).
   - Seluruh bagian di atas kini berstatus `pending` ("Perlu verifikasi") dan mengarahkan siswa ke portal resmi instansi terkait.

2. **Perbaikan Daya Tampung ke TA 2026/2027:**
   - Diperbarui: Seluruh 67 program studi kini menggunakan data resmi SK Rektor No. 41 Tahun 2026 tanggal 14 Januari 2026 (`academicYear: '2026/2027'`).
   - Rumus penjumlahan kuota diverifikasi: `snbpQuota + snbtQuota + mandiriQuota === totalCapacity` pada 100% entri.

3. **Pembersihan Departemen Tanpa Bukti:**
   - Sebanyak 56 departemen sarjana yang tidak memiliki dokumen bukti fisik di `docs/sources/` telah dihapus dari `src/data/programs.ts`.
   - Program studi seperti *Statistika*, *Bioteknologi*, *Ekonomi Islam*, *Bisnis Digital*, *Agribisnis*, *Agroekoteknologi*, *Teknik Komputer*, dan *Hukum* kini secara jujur berada langsung di bawah Fakultas masing-masing di halaman `/program-studi`.
   - Hanya 11 prodi Sekolah Vokasi yang mempertahankan hierarki Departemen karena tercantum secara eksplisit pada Lampiran I SK Rektor No. 41/2026.

4. **Pembersihan Navigasi:**
   - Navlink *"HASIL MATCH"* yang tidak diminta telah dihapus dari `Navbar.tsx` (desktop & mobile menu). Navigasi menuju halaman hasil tetap diakses via tombol CTA *"HASIL →"*.

---

### 4. MISSING SOURCES (Dokumen yang Masih Diperlukan)

Untuk dapat menaikkan status data yang masih `pending` menjadi `official`, pemilik proyek (*project owner*) perlu menyediakan dokumen resmi berikut ke dalam folder `docs/sources/`:

1. **`jadwal-snpmb-<tahun>.pdf`**:
   - Jadwal resmi tahapan registrasi akun, pendaftaran, pelaksanaan UTBK, dan pengumuman hasil SNBP & SNBT dari Panitia SNPMB BPPP Kemdikbudristek.
2. **`jadwal-pmb-undip-<tahun>.pdf`**:
   - Jadwal dan kalender resmi Ujian Mandiri (UM S1 & Vokasi) yang diterbitkan oleh LP2MP / PMB Universitas Diponegoro.
3. **`kip-kuliah-panduan-<tahun>.pdf`**:
   - Pedoman Teknis / Panduan Pendaftaran KIP-Kuliah resmi dari Puslapdik Kemdikbudristek (mencakup kriteria desil ekonomi, batas pendapatan orang tua, dan pembagian klaster biaya hidup mahasiswa).
4. **`departemen-<fakultas>.pdf` atau `departemen-<fakultas>.png`**:
   - Salinan Peraturan Rektor tentang Organisasi dan Tata Kelola (OTK) Fakultas atau struktur organisasi resmi fakultas di lingkungan UNDIP jika ingin menampilkan sub-pengelompokan departemen untuk Program Sarjana (FT, FSM, FEB, FISIP, FIB, FPP, FPIK, FK).
5. **`biaya-pendaftaran-um-<tahun>.pdf`**:
   - Dokumen keputusan resmi penetapan tarif pendaftaran Ujian Mandiri (UM SBUB, UM SNBT S1, UM S1, UM Vokasi). Saat ini berstatus `reference` berdasarkan keterangan panitia Roadshow 2026.
6. **`ipi-undip-<tahun>.pdf`**:
   - Keputusan Rektor tentang penetapan besaran Iuran Pengembangan Institusi (IPI) / Uang Pangkal per program studi jalur Ujian Mandiri.
7. **`juknis-sktm-tidak-mampu-<tahun>.pdf`**:
   - Petunjuk teknis dan syarat dokumen opsi "Tidak Mampu" untuk pembebasan IPI dan penetapan golongan UKT jalur Ujian Mandiri.
