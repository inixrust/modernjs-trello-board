# Fitur 09: Final Challenge: Mengurutkan Card

Materi: Modul Peserta Bab 16 (Hari 4).

Card yang dijatuhkan harus bisa disisipkan **di antara** dua card, di list yang sama maupun list lain, dan urutannya tersimpan. Tidak ada kode awal: rancang sendiri. Jawab dulu pertanyaan rancangan di Bab 16 sebagai komentar di atas `card.js`. Class CSS `drop-before` dan `drop-after` sudah tersedia.

## Kriteria selesai

- [ ] Drop di atas card -> ditempatkan sebelum card itu; di area kosong -> di akhir
- [ ] Mengurutkan ulang di list yang sama berfungsi
- [ ] Hanya satu PATCH per pemindahan; drop di posisi semula tanpa request
- [ ] Ada penanda visual posisi jatuh; urutan tetap setelah muat ulang
- [ ] Rollback bila PATCH gagal; tidak ada `fetch` di luar `api.js`

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 09-final-challenge-starter 09-final-challenge-solution
```
