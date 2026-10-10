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
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] font-sans transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
