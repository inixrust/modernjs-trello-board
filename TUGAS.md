# Fitur 08: Deep Dive: Event Loop dan Promise Sederhana

Materi: Modul Peserta Bab 15 (Hari 4).

Prediksi dulu output `latihan/event-loop.js` dan `latihan/event-loop-2.js`, lalu jalankan dengan Node. Setelah itu lengkapi `latihan/my-promise.js` tahap 2--4.

## Kriteria selesai

- [ ] State hanya berubah sekali
- [ ] `then` menyimpan callback saat pending dan menjalankannya saat selesai
- [ ] Callback selalu asynchronous (`queueMicrotask`)
- [ ] Uji tahap 3 dan 4 mencetak baris 1 sampai 5 berurutan

## Cara mengecek

`node latihan/event-loop.js`, `node latihan/event-loop-2.js`, `node latihan/my-promise.js`

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 08-promise-starter 08-promise-solution
```
