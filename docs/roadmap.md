# UNDIP Major Matcher — Roadmap & Data Maintenance

Dokumen perencanaan pembaruan data dan pengembangan fitur platform **UNDIP Major Matcher** (Roadshow Sedulur Serang Diponegoro 2027).

---

## 1. Integrasi Data Kuota & Daya Tampung Resmi

- **Status Saat Ini:**
  - Data daya tampung dan kuota penerimaan mahasiswa baru (SNBP, SNBT, Ujian Mandiri) yang dimuat di seluruh platform merujuk pada ketetapan resmi Tahun Akademik 2024/2025 dan 2025/2026 yang telah diverifikasi melalui portal resmi PMB UNDIP (`pmb.undip.ac.id`) dan BPPP Kemendikbudristek/SNPMB (`snpmb.bppp.kemdikbud.go.id`).
  - Label pada seluruh kartu dan tampilan detail program studi secara dinamis menyatakan: `"Kuota TA <academicYear> — dapat berubah (data per <lastVerified>)"`.
  - **Prinsip Integritas Data:** Platform tidak pernah berspekulasi atau menebak angka kuota yang belum dirilis secara formal.

- **Item Roadmap Utama:**
  > **Integrate official SNPMB quota data for 2026/2027 when published.**
  - Jadwal rilis resmi SNPMB TA 2026/2027 diperkirakan pada akhir 2025 / awal 2026.
  - Setelah Surat Keputusan Rektor UNDIP dan portal SNPMB mempublikasikan alokasi resmi per prodi, seluruh data pada `src/data/quotas.ts` akan diperbarui secara serentak disertai tautan SK dan stempel `lastVerified`.

---

## 2. Rencana Pembaruan Jalur & Seleksi

1. **Sinkronisasi Kalender Seleksi 2027:**
   - Memperbarui linimasa SNBP 2027, SNBT UTBK 2027, dan UM UNDIP 2027 segera setelah BPPP SNPMB merilis jadwal resmi.
2. **Penyesuaian Besaran UKT & IPI (Iuran Pengembangan Institusi):**
   - Mengintegrasikan tabel nominal UKT Golongan 1–8 dan IPI jalur mandiri tahun berjalan berdasarkan SK Rektor terbaru.
3. **Peningkatan Aksesibilitas & Mode Offline:**
   - Menyediakan fitur ekspor ringkasan rekomendasi PDF untuk siswa SMA yang memiliki keterbatasan sinyal internet saat roadshow berlangsung di daerah Serang dan sekitarnya.
