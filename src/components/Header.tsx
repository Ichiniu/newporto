"use client";

import React, { useState, useEffect } from "react";
import { Code2, Languages, ArrowRight, Home, User, Cpu, Briefcase } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { useLanguage } from "@/context/LanguageContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isContactCollapsed, setIsContactCollapsed] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContactCollapsed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
          ? "py-4 bg-bg backdrop-blur-md border-b border-[var(--color-surface-soft)] shadow-md "
          : "py-6 bg-bg"
          }`}
      >
        {/* DESKTOP HEADER (Lebar layar md ke atas - pertahankan konsep lama) */}
        <div className="hidden md:flex w-full px-12 items-center justify-between relative">
          {/* KIRI: Tombol Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 group text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors z-10"
            aria-label="Open Menu"
            aria-expanded={isOpen}
            aria-controls="portfolio-menu"
          >
            <div className="flex flex-col gap-[5px] justify-center text-icon-primary">
              <span className="w-5 h-[1.5px] bg-current block transition-all group-hover:w-6"></span>
              <span className="w-5 h-[1.5px] bg-current block transition-all"></span>
            </div>
            <span className="text-sm font-mono font-medium tracking-wide">{t("menu")}</span>
          </button>

          {/* TENGAH: Logo (Absolute Center) */}
          <a
            href="#hero"
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 group cursor-pointer whitespace-nowrap no-underline"
            style={{ color: "var(--color-text)" }}
          >
            <span className="font-mono font-bold text-lg tracking-wider" style={{ color: "var(--color-text)" }}>
              Ikhsan Wahyu Utomo
            </span>
          </a>

          {/* KANAN: Theme Switcher & CTA */}
          <div className="flex items-center gap-6 z-10">
            <button
              onClick={toggleLanguage}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--color-surface-soft)] bg-[var(--color-bg)] hover:bg-surface-soft text-[var(--color-text)] hover:text-text transition-all cursor-pointer font-mono text-xs font-bold shadow-sm"
              id="btn-translate-desktop"
              aria-label={lang === "en" ? "Translate to Bahasa Indonesia" : "Switch to English"}
              title={lang === "en" ? "Translate to Bahasa Indonesia" : "Switch to English"}
            >
              <Languages data-tone="secondary" className="w-4 h-4 text-text transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-1 tracking-wider" suppressHydrationWarning>
                <span className={lang === "en" ? "text-primary font-black" : "opacity-40"}>EN</span>
                <span className="opacity-25 font-normal">/</span>
                <span className={lang === "id" ? "text-primary font-black" : "opacity-40"}>ID</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick("#contact")}
              className="flex items-center gap-2 group text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors"
            >
              <span className="text-sm font-mono font-medium tracking-wide">{t("contact")}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* MOBILE HEADER (Lebar layar di bawah md) */}
        <div className="flex md:hidden w-full px-4 sm:px-6 items-center justify-between relative min-h-[48px]">
          {/* KIRI: Logo */}
          <a href="#hero" className="cursor-pointer no-underline py-2" style={{ color: "var(--color-text)" }}>
            <span className="font-mono font-bold text-base tracking-wider" style={{ color: "var(--color-text)" }}>
              Ikhsan
            </span>
          </a>

          {/* KANAN: Theme Switcher & CTA */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            <button
              onClick={toggleLanguage}
              className="group flex items-center justify-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-xl border border-[var(--color-surface-soft)] bg-[var(--color-bg)] hover:bg-surface-soft text-[var(--color-text)] hover:text-text transition-all cursor-pointer font-mono text-xs font-bold shadow-sm"
              id="btn-translate-mobile"
              aria-label={lang === "en" ? "Translate to Bahasa Indonesia" : "Switch to English"}
              title={lang === "en" ? "Translate to Bahasa Indonesia" : "Switch to English"}
            >
              <Languages data-tone="secondary" className="w-4 h-4 text-text transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-1 tracking-wider" suppressHydrationWarning>
                <span className={lang === "en" ? "text-primary font-black" : "opacity-40"}>EN</span>
                <span className="opacity-25 font-normal">/</span>
                <span className={lang === "id" ? "text-primary font-black" : "opacity-40"}>ID</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick("#contact")}
              aria-label={t("contact")}
              className="flex items-center justify-center min-h-[44px] px-3 py-1.5 rounded-xl border border-[var(--color-surface-soft)] bg-[var(--color-bg)] hover:bg-surface-soft text-[var(--color-text)] hover:text-text transition-all duration-500 cursor-pointer shadow-sm group"
            >
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out flex items-center ${
                  isContactCollapsed
                    ? "max-w-0 opacity-0 -translate-x-1"
                    : "max-w-[80px] opacity-100 translate-x-0 mr-1.5"
                }`}
              >
                <span className="text-xs sm:text-sm font-mono font-medium tracking-wide whitespace-nowrap">
                  {t("contact")}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* BOTTOM FLOATING NAV BAR (Mobile only, di bawah md) */}
      <div className="md:hidden fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[420px] bg-bg/95 backdrop-blur-lg border border-[var(--color-surface-soft)] rounded-2xl py-1.5 px-2 shadow-lg">
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
                className="flex flex-col items-center justify-center gap-1 py-1 px-1.5 rounded-xl text-[var(--color-text)] hover:text-text hover:bg-surface-soft active:bg-surface-soft transition-all cursor-pointer min-w-[52px] min-h-[44px] no-underline hover:no-underline active:no-underline"
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
