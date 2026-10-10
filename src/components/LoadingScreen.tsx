"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { createIntroPlayback, type IntroState } from "@/lib/introPlayback";
import styles from "./LoadingScreen.module.css";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { lang } = useLanguage();
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const playback = useRef<ReturnType<typeof createIntroPlayback> | null>(null);
  const [state, setState] = useState<IntroState>("loading");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const id = lang === "id";

  useEffect(() => {
    if (!video.current) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const content = document.getElementById("portfolio-content");
    const overflow = document.body.style.overflow;
    const wasInert = content?.inert ?? false;
    const ariaHidden = content?.getAttribute("aria-hidden") ?? null;
    document.body.style.overflow = "hidden";
    if (content) { content.inert = true; content.setAttribute("aria-hidden", "true"); }
    overlay.current?.focus({ preventScroll: true });
    const session = createIntroPlayback({
      video: video.current,
      source: "/assets/intro/walking-intro.mp4",
      onState: setState,
      onProgress: setProgress,
      onComplete,
    });
    playback.current = session;
    return () => {
      session.dispose();
      playback.current = null;
      document.body.style.overflow = overflow;
      if (content) {
        content.inert = wasInert;
        if (ariaHidden === null) content.removeAttribute("aria-hidden");
        else content.setAttribute("aria-hidden", ariaHidden);
      }
      const focusTarget = previousFocus?.isConnected && previousFocus !== document.body
        ? previousFocus : content?.querySelector<HTMLElement>("a, button");
      focusTarget?.focus({ preventScroll: true });
    };
  }, [onComplete]);

  const status = state === "loading" ? (id ? "Menyiapkan intro" : "Preparing intro")
    : state === "leaving" ? (id ? "Selamat datang" : "Welcome")
    : (id ? "Sebuah langkah awal" : "Every journey begins with a step");

  return (
    <div
      ref={overlay}
      tabIndex={-1}
      className={`${styles.overlay} ${state === "leaving" ? styles.leaving : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      onKeyDown={event => {
        if (event.key === "Escape") playback.current?.skip();
      }}
      onPointerMove={event => {
        if (event.pointerType !== "mouse" || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        stage.current?.style.setProperty("--intro-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 16}px`);
        stage.current?.style.setProperty("--intro-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 10}px`);
      }}
      onPointerLeave={() => {
        stage.current?.style.setProperty("--intro-x", "0px");
        stage.current?.style.setProperty("--intro-y", "0px");
      }}
    >
      <div className={styles.header}>
        <span className={styles.brand}>CREATIVE DEVELOPER / PORTFOLIO</span>
      </div>
      <div className={styles.content}>
        <div className={styles.greeting}>
          <h1 id="intro-title" className={styles.title}>{id ? "Mulai dari satu langkah." : "It starts with a step."}</h1>
        </div>
        <div ref={stage} className={`${styles.stage} ${ready ? styles.ready : ""}`}>
          <video ref={video} className={styles.video} muted playsInline preload="none" disablePictureInPicture
            aria-hidden="true" tabIndex={-1} onLoadedData={() => setReady(true)} />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.status}>
          <span aria-live="polite">{status}</span><span aria-hidden="true">{Math.round(progress)}%</span>
        </div>
        <div className={styles.track} role="progressbar" aria-label={id ? "Progres intro" : "Intro progress"}
          aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.fill} style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </div>
  );
}
