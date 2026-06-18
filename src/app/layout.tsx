import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ichsan | Fullstack Web Developer Portfolio",
  description: "Portofolio profesional Ichsan - Fullstack Web Developer yang berspesialisasi dalam membangun aplikasi web interaktif, sistem kios, dan platform modern menggunakan PHP, Next.js, dan PostgreSQL.",
  keywords: ["Ichsan", "Fullstack Developer", "CodeIgniter 4", "Next.js", "PostgreSQL", "Portfolio", "Indonesia Web Developer"],
  authors: [{ name: "Ichsan" }],
  openGraph: {
    title: "Ichsan | Fullstack Web Developer Portfolio",
    description: "Portofolio profesional Ichsan - Fullstack Web Developer berspesialisasi dalam PHP, Next.js, dan PostgreSQL.",
    url: "https://iichsan.my.id",
    siteName: "Ichsan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ichsan | Fullstack Web Developer Portfolio",
    description: "Portofolio profesional Ichsan - Fullstack Web Developer berspesialisasi dalam PHP, Next.js, dan PostgreSQL.",
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-300 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
