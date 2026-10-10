"use client";

import React from "react";
import { X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./MobileMenu.module.css";
import { MenuWalkers } from "./MenuWalkers";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
  onNavClick: (href: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  onNavClick,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div
      id="portfolio-menu"
      aria-hidden={!isOpen}
      inert={!isOpen}
      onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}
      className={`${styles.menu} ${isOpen ? styles.open : ""} fixed inset-0 z-50 flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
    >
      {/* Siluet melangkah di balik kaca buram, diputar ulang saat menu dibuka. */}
      <div className={styles.art} aria-hidden="true">
        <MenuWalkers active={isOpen} />
      </div>

      {/* Header Menu */}
      <div className="relative z-10 w-full px-6 md:px-12 py-6 flex items-center justify-between">
        {/* Kiri: Close */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 group text-text hover:text-text transition-colors"
        >
          <X className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
          <span className="text-sm font-mono font-semibold tracking-wide">{lang === "id" ? "Tutup" : "Close"}</span>
        </button>

        {/* Tengah: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer whitespace-nowrap">
          <span className="font-mono font-bold text-sm sm:text-base md:text-lg tracking-wider text-text">
            <span className="inline sm:hidden">Ichsan</span>
            <span className="hidden sm:inline">Ikhsan Wahyu Utomo</span>
          </span>
        </div>

        {/* Kanan: CTA Hubungi */}
        <button
          onClick={() => onNavClick("#contact")}
          className="flex items-center gap-2 group text-text hover:text-text transition-colors"
        >
          <span className="text-sm font-mono font-semibold tracking-wide">{t("contact")}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Konten Utama Menu (Link Raksasa di Tengah) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center overflow-y-auto py-10">
        <nav aria-label={lang === "id" ? "Navigasi utama" : "Main navigation"} className={`${styles.nav} flex flex-col items-center gap-2 md:gap-4 text-center my-auto`}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.href);
              }}
              className={`${styles.link} text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-[-0.055em] text-text leading-[0.92] z-10`}
            >
              <span className={styles.label}>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
