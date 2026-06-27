"use client";

import React, { useState, useEffect } from "react";
import { X, Code2, Sun, Moon, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

// Pastikan untuk mengimpor gambar latar belakang jejak kaki yang baru saja dibuat
// Asumsikan gambar disimpan di folder assets/footprints-pattern.png
// import footprintsPattern from "./assets/footprints-pattern.png"; // Atur path sesuai struktur proyek Anda

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Load and apply theme on mount
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial theme set
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skill", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" }
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
        <div className="w-full px-6 md:px-12 flex items-center justify-between relative">

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
            <span className="hidden md:block text-sm font-mono font-medium tracking-wide">Menu</span>
          </button>

          {/* TENGAH: Logo (Absolute Center) */}
          <a
            href="#hero"
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 group cursor-pointer"
          >

            <span className="font-mono font-bold text-lg tracking-wider text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              Ikhsan Wahyu utomo
            </span>
          </a>

          {/* KANAN: Theme Switcher & CTA */}
          <div className="flex items-center gap-3 md:gap-6 z-10">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-900 text-[var(--text-muted)] hover:text-cyan-500 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => handleNavClick("#contact")}
              className="flex items-center gap-2 group text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <span className="text-sm font-mono font-medium tracking-wide">Hubungi</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────── */}
      {/* MENU FULL-SCREEN (Tampil saat isOpen === true)            */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 bg-[var(--background)] flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
          }`}
      >
        {/* Tambahkan div latar belakang jejak kaki yang berulang di sini */}
        <div
          className="absolute inset-0 z-[-1] opacity-10 bg-repeat bg-[url('/assets/footprints-pattern.png')]"
          style={{ backgroundImage: `url('/assets/footprints-pattern.png')` }}
        />

        {/* Header di dalam Full-Screen Menu */}
        <div className="w-full px-6 md:px-12 py-6 flex items-center justify-between">

          {/* Kiri: Tombol Close (Sesuai Referensi) */}
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 group text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <X className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
            <span className="text-sm font-mono font-semibold tracking-wide">Close</span>
          </button>

          {/* Tengah: Logo Teks */}
          <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer">
            <span className="font-mono font-bold text-lg tracking-wider text-[var(--foreground)]">
              Ikhsan Wahyu Utomo
            </span>
          </div>

          {/* Kanan: CTA Hubungi */}
          <button
            onClick={() => handleNavClick("#contact")}
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
                  handleNavClick(item.href);
                }}
                className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] font-bold tracking-tight text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 hover:scale-105 transition-all duration-300 leading-none z-10"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};