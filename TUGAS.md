# Fitur 02: Fungsi API dengan Fetch

Materi: Modul Peserta Bab 9 (Hari 2).

Lengkapi bagian 1 di `public/js/app.js`: helper `request()` dan fungsi CRUD.

## Kriteria selesai

- [ ] `request()` memeriksa `response.ok` dan melempar `Error`
- [ ] Header `Content-Type: application/json` selalu terkirim
- [ ] Sembilan fungsi CRUD mengembalikan data dari server
- [ ] `await getCard(999)` (bila dibuat) masuk ke `catch` dengan status 404

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>. Uji di Console: `await getCards()`, `await createList({...})`, dan seterusnya.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 02-api-starter 02-api-solution
```
