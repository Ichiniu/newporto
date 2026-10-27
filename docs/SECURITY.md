# Pengamanan portofolio

## Sebelum merilis perubahan form

1. Masuk ke dashboard Web3Forms milik pemilik form. Pilih form yang sesuai dengan `NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN`, lalu aktifkan **hCaptcha** pada pengaturan **Block Spam**. Ini wajib agar permintaan langsung tanpa CAPTCHA juga ditolak oleh penyedia. Pemasangan widget saja tidak menjamin perlindungan server.
2. Pertahankan access key Web3Forms di environment Vercel. Key ini memang publik untuk pengiriman form; jangan menaruh password akun atau secret administratif dalam variabel `NEXT_PUBLIC_*`.
3. Deploy build terbaru ke Vercel. Perubahan lokal tidak mengamankan deployment lama.
4. Cek widget CAPTCHA di desktop/mobile, kirim satu pesan uji secara manual, dan pastikan pesan diterima. Coba kedaluwarsa/retry dan tombol kirim pesan lain. Tes otomatis menggunakan mock dan tidak mengirim email.

Panduan resmi: https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha

## Pengujian lokal hCaptcha

Jalankan `npm run dev`, lalu buka http://portfolio.localhost:3000/#contact (sesuaikan port jika server memakai port lain). Browser modern mengarahkan hostname `.localhost` ke komputer sendiri, tanpa mengubah DNS produksi atau file hosts Windows.

hCaptcha menolak hostname `localhost` dan `127.0.0.1`. Jika konsol menampilkan `Warning: localhost detected. Please use a valid host.`, gunakan alamat di atas. Memilih gambar pada domain produksi merupakan alur verifikasi normal. Jangan mengganti site key produksi dengan test key atau melewati pemeriksaan token untuk mengatasi masalah lokal.

Referensi: https://docs.hcaptcha.com/#local-development

## Perlindungan di kode

- Next.js dan eslint-config-next diperbarui ke 16.4.2 dengan lockfile baru.
- hCaptcha memakai site key publik resmi Web3Forms. Paket React resmi mengelola pemuatan dan pembersihan widget.
- Honeypot, batas panjang kolom, pemangkasan whitespace, penguncian pengiriman ganda, timeout, serta CAPTCHA baru setelah setiap upaya kirim.
- Validasi Gmail dan batas panjang di browser adalah bantuan pengguna, bukan aturan keamanan server. CAPTCHA tetap harus diwajibkan di dashboard penyedia. Pemeriksaan Gmail tidak memverifikasi kepemilikan alamat email.
- CSP membatasi sumber resource, iframe, objek, dan tujuan koneksi. Inline script/style masih diizinkan agar prerender Next.js dan animasi tetap bekerja; CSP ini tidak menghilangkan seluruh risiko XSS. `unsafe-eval` hanya tersedia saat development.
- Anti-iframe (`frame-ancestors`/`X-Frame-Options`), `nosniff`, referrer policy, pembatasan kamera/mikrofon/lokasi/pembayaran, dan HSTS produksi.

## Pemeriksaan

```sh
node scripts/check-security.mjs
npx tsc --noEmit --incremental false
npm run build
npm audit --omit=dev
npm audit
```

Pada pembaruan 23 Oktober 2026, audit produksi tidak melaporkan kerentanan. Audit lengkap masih melaporkan 5 temuan high dari satu rantai dependency lint: `braces` → `micromatch` → `fast-glob` → `@next/eslint-plugin-next` → `eslint-config-next`. Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm. Tidak ada patch kompatibel yang ditawarkan; jangan menggunakan `npm audit fix --force` yang mendowngrade eslint-config-next ke 14.x. Rantai ini digunakan saat lint, bukan menerima input pengunjung. Jalankan lint hanya pada checkout tepercaya dan pantau pembaruan upstream.

Aktifkan MFA pada akun GitHub, Vercel, penyedia domain, dan Web3Forms bila tersedia. Pengaturan akun, WAF/rate limit penyedia, dan akses anggota proyek tidak dapat diverifikasi dari repository ini.
