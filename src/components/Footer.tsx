import React from "react";
import { Code2, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border-subtle)] py-12 px-6 md:px-12 xl:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-mono font-bold text-sm tracking-wider text-[var(--foreground)]" suppressHydrationWarning>
            ICHSAN.DEV &copy; {new Date().getFullYear()}
          </span>
        </div>

        {/* Note */}
        <p className="text-xs text-[var(--text-muted)] font-mono text-center md:text-left">
          {t("createdBy")}
        </p>

        {/* Scroll back to top */}
        <button
          onClick={handleScrollTop}
          className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-cyan-500/30 text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-all cursor-pointer group"
          title={t("backToTop")}
          id="btn-scroll-top"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>

      </div>
    </footer>
  );
};
