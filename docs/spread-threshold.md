# Analisis Empiris Ambang Batas Minat Tersebar (Spread Threshold)

Dokumen ini memuat dasar metodologis, simulasi empiris, dan penentuan ambang batas (*spread threshold*) untuk fitur peringatan **"Minat Tersebar"** pada mesin rekomendasi **HMIM (Hybrid Multi-Dimensional Interest Matching)** UNDIP.

---

## 1. Latar Belakang & Masalah

Pada kuesioner penjurusan perguruan tinggi, terdapat dua tipe profil responden yang umum:
1. **Profil Terfokus (*peaked interest*)**: Pengguna memiliki preferensi yang jelas pada rumpun ilmu tertentu (misal: murni menyukai informatika & matematika, atau murni menyukai kedokteran & biologi). Peringkat 1 dengan peringkat berikutnya memiliki selisih skor (*gap*) yang tegas.
2. **Profil Tersebar (*spread / diffuse interest*)**: Pengguna menyukai hampir semua hal secara merata, atau menjawab dengan nilai seragam. Akibatnya, skor prodi peringkat 1 s.d. peringkat 5 hingga peringkat 10 memiliki selisih yang sangat tipis (misal hanya terpaut 1-3%).

Menyajikan peringkat 1 sebagai pilihan mutlak ketika selisihnya dengan peringkat 5 sangat kecil dapat menyesatkan siswa. Oleh karena itu, sistem memberikan **peringatan afirmatif yang netral dan membantu**:
> *"Minatmu cukup tersebar, jadi beberapa prodi di peringkat atas nilainya berdekatan. Coba simpan ke Favorit dan bandingkan beberapa prodi, atau konsultasi dengan SERADIP."*

Peringatan ini **sama sekali tidak mengubah formula atau urutan peringkat**, melainkan memberikan panduan kontekstual agar siswa membandingkan program studi terkait secara berdampingan.

---

## 2. Metodologi Simulasi

Simulasi dijalankan menggunakan mesin resmi `calculateAllScores` terhadap seluruh 36 pertanyaan kuesioner dan 65 program studi kampus Semarang (program PSDKU dikecualikan dari pemeringkatan).

Dua kelompok data disimulasikan:
1. **Kelompok Acak (*Random Answer Sets*, $N = 2.500$)**:
   - Jawaban tiap butir kuesioner dibangkitkan dari distribusi seragam Likert $1-5$.
   - Merepresentasikan spektrum pengguna tanpa kecenderungan arah minat tertentu.
2. **Kelompok Terfokus/Konsisten (*Consistent Focused Answer Sets*, $N = 300$)**:
   - Disimulasikan melintasi 11 kluster disiplin ilmu (Teknik, Sains, Kesehatan, Komputer, Bisnis, Hukum, Sosial, Psikologi, Agro, Kelautan, Humaniora).
   - Pertanyaan yang sesuai dengan rumpun kluster dijawab dengan antusiasme tinggi (skor 4-5), sedangkan rumpun lain dijawab rendah/netral (skor 1-2).

Untuk setiap responden, dihitung:
- $\Delta_{1-5} = \text{Score}_{\#1} - \text{Score}_{\#5}$
- $\Delta_{1-10} = \text{Score}_{\#1} - \text{Score}_{\#10}$

---

## 3. Hasil Distribusi Statistik

### Tabel Distribusi Selisih Skor (Persentil)

| Kelompok Responden | Ukuran Sampel ($N$) | Metrik | Min | P10 | P25 | Median (P50) | P75 | P90 | Max | Mean |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Random (Acak)** | 2.500 | $\Delta_{1-5}$ | 0.3499999999999943% | 1.81% | 2.62% | 3.74% | 5.03% | 6.27% | 11.569999999999993% | 3.92% |
| **Random (Acak)** | 2.500 | $\Delta_{1-10}$ | 1.3900000000000006% | 3.85% | 5.01% | 6.31% | 7.78% | 9.39% | 15.769999999999996% | 6.5% |
| **Konsisten (Terfokus)** | 300 | $\Delta_{1-5}$ | 0.7400000000000091% | 3.01% | **4.4%** | 6.19% | 8.68% | 11.03% | 16.379999999999995% | 6.69% |
| **Konsisten (Terfokus)** | 300 | $\Delta_{1-10}$ | 4.690000000000005% | 7.37% | 9.03% | 11.91% | 14.82% | 17.33% | 24.07999999999999% | 12.2% |

---

## 4. Penentuan Ambang Batas (`INTEREST_SPREAD_THRESHOLD`)

Berdasarkan data empiris di atas:
- Pada kelompok responden konsisten/terfokus, persentil ke-25 ($P_{25}$) untuk selisih peringkat 1 terhadap peringkat 5 adalah **4.4%**.
- Ini berarti bahwa $75\%$ responden dengan minat terfokus memiliki selisih $\Delta_{1-5} > 4.4\%$.
- Sebaliknya, responden yang memiliki $\Delta_{1-5} \le 4.4\%$ menunjukkan pola keselarasan yang sangat rapat antar beberapa prodi teratas (kurang dari 4.4\%$ poin perbedaan antara pilihan nomor 1 dan nomor 5).

### Definisi Aturan Deteksi:
Peringatan minat tersebar diaktifkan bila:
$$\text{Score}_{\#1} - \text{Score}_{\#5} \le 4.4\%$$

Atau bila jumlah program studi yang dihitung $< 5$, bila selisih peringkat pertama dan peringkat terakhir yang tersedia $\le 2.0\%$.

Konstanta ini diekspos secara publik pada `src/lib/interestSpread.ts`:
```ts
export const INTEREST_SPREAD_THRESHOLD = 4.4; // Dokumen analisis: docs/spread-threshold.md
```

---

## 5. Ringkasan Kesimpulan
1. **Nilai Ambang Batas Terpilih**: **4.4%** untuk selisih skor prodi peringkat #1 dan #5.
2. **Sifat Fitur**: Informatif & edukatif. Peringkat rekomendasi tidak diubah, namun pengguna difasilitasi dengan tombol pintas ke fitur Bandingkan dan konsultasi pendampingan SERADIP.
3. **Audit Transparansi**: Ambang batas ini ditampilkan secara terbuka pada halaman Administrasi Algoritma (`/admin`).
