# Fitur 04: CRUD dengan Event Delegation

Materi: Modul Peserta Bab 11 (Hari 3).

Lengkapi handler (bagian 5) dan listener (bagian 6).

## Kriteria selesai

- [ ] Tambah, edit (dialog), dan hapus card tersimpan ke API
- [ ] Tambah dan hapus list. Hapus list juga membersihkan card di state
- [ ] Satu listener `click` dan satu `submit` di `#board`
- [ ] State diperbarui tanpa mutasi (spread, `map`, `filter`)
- [ ] Judul divalidasi (`isValidTitle`) dan tombol submit nonaktif selama request

## Cara mengecek

Jalankan `npm start`, lalu buka <http://localhost:3000>. Muat ulang halaman: semua perubahan harus tetap ada.

Bandingkan dengan solusi setelah mencoba sendiri:

```bash
git diff 04-crud-starter 04-crud-solution
```
