"use client";

import React from "react";
import { X, ArrowRight } from "lucide-react";

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
  return (
    <div
      className={`fixed inset-0 z-50 bg-[var(--background)] flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
    >
      {/* Latar belakang jejak kaki */}
      <div
        className="absolute inset-0 z-[-1] opacity-10 bg-repeat bg-[url('/assets/footprints-pattern.png')]"
        style={{ backgroundImage: `url('/assets/footprints-pattern.png')` }}
      />

      {/* Header Menu */}
      <div className="w-full px-6 md:px-12 py-6 flex items-center justify-between">
        {/* Kiri: Close */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 group text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <X className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
          <span className="text-sm font-mono font-semibold tracking-wide">Close</span>
        </button>

        {/* Tengah: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer whitespace-nowrap">
          <span className="font-mono font-bold text-sm sm:text-base md:text-lg tracking-wider text-[var(--foreground)]">
            <span className="inline sm:hidden">Ichsan</span>
            <span className="hidden sm:inline">Ikhsan Wahyu Utomo</span>
          </span>
        </div>

        {/* Kanan: CTA Hubungi */}
        <button
          onClick={() => onNavClick("#contact")}
          className="flex items-center gap-2 group text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <span className="text-sm font-mono font-semibold tracking-wide">Hubungi</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Konten Utama Menu (Link Raksasa di Tengah) */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto py-10">
        <nav className="flex flex-col items-center gap-2 md:gap-4 text-center my-auto">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.href);
              }}
              className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tight text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 hover:scale-105 transition-all duration-300 leading-none z-10"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
