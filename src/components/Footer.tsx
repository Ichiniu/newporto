import React from "react";
import { Code2, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-surface-soft)] py-12 px-6 md:px-12 xl:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-text " />
          <span className="font-mono font-bold text-sm tracking-wider text-[var(--color-text)]" suppressHydrationWarning>
            ICHSAN.DEV &copy; {new Date().getFullYear()}
          </span>
        </div>

        {/* Note */}
        <p className="text-xs text-[var(--color-text)] font-mono text-center md:text-left">
          {t("createdBy")}
        </p>

        {/* Scroll back to top */}
        <button
          onClick={handleScrollTop}
          className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-text  transition-all cursor-pointer group"
          title={t("backToTop")}
          id="btn-scroll-top"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>

      </div>
    </footer>
  );
};
