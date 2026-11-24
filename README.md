## v0.6.1 — Mode presentasi

[Demo Nexus Rift](https://aryafilan.github.io/animathics-math-quest/games/nexus-rift/?demo=1) · pilih mode presentasi atau gunakan tombol PASS / tombol P. PASS melewati bagian aktif (tambang/alkimia, gerbang, satu pulau, satu gelombang boss). Progres demo tidak ditulis ke checkpoint normal. Game lain tidak diubah.

# Math Quest · v0.6.0

[Nexus Rift — The Last Core](https://aryafilan.github.io/animathics-math-quest/games/nexus-rift/)

One new standalone adventure links the ten curated worlds through a forge, light gate, sky corridor and final guardian. Ten original links remain intact; all 28 previous titles and their ordering are preserved (10 featured, 18 archived). Nexus Rift uses a separate engine copy, local checkpoint, and original-game links that open in new tabs. No progress is read from the original games. Run `node scripts/test-nexus.mjs` for the mission constraints. WebGL playtesting remains unverified.

# Math Quest · v0.5.1

[Mainkan katalog](https://aryafilan.github.io/animathics-math-quest/)

10 game pilihan di katalog utama, 18 game lain di arsip yang dapat dibuka. Tidak ada perubahan gameplay atau penghapusan source. Urutan pilihan:

- Quadratic Raid
- Feasible Zone
- Inequality Raid
- Transform Combo
- Skybound Transform Quest
- Lingkaran Meteor
- Bazar Alkimia SPLDV
- Laser Line
- Cosmic Navigator
- Crystal Mines

# Math Quest · v0.5.0

[Play all games](https://aryafilan.github.io/animathics-math-quest/)

28 games in one searchable catalog. Six new interactive prototypes, 18 missions, plus the original Bazar Alkimia. All earlier game paths and sources are retained. New titles: Legendary Blacksmith, Castle Siege, Harvest Kingdom, Potion Master, Pirate Expedition, Math Fortress.

New gameplay code is separated by title under `arcade/`. Shared Three.js utilities in `worlds/engine.js`; level data and pure functions in `arcade/levels.mjs`. Run `node scripts/test-arcade.mjs` for mathematical checks including tower-defense feasibility. New games are prototypes; visual and end-to-end WebGL playtesting still required. Bazar source is imported unchanged (text as supplied).

# Math Quest — v0.4.0

[Mainkan katalog](https://aryafilan.github.io/animathics-math-quest/)

Enam prototipe dunia 3D baru (24 misi): Crystal Mines, Velocity Rush, Bridge Master, Cosmic Navigator, Number Factory, Deep Blue. Tiga game referensi termasuk Skybound asli. Dua belas eksperimen lama masih ada di bagian arsip katalog; path dan source lama tidak berubah.

`worlds/missions.mjs` menyimpan data dan fungsi matematika, `worlds/engine.js` utilitas visual, `worlds/play.js` enam mekanik, `worlds/catalog.json` metadata. `node scripts/test-worlds.mjs` menguji data misi. Game menggunakan CDN Three.js. Gameplay browser belum terverifikasi; status prototipe.

<details><summary>Dokumentasi versi sebelumnya</summary>

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

</details>
