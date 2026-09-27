# Modern JavaScript: Trello Board

Kode pendamping pelatihan **Modern JavaScript: Memahami JavaScript Vanilla Lewat Proyek
Trello Board** (INIXINDO Bandung, 4 hari / 20 jam). Setiap fitur yang dibahas di modul
punya dua branch: **starter** (kerangka dengan `TODO`) dan **solution** (kode acuan yang
sudah diuji). Solution satu fitur adalah titik awal starter fitur berikutnya.

Tanpa framework dan tanpa library: HTML, CSS, JavaScript Vanilla, Fetch API, dan
[JSON Server](https://github.com/typicode/json-server/tree/v0.17.4) sebagai REST API.

## Persiapan

- Node.js 20 LTS atau lebih baru, Google Chrome, dan VS Code
- `npm install` (sekali, butuh internet)

```bash
npm start            # aplikasi + API di http://localhost:3000
npm run start:lambat # sama, dengan jeda 1,5 detik per response (melihat loading)
```

JSON Server sengaja dikunci ke versi `0.17.4`. Jangan memakai `npx json-server` tanpa
versi, karena versi `1.0.0-beta` berperilaku berbeda.

## Fitur dan Branch

| No | Fitur | Modul | Starter | Solution |
|---|---|---|---|---|
| 01 | Todo List: state, render, event delegation | Bab 6 | `01-todo-starter` | `01-todo-solution` |
| 02 | Fungsi API dengan Fetch (CRUD) | Bab 9 | `02-api-starter` | `02-api-solution` |
| 03 | State, selector, dan render board | Bab 10 | `03-render-starter` | `03-render-solution` |
| 04 | CRUD dengan event delegation dan dialog | Bab 11 | `04-crud-starter` | `04-crud-solution` |
| 05 | Drag and drop native | Bab 12 | `05-drag-drop-starter` | `05-drag-drop-solution` |
| 06 | Status aplikasi dan optimistic update | Bab 13 | `06-optimistic-starter` | `06-optimistic-solution` |
| 07 | Refactor ke ES Modules | Bab 14 | `07-modules-starter` | `07-modules-solution` |
| 08 | Event loop dan Promise sederhana | Bab 15 | `08-promise-starter` | `08-promise-solution` |
| 09 | Final challenge: mengurutkan card | Bab 16 | `09-final-challenge-starter` | `09-final-challenge-solution` |

Branch `main` sama dengan `01-todo-starter`, yaitu titik awal pelatihan. Tugas dan
kriteria selesai setiap fitur ada di berkas `TUGAS.md` pada branch starter-nya.

## Alur Kerja

```bash
git switch 03-render-starter        # mulai fitur 03
# ... kerjakan TODO di public/js/app.js ...
git diff 03-render-starter 03-render-solution   # lihat solusi setelah mencoba

git stash                           # simpan pekerjaan sendiri bila perlu
git switch 04-crud-starter          # lanjut dari titik awal resmi fitur 04
git checkout -- db.json             # kembalikan data contoh ke kondisi awal
```

## Struktur

```text
.
├── package.json        skrip npm start, json-server 0.17.4
├── db.json             data contoh: boards, lists, cards
├── hari-1-todo/        mini proyek Todo List Hari 1 (buka index.html langsung)
├── latihan/            event loop dan Promise sederhana (mulai fitur 08)
└── public/             disajikan JSON Server di http://localhost:3000
    ├── index.html
    ├── brand/          aset brand Inixindo Bandung (logo, footer, font)
    ├── css/style.css
    └── js/             app.js (fitur 02-06), delapan module (fitur 07-09)
```

## Aset Brand

Tampilan memakai aset resmi dari folder `brand/` Inixindo Bandung: `logo-mark.svg`
(favicon dan header), `footer-lockup.svg` dan `footer.css` (footer), serta token warna di
`public/brand/brand.css`. Font Poppins dan Montserrat di-host sendiri agar aplikasi tetap
berjalan tanpa internet. Keduanya berlisensi SIL Open Font License 1.1 (lihat
`public/brand/fonts/OFL-*.txt`).

## Keamanan dan Konvensi Kode

Kode mengikuti OWASP Secure Coding Practices untuk sisi frontend:

- data selalu lewat `textContent`, `innerHTML` hanya untuk template statis (mencegah XSS);
- Content Security Policy di setiap `index.html` (`default-src 'self'`, tanpa inline);
- pesan error umum untuk pengguna, detail teknis hanya di Console;
- validasi judul di JavaScript, tombol submit nonaktif selama request, rollback per card.

> **Jangan deploy aplikasi ini ke internet apa adanya.** JSON Server tidak memiliki
> autentikasi, otorisasi, maupun validasi (OWASP Top 10 A01, A04, A07), dan versi 0.17
> tidak lagi dikembangkan (A06). Proyek ini hanya untuk belajar di mesin lokal.

Gaya kode mengikuti *JavaScript in the Industry* (Simon Høiberg): deklaratif tanpa mutasi,
guard clause tanpa `else`, object lookup, tanpa class, named export, dan nama variabel
yang lengkap.

## Catatan untuk Instruktur

Branch `*-solution` berisi jawaban latihan dan final challenge. Bagikan akses repo kepada
peserta setelah sesi terkait selesai, atau bagikan hanya branch starter.
