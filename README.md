# Math Quest — Arena Collection v0.3.0

Animathics Studio. Koleksi game 3D arena, berbasis dua source HTML pengguna. Buka `index.html` melalui Chrome/Edge dengan internet. Tiap game mandiri, memakai Three.js 0.160.1 dari CDN. WASD/panah, mouse drag, joystick, E/Space untuk kunci ubin atau lompat, tergantung game.

## Koleksi

- [Arena Matriks Blox](games/matrix-blox/index.html) — Transformasi geometri (SMP/SMA)
- [Lingkaran Meteor](games/circle-meteor/index.html) — Persamaan lingkaran (SMA)
- [Portal Interseksi](games/intersection-lock/index.html) — SPLDV (SMP/SMA)
- [Vector Strike](games/vector-strike/index.html) — Vektor (SMA)
- [Laser Line](games/laser-line/index.html) — Persamaan garis (SMP)
- [Parabola Reactor](games/parabola-reactor/index.html) — Fungsi kuadrat (SMA)
- [Distance Sensors](games/distance-sensors/index.html) — Jarak dua titik (SMP/SMA)
- [Pythagoras Bridge](games/pythagoras-bridge/index.html) — Teorema Pythagoras (SMP)
- [Transform Combo](games/transform-combo/index.html) — Komposisi transformasi (SMA)
- [Optimization Vault](games/optimization-vault/index.html) — Optimasi linear bilangan bulat (SMA)
- [Trigonometric Beacon](games/trig-beacon/index.html) — Trigonometri (SMA)
- [Inequality Raid](games/inequality-raid/index.html) — Pertidaksamaan linear (SMP/SMA)
- [Feasible Zone](games/feasible-zone/index.html) — Sistem pertidaksamaan (SMA)
- [Quadratic Raid](games/quadratic-raid/index.html) — Pertidaksamaan kuadrat (SMA)

## Publikasi
Buat repo baru `animathics-math-quest` dan unggah isi folder ini (bukan ZIP). Aktifkan Pages dari branch main/root jika visibilitas dan paket akun mengizinkan. Tidak ada data siswa yang dikumpulkan.

## Pengembangan
Dua source asli berada di templates/. Game baru diturunkan dari source asli; levels.json adalah salinan data level. Kode HTML mengandung level yang aktif. Sinkronkan keduanya bila mengubah soal. Game lama dipertahankan utuh; game baru punya guard transisi, validasi target dan perbaikan input. Jangan menambah world 2.5D.

## Verifikasi
Jalankan `node scripts/validate.mjs` (Node 20+). Ini memeriksa sintaks modul JavaScript, data target dan tautan katalog, bukan uji gameplay browser penuh.

Katalog diuji melalui Chromium: 14 kartu, pencarian SPLDV, filter SMP lulus. Three.js CDN tidak dapat dijangkau dari lingkungan pengujian; gameplay 3D belum diuji di browser.
