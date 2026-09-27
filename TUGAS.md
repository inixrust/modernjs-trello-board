# Fitur 03: State dan Render Board

Materi: Modul Peserta Bab 10 (Hari 3).

Lengkapi selector, fungsi render, dan `init()`.

## Kriteria selesai

- [ ] Board, list, dan card tampil terurut berdasarkan `position`
- [ ] Selector tidak memutasi state (`toSorted`, `filter`)
- [ ] Judul card lewat `textContent`, template statis lewat `innerHTML`
- [ ] Loading tampil (`npm run start:lambat`) dan error tampil saat server mati
- [ ] Pesan error untuk pengguna umum; detail teknis hanya di Console (`reportError`)

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 03-render-starter 03-render-solution
```
