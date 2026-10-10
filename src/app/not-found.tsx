import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <p className="font-mono text-text ">404</p>
      <h1 className="text-4xl font-bold">Halaman tidak ditemukan</h1>
      <p className="text-[var(--color-text)]">Kembali ke beranda untuk melihat profil dan proyek saya.</p>
      <Link href="/" className="rounded-xl button-primary px-6 py-3 font-semibold border border-primary">
        Kembali ke beranda
      </Link>
    </main>
  );
}
