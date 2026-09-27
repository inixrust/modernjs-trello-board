# Fitur 05: Drag and Drop Native

Materi: Modul Peserta Bab 12 (Hari 3).

Lengkapi `handleMoveCard` dan empat listener drag (bagian 7).

## Kriteria selesai

- [ ] Card dapat dipindah antar-list dan ditaruh di akhir list tujuan
- [ ] `dragover` memanggil `preventDefault()` dan menyorot list tujuan
- [ ] Satu `PATCH /cards/:id` per pemindahan
- [ ] Sorotan hilang setelah drop atau batal

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>. Buka tab Network saat menyeret card.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 05-drag-drop-starter 05-drag-drop-solution
```
