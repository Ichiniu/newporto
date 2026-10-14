"use client";

import React, { useEffect, useRef } from "react";
import { X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./MobileMenu.module.css";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

    // Load only when the menu is first opened, then reuse the same video.
    if (!video.getAttribute("src")) {
      video.src = "/assets/menu/navigation-background.mp4";
    }
    video.defaultPlaybackRate = 0.7;
    video.playbackRate = 0.7;
    video.currentTime = 0;
    let completed = false;
    let frameRequest = 0;
    const holdFinalFrame = () => {
      if (completed) return;
      completed = true;
      video.pause();
    };
    const watchFrame = (_now: number, metadata: VideoFrameCallbackMetadata) => {
      if (metadata.mediaTime >= 6.9) {
        holdFinalFrame();
        return;
      }
      frameRequest = video.requestVideoFrameCallback(watchFrame);
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (completed || document.hidden || reducedMotion.matches) {
        video.pause();
      } else {
        // A blocked autoplay must never prevent navigation from working.
        void video.play().catch(() => {});
      }
    };

    frameRequest = video.requestVideoFrameCallback(watchFrame);
    video.addEventListener("ended", holdFinalFrame);
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      video.pause();
      video.cancelVideoFrameCallback(frameRequest);
      video.removeEventListener("ended", holdFinalFrame);
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
    };
  }, [isOpen]);

  return (
    <div
      id="portfolio-menu"
      aria-hidden={!isOpen}
      inert={!isOpen}
      onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}
      className={`${styles.menu} ${isOpen ? styles.open : ""} fixed inset-0 z-50 flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
    >
      {/* Video latar diputar ulang setiap kali navigasi dibuka. */}
      <div className={styles.art} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
        />
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
          <span className="font-mono font-bold text-sm sm:text-base md:text-lg tracking-wider text-text" style={{ color: "var(--color-text)" }}>
            <span className="inline sm:hidden">Ikhsan</span>
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
