# Checklist Verifikasi Lapangan Koordinat Kampus (Untuk Owner)

Dokumen ini mencatat **7 lokasi kampus** yang belum memiliki data geometri bernama dalam OpenStreetMap (`osm-2026-11-09.json`).  
Saat ini, ketujuh lokasi ini ditandai secara transparan dengan atribut `source: 'approx'`, digambar dengan garis putus-putus (*dashed outline*) dan penanda *"Perkiraan"*, serta disembunyikan pada *overview zoom* (`zoom < 1.6`) agar tidak menyesatkan pengguna.

Agar lokasi-lokasi ini dapat diangkat menjadi `source: 'osm'` / terverifikasi penuh, silakan ikuti panduan di bawah untuk setiap lokasi.

---

### Cara Pengambilan Koordinat GPS yang Benar:
1. Buka aplikasi **Google Maps** di ponsel cerdas Anda.
2. Ubah mode tampilan peta menjadi **Satelit**.
3. Perbesar (*zoom-in*) maksimal hingga atap gedung atau monumen terlihat jelas.
4. **Tekan dan tahan (long-press)** tepat di tengah atap gedung / pusat monumen hingga muncul pin merah bertuliskan koordinat.
5. Salin dan kirimkan format koordinat tersebut (contoh: `-7.052150, 110.438120`).

---

## 1. Fakultas Ekonomika dan Bisnis (FEB)
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.052150, 110.438120`)
- **Masalah OSM:** Dalam data OSM saat ini, tidak ditemukan poligon gedung bertag `name="Fakultas Ekonomika dan Bisnis"` atau `"Dekanat FEB"`.
- **Pertanyaan untuk Owner:**
  > *"Buka Google Maps satelit, cari kawasan FEB di antara FISIP dan Student Center. Tekan lama tepat di tengah atap Gedung Dekanat FEB / Hall Pertamina FEB, lalu salin dan kirimkan koordinat latitude dan longitude-nya."*

## 2. Art Centre Undip
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.052020, 110.438750`)
- **Masalah OSM:** Belum ada poligon bertag `name="Art Centre Undip"` di area barat Widya Puraya.
- **Pertanyaan untuk Owner:**
  > *"Buka Google Maps satelit di sisi barat Widya Puraya dekat pertigaan jalan utama. Tekan lama tepat di atap bangunan Art Centre Undip dan kirimkan koordinatnya."*

## 3. Taman Inspirasi
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.052700, 110.439300`)
- **Masalah OSM:** Tidak ada area taman bernama `"Taman Inspirasi"` dalam data OSM (berbeda dengan Taman Widya Puraya yang sudah terverifikasi).
- **Pertanyaan untuk Owner:**
  > *"Apakah Taman Inspirasi berlokasi di sebelah selatan GSG / barat daya Widya Puraya? Tekan lama di pusat gazebo/taman tersebut di Google Maps satelit dan kirimkan koordinatnya."*

## 4. Bundaran Pertama (Jl. Prof. Soedarto)
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.051600, 110.439500`)
- **Masalah OSM:** Persimpangan bundaran jalan utama belum memiliki poligon bundaran taman mandiri dalam dataset OSM.
- **Pertanyaan untuk Owner:**
  > *"Tekan lama tepat di pulau tengah Bundaran Pertama Jl. Prof. Soedarto di Google Maps satelit dan kirimkan titik koordinatnya."*

## 5. Patung Kuda Pangeran Diponegoro
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.051100, 110.440100`)
- **Masalah OSM:** Di area Widya Puraya / Gerbang Tembalang terdapat beberapa monumen patung kuda. Belum ada node OSM spesifik bernama `"Patung Kuda Undip"` di lapangan tengah Widya Puraya.
- **Pertanyaan untuk Owner:**
  > *"Konfirmasi lokasi monumen Patung Kuda yang dimaksud: apakah monumen patung kuda putih di bundaran Lapangan Widya Puraya atau patung kuda di Gerbang Ngesrep / Stadion? Tekan lama tepat di atas patung tersebut dan kirimkan koordinatnya."*

## 6. Menara Undip (UNDIP Tower)
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.052800, 110.437900`)
- **Masalah OSM:** Bangunan Menara Undip berada di kompleks Student Center / Training Center, namun belum memiliki nama terpisah `"Menara Undip"` di OSM.
- **Pertanyaan untuk Owner:**
  > *"Cari gedung menara tinggi di dekat Student Center / LPPU. Tekan lama di puncak atap Menara Undip di Google Maps satelit dan kirimkan koordinatnya."*

## 7. Pintu Gerbang Utama Tembalang
- **Status Saat Ini:** `source: 'approx'` (Posisi sementara: `-7.049100, 110.439300`)
- **Masalah OSM:** Pintu gerbang gapura masuk Jl. Prof. Soedarto dari arah Ngesrep/Banyumanik belum ditandai sebagai gerbang (`barrier=gate`) bernama di OSM.
- **Pertanyaan untuk Owner:**
  > *"Tekan lama tepat di titik lengkung portal Gapura/Pintu Gerbang Utama Kampus Tembalang di Jl. Prof. Soedarto dan kirimkan koordinatnya."*
