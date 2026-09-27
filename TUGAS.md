# Fitur 07: Refactor ke ES Modules

Materi: Modul Peserta Bab 14 (Hari 4).

Pindahkan kode dari `public/js/app.js` ke delapan module sesuai komentar di setiap berkas, lalu ubah tag script menjadi `type="module"`.

## Kriteria selesai

- [ ] Delapan module: api, state, render, board, list, card, events, app
- [ ] Import hanya ke lapisan yang lebih rendah (tanpa circular dependency)
- [ ] Tidak ada `fetch` di luar `api.js`
- [ ] Perilaku aplikasi sama persis seperti sebelum refactor

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>. Periksa tab Sources: delapan module terpisah.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 07-modules-starter 07-modules-solution
```
