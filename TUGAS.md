# Fitur 06: Status Aplikasi dan Optimistic Update

Materi: Modul Peserta Bab 13 (Hari 4).

Kode sudah disusun ulang: status ada di state, `render()`, `showToast()`, dan `loadBoard()` dengan tombol Coba lagi. Tugas Anda: ubah `moveCard` menjadi optimistic update dengan rollback.

## Kriteria selesai

- [ ] Card langsung berpindah walaupun server lambat (`npm run start:lambat`)
- [ ] Bila PATCH gagal, HANYA card itu yang kembali (rollback per card) dan toast tampil
- [ ] Rollback bekerja karena state diperbarui tanpa mutasi

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>. Uji gagal: DevTools > Network > klik kanan request PATCH > Block request URL.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 06-optimistic-starter 06-optimistic-solution
```
