"use client";

import React, { useState, useEffect } from "react";
import { X, Code2, Languages, ArrowRight, Home, User, Cpu, Briefcase } from "lucide-react";
import { Button } from "./ui/Button";
import { MobileMenu } from "./MobileMenu";
import { useLanguage } from "@/context/LanguageContext";

// Pastikan untuk mengimpor gambar latar belakang jejak kaki yang baru saja dibuat
// Asumsikan gambar disimpan di folder assets/footprints-pattern.png
// import footprintsPattern from "./assets/footprints-pattern.png"; // Atur path sesuai struktur proyek Anda

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock/unlock body scroll saat menu terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navItems = [
    { label: t("home"), mobileLabel: t("home"), href: "#hero", icon: Home },
    { label: t("about"), mobileLabel: t("about"), href: "#about", icon: User },
    { label: t("skills"), mobileLabel: t("skills"), href: "#skills", icon: Cpu },
    { label: t("projects"), mobileLabel: t("projects"), href: "#projects", icon: Code2 },
    { label: t("experience"), mobileLabel: t("experience"), href: "#experience", icon: Briefcase }
  ];

  // Fungsi utilitas untuk scroll & tutup menu
  const handleNavClick = (href: string) => {
    setIsOpen(false);
    // Tambahkan sedikit delay agar animasi tutup selesai sebelum scroll (opsional)
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      {/* ───────────────────────────────────────────────────────── */}
      {/* HEADER UTAMA (Tampil saat menu tertutup)                  */}
      {/* ───────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled
          ? "py-4 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--card-border)] shadow-md shadow-slate-200/50 dark:shadow-black/30"
          : "py-6 bg-transparent"
          }`}
      >
        {/* DESKTOP HEADER (Lebar layar md ke atas - pertahankan konsep lama) */}
        <div className="hidden md:flex w-full px-12 items-center justify-between relative">
          {/* KIRI: Tombol Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 group text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors z-10"
            aria-label="Open Menu"
          >
            <div className="flex flex-col gap-[5px] justify-center">
              <span className="w-5 h-[1.5px] bg-current block transition-all group-hover:w-6"></span>
              <span className="w-5 h-[1.5px] bg-current block transition-all"></span>
            </div>
            <span className="text-sm font-mono font-medium tracking-wide">{t("menu")}</span>
          </button>

          {/* TENGAH: Logo (Absolute Center) */}
          <a
            href="#hero"
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 group cursor-pointer whitespace-nowrap"
          >
            <span className="font-mono font-bold text-lg tracking-wider text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              Ichsan Wahyu Utomo
            </span>
          </a>

          {/* KANAN: Theme Switcher & CTA */}
          <div className="flex items-center gap-6 z-10">
            <button
              onClick={toggleLanguage}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 text-[var(--text-muted)] hover:text-cyan-600 transition-all cursor-pointer font-mono text-xs font-bold shadow-sm"
              aria-label="Change Language"
            >
              <Languages className="w-4 h-4 text-cyan-600 transition-transform group-hover:scale-110" />
              <span className="w-5 text-left">{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => handleNavClick("#contact")}
              className="flex items-center gap-2 group text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <span className="text-sm font-mono font-medium tracking-wide">{t("contact")}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* MOBILE HEADER (Lebar layar di bawah md) */}
        <div className="flex md:hidden w-full px-6 items-center justify-between relative">
          {/* KIRI: Logo */}
          <a href="#hero" className="cursor-pointer">
            <span className="font-mono font-bold text-base tracking-wider text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              Ichsan
            </span>
          </a>

          {/* KANAN: Theme Switcher & CTA */}
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={toggleLanguage}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 text-[var(--text-muted)] hover:text-cyan-600 transition-all cursor-pointer font-mono text-xs font-bold shadow-sm"
              aria-label="Change Language"
            >
              <Languages className="w-4 h-4 text-cyan-600 transition-transform group-hover:scale-110" />
              <span className="w-5 text-left">{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => handleNavClick("#contact")}
              className="flex items-center gap-2 group text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <span className="text-sm font-mono font-medium tracking-wide">{t("contact")}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* BOTTOM FLOATING NAV BAR (Mobile only, di bawah md) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[420px] bg-[var(--card-bg)]/80 backdrop-blur-lg border border-[var(--card-border)] rounded-2xl py-2 px-3 shadow-lg shadow-slate-200/50 dark:shadow-black/40">
        <nav className="flex items-center justify-around w-full gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll langsung ke target elemen
                  const element = document.querySelector(item.href);
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[var(--text-muted)] hover:text-cyan-500 hover:bg-cyan-500/10 active:bg-cyan-500/10 transition-all cursor-pointer min-w-[56px]"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] min-[360px]:text-[10px] font-mono font-bold leading-none">{item.mobileLabel}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Menu Navigasi Fullscreen (Diaktifkan lewat menu Desktop) */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navItems={navItems}
        onNavClick={handleNavClick}
      />
    </>
  );
};