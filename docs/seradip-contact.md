# Integrasi Kontak Konsultasi Kakak SERADIP (WhatsApp)

Dokumen ini menjelaskan arsitektur integrasi tombol konsultasi WhatsApp dengan tim panitia **Roadshow Sedulur Serang Diponegoro (SERADIP) 2027**.

---

## 1. Lokasi Konfigurasi
Konfigurasi terpusat di:
```typescript
src/config/contact.ts
```

Variabel lingkungan yang didukung:
```env
NEXT_PUBLIC_SERADIP_WA=6281234567890
```

---

## 2. Status Saat Ini (Graceful Degradation)
- **Status:** Menunggu penyerahan nomor resmi WhatsApp panitia SERADIP.
- **Logika:** Fungsi `isContactReady()` mengecek apakah nomor terisi minimal 10 digit.
- **Tampilan UI:** Jika nomor kosong (`''`), seluruh tombol konsultasi di:
  1. Halaman Hasil Rekomendasi (`/results`)
  2. Halaman Komparasi Prodi (`/bandingkan`)
  3. Halaman Favoritku (`/favorit`)
  4. Halaman Detail Prodi (`/program/[id]`)
  **secara otomatis tidak ditampilkan (`null`)**. Tidak ada link rusak, placeholder `#`, atau elemen menggantung.

---

## 3. Cara Mengaktifkan Nomor Resmi
Begitu panitia/responden menyediakan nomor WhatsApp resmi SERADIP:

### Opsi A (Melalui File .env):
Tambahkan pada file `.env.local` atau `.env.production`:
```env
NEXT_PUBLIC_SERADIP_WA=6281234567890
```

### Opsi B (Langsung di Config `src/config/contact.ts`):
Ubah baris berikut:
```typescript
export const CONTACT_CONFIG: ContactConfig = {
  phone: process.env.NEXT_PUBLIC_SERADIP_WA || '6281234567890', // Ganti dengan nomor resmi panitia
  name: 'SERADIP',
  defaultMessagePrefix: 'Halo Kak SERADIP, saya ingin konsultasi mengenai pilihan program studi UNDIP:',
};
```

---

## 4. Format Pesan Otomatis (Deep Link `https://wa.me/`)
Ketika diaktifkan, tombol konsultasi akan membuka WhatsApp dengan template pesan kontekstual:
- **Pada Halaman Hasil (`/results`):** Menyertakan Top 3 program studi rekomendasi HMIM.
- **Pada Halaman Bandingkan (`/bandingkan`):** Menyertakan daftar prodi yang sedang dibandingkan oleh siswa.
- **Pada Halaman Detail Prodi (`/program/[id]`):** Menyertakan nama dan jenjang prodi yang sedang dilihat.
- **Privasi:** Tidak ada data yang dikirim otomatis tanpa persetujuan pengguna; pengguna melihat dan dapat menyunting pesan di aplikasi WhatsApp sebelum menekan tombol kirim.
