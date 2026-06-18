"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Code2, Sun, Moon } from "lucide-react";
import { Button } from "./ui/Button";

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
    { label: "Hero", href: "#hero" },
    { label: "Tentang", href: "#about" },
    { label: "Skill", href: "#skills" },
    { label: "Proyek", href: "#projects" },
    { label: "Pengalaman", href: "#experience" },
    { label: "Kontak", href: "#contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "py-4 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--card-border)] shadow-md shadow-slate-200/50 dark:shadow-black/30" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-24 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#hero" 
          className="flex items-center gap-2 group cursor-pointer"
          id="logo-link"
        >
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-gray-900 transition-all">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-mono font-bold text-lg tracking-wider text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            ICHSAN.DEV
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-mono text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-500 transition-all group-hover:w-full" />
            </a>
          ))}

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-900 text-[var(--text-muted)] hover:text-cyan-500 transition-all cursor-pointer"
            aria-label="Toggle Theme"
            id="btn-theme-toggle"
          >
            {mounted ? (
              theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          <Button
            id="btn-nav-contact"
            variant="glow"
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 text-xs"
          >
            Hubungi
          </Button>
        </nav>

        {/* Right Controls Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-cyan-500 transition-all cursor-pointer"
            aria-label="Toggle Theme Mobile"
            id="btn-theme-toggle-mobile"
          >
            {mounted ? (
              theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Toggle Menu"
            id="btn-mobile-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--background)]/95 backdrop-blur-lg border-b border-[var(--card-border)] py-6 px-6 flex flex-col gap-5 shadow-2xl animate-fade-in-down">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-2 border-b border-[var(--border-subtle)]"
            >
              {item.label}
            </a>
          ))}
          <Button
            id="btn-mobile-contact"
            variant="primary"
            onClick={() => {
              setIsOpen(false);
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full"
          >
            Hubungi Saya
          </Button>
        </div>
      )}
    </header>
  );
};
