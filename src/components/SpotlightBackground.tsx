"use client";

import React, { useEffect, useRef } from "react";

export interface SpotlightBackgroundProps {
  /** ID elemen konten yang akan di-reveal oleh cahaya (default: 'hero-left-content') */
  targetContentId?: string;
  /** Radius area cahaya di sekitar kursor dalam px (default: 320) */
  radius?: number;
  /** Kecepatan lerp / kelicinan gerakan cahaya (0.05 = sangat halus, 0.12 = cepat) */
  lerpSpeed?: number;
  /** Opacity cahaya (0.15 - 0.35) */
  lightOpacity?: number;
  className?: string;
}

export const SpotlightBackground: React.FC<SpotlightBackgroundProps> = ({
  targetContentId = "hero-left-content",
  radius = 320,
  lerpSpeed = 0.085,
  lightOpacity = 0.28,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamSvgRef = useRef<SVGSVGElement>(null);
  const beamPolygonRef = useRef<SVGPolygonElement>(null);
  const lightPoolCircleRef = useRef<SVGCircleElement>(null);
  const poolGradRef = useRef<SVGRadialGradientElement>(null);
  const beamGradRef = useRef<SVGLinearGradientElement>(null);
  const originCircleRef = useRef<SVGCircleElement>(null);

  // State koordinat animasi (semua di ref agar 0 re-render di React)
  const animState = useRef({
    // Origin (tombol translate)
    ox: 1300,
    oy: 50,
    // Target default (tengah judul intro)
    defaultX: 400,
    defaultY: 240,
    // Koordinat kursor target
    targetX: 400,
    targetY: 240,
    // Koordinat saat ini (lerped)
    currentX: 400,
    currentY: 240,
    // Radius saat ini
    currentR: radius,
    targetR: radius,
    // Kontrol loop & status
    isMouseInside: false,
    isMobileOrReduced: false,
    rafId: null as number | null,
    scrollOpacity: 1,
    isIntersecting: true,
  });

  useEffect(() => {
    const s = animState.current;
    if (containerRef.current) {
      containerRef.current.style.opacity = "1";
    }

    // Cek reduced motion atau mobile touch
    const checkCapabilities = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.innerWidth < 768 || window.matchMedia("(hover: none)").matches;
      s.isMobileOrReduced = reduced || mobile;

      // Pada mobile / reduced-motion: matikan mask agar semua konten terbaca 100%
      const contentEl = document.getElementById(targetContentId);
      if (contentEl && s.isMobileOrReduced) {
        contentEl.style.maskImage = "";
        contentEl.style.webkitMaskImage = "";
      }
    };
    checkCapabilities();

    // Hitung posisi origin (bawah tombol translate) dan target default (teks intro)
    const updateAnchorPositions = () => {
      const hero = containerRef.current?.parentElement || containerRef.current;
      if (!hero) return;
      const hRect = hero.getBoundingClientRect();
      if (hRect.width === 0) return;

      // 1. Tombol Translate (Origin cahaya)
      const btn = document.getElementById("btn-translate-lang");
      if (btn) {
        const bRect = btn.getBoundingClientRect();
        s.ox = bRect.left + bRect.width / 2 - hRect.left;
        s.oy = bRect.bottom + 6 - hRect.top;
      } else {
        s.ox = hRect.width * 0.88;
        s.oy = 52;
      }

      // 2. Teks Intro (Target awal)
      const content = document.getElementById(targetContentId);
      if (content) {
        const cRect = content.getBoundingClientRect();
        const h1 = content.querySelector("h1");
        const tRect = h1 ? h1.getBoundingClientRect() : cRect;
        s.defaultX = tRect.left + tRect.width * 0.45 - hRect.left;
        s.defaultY = tRect.top + tRect.height * 0.5 - hRect.top;
      } else {
        s.defaultX = hRect.width * 0.28;
        s.defaultY = hRect.height * 0.38;
      }

      // Jika mouse belum pernah masuk, target = default
      if (!s.isMouseInside) {
        s.targetX = s.defaultX;
        s.targetY = s.defaultY;
      }
    };

    updateAnchorPositions();
    s.currentX = s.targetX;
    s.currentY = s.targetY;

    // Terapkan geometri cahaya ke SVG dan mask ke elemen konten
    const renderFrame = () => {
      const { ox, oy, currentX: tx, currentY: ty, currentR: r, scrollOpacity, isMobileOrReduced } = s;

      // 1. Update elemen cahaya di SVG
      const dx = tx - ox;
      const dy = ty - oy;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len; // vektor normal tegak lurus
      const ny = dx / len;

      const wOrigin = 16;  // lebar pangkal berkas di tombol translate
      const wTarget = r * 0.82; // lebar ujung berkas saat menyentuh target

      const p1x = ox + nx * wOrigin;
      const p1y = oy + ny * wOrigin;
      const p2x = ox - nx * wOrigin;
      const p2y = oy - ny * wOrigin;
      const p3x = tx - nx * wTarget;
      const p3y = ty - ny * wTarget;
      const p4x = tx + nx * wTarget;
      const p4y = ty + ny * wTarget;

      if (beamPolygonRef.current) {
        beamPolygonRef.current.setAttribute(
          "points",
          `${p1x.toFixed(1)},${p1y.toFixed(1)} ${p4x.toFixed(1)},${p4y.toFixed(1)} ${p3x.toFixed(1)},${p3y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)}`
        );
      }

      if (beamGradRef.current) {
        beamGradRef.current.setAttribute("x1", ox.toFixed(1));
        beamGradRef.current.setAttribute("y1", oy.toFixed(1));
        beamGradRef.current.setAttribute("x2", tx.toFixed(1));
        beamGradRef.current.setAttribute("y2", ty.toFixed(1));
      }

      if (lightPoolCircleRef.current && poolGradRef.current) {
        lightPoolCircleRef.current.setAttribute("cx", tx.toFixed(1));
        lightPoolCircleRef.current.setAttribute("cy", ty.toFixed(1));
        lightPoolCircleRef.current.setAttribute("r", r.toFixed(1));

        poolGradRef.current.setAttribute("cx", tx.toFixed(1));
        poolGradRef.current.setAttribute("cy", ty.toFixed(1));
        poolGradRef.current.setAttribute("r", r.toFixed(1));
      }

      if (originCircleRef.current) {
        originCircleRef.current.setAttribute("cx", ox.toFixed(1));
        originCircleRef.current.setAttribute("cy", oy.toFixed(1));
      }

      if (beamSvgRef.current) {
        beamSvgRef.current.style.opacity = (lightOpacity * scrollOpacity).toFixed(3);
      }

      // 2. Update Mask pada Konten Kiri (Revealing text & buttons)
      const contentEl = document.getElementById(targetContentId);
      if (contentEl && !isMobileOrReduced) {
        const hero = containerRef.current?.parentElement || containerRef.current;
        if (hero) {
          const hRect = hero.getBoundingClientRect();
          const cRect = contentEl.getBoundingClientRect();
          // Koordinat lokal kursor relatif terhadap elemen konten
          const lx = tx - (cRect.left - hRect.left);
          const ly = ty - (cRect.top - hRect.top);

          // Radial mask yang mulus dan transparan ke luar
          const mask = `radial-gradient(circle ${Math.round(r)}px at ${Math.round(lx)}px ${Math.round(ly)}px, black 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.25) 78%, transparent 100%)`;
          contentEl.style.maskImage = mask;
          contentEl.style.webkitMaskImage = mask;
        }
      }
    };

    // Animasi Loop LERP
    const animate = () => {
      if (!s.isIntersecting || s.scrollOpacity <= 0) {
        s.rafId = null;
        return;
      }

      const dx = s.targetX - s.currentX;
      const dy = s.targetY - s.currentY;
      const dr = s.targetR - s.currentR;

      s.currentX += dx * lerpSpeed;
      s.currentY += dy * lerpSpeed;
      s.currentR += dr * lerpSpeed;

      renderFrame();

      const isMoving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(dr) > 0.1;
      if (isMoving || s.isMouseInside) {
        s.rafId = requestAnimationFrame(animate);
      } else {
        s.rafId = null;
      }
    };

    const startAnim = () => {
      if (s.rafId === null && s.isIntersecting) {
        s.rafId = requestAnimationFrame(animate);
      }
    };

    // Event Listener Kursor Mouse
    const onPointerMove = (e: PointerEvent) => {
      if (s.isMobileOrReduced) return;
      const hero = containerRef.current?.parentElement || containerRef.current;
      if (!hero) return;

      const hRect = hero.getBoundingClientRect();
      // Periksa apakah kursor berada dalam hero section
      if (
        e.clientX < hRect.left - 40 ||
        e.clientX > hRect.right + 40 ||
        e.clientY < hRect.top - 40 ||
        e.clientY > hRect.bottom + 40
      ) {
        return;
      }

      s.isMouseInside = true;
      s.targetX = e.clientX - hRect.left;
      s.targetY = e.clientY - hRect.top;
      s.targetR = radius;

      startAnim();
    };

    const onPointerLeave = () => {
      if (s.isMobileOrReduced) return;
      s.isMouseInside = false;
      // Saat mouse keluar hero, perlahan kembali menyorot teks headline utama
      s.targetX = s.defaultX;
      s.targetY = s.defaultY;
      s.targetR = radius;
      startAnim();
    };

    // Scroll listener (fade-out saat scroll ke section berikutnya)
    const onScroll = () => {
      const hero = containerRef.current?.parentElement || containerRef.current;
      if (!hero) return;
      const hRect = hero.getBoundingClientRect();
      const fadeDistance = hRect.height * 0.6;
      const factor = Math.max(0, Math.min(1, hRect.bottom / fadeDistance));
      s.scrollOpacity = factor;

      if (factor <= 0) {
        if (beamSvgRef.current) beamSvgRef.current.style.opacity = "0";
      } else {
        startAnim();
      }
    };

    // Keyboard accessibility: jika user Tab ke tombol/link di dalam konten, sorot elemen tersebut
    const onFocusIn = (e: FocusEvent) => {
      if (s.isMobileOrReduced) return;
      const target = e.target as HTMLElement | null;
      const content = document.getElementById(targetContentId);
      const hero = containerRef.current?.parentElement || containerRef.current;
      if (target && content && content.contains(target) && hero) {
        const tRect = target.getBoundingClientRect();
        const hRect = hero.getBoundingClientRect();
        s.targetX = tRect.left + tRect.width / 2 - hRect.left;
        s.targetY = tRect.top + tRect.height / 2 - hRect.top;
        s.targetR = radius * 1.15; // sedikit lebih lebar agar terlihat jelas
        startAnim();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        s.isIntersecting = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAnim();
        } else if (s.rafId) {
          cancelAnimationFrame(s.rafId);
          s.rafId = null;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      checkCapabilities();
      updateAnchorPositions();
      startAnim();
    }, { passive: true });
    document.addEventListener("focusin", onFocusIn, { passive: true });

    // Render frame pertama
    renderFrame();
    startAnim();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
      observer.disconnect();
      if (s.rafId) cancelAnimationFrame(s.rafId);

      // Bersihkan mask saat unmount agar konten tidak hilang
      const contentEl = document.getElementById(targetContentId);
      if (contentEl) {
        contentEl.style.maskImage = "";
        contentEl.style.webkitMaskImage = "";
      }
    };
  }, [lerpSpeed, lightOpacity, radius, targetContentId]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      style={{
        opacity: 0,
        transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* 1. Ambient Sage Halus di Latar Belakang */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 88% 8%, rgba(143,158,139,0.18) 0%, rgba(204,213,174,0.12) 40%, transparent 75%)",
          filter: "blur(48px)",
        }}
      />

      {/* 2. Berkas Cahaya Dinamis & Pool Cahaya (SVG dengan Gaussian Blur) */}
      <svg
        ref={beamSvgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: lightOpacity,
          willChange: "opacity",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradasi Berkas Sinar dari Tombol Translate ke Target */}
          <linearGradient id="spotlight-beam-grad" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8F9E8B" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#CCD5AE" stopOpacity="0.30" />
            <stop offset="75%" stopColor="#8F9E8B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8F9E8B" stopOpacity="0.08" />
          </linearGradient>

          {/* Gradasi Pool Cahaya Lembut di Sekitar Kursor */}
          <radialGradient id="spotlight-pool-grad" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CCD5AE" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#8F9E8B" stopOpacity="0.20" />
            <stop offset="75%" stopColor="#8F9E8B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8F9E8B" stopOpacity="0" />
          </radialGradient>

          {/* Blur Tepian Cahaya yang Sangat Lembut */}
          <filter id="spotlight-soft-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        <g filter="url(#spotlight-soft-blur)">
          {/* Batang Berkas Cahaya */}
          <polygon
            ref={beamPolygonRef}
            points="0,0 0,0 0,0 0,0"
            fill="url(#spotlight-beam-grad)"
          />

          {/* Lingkaran Terang Cahaya di Permukaan (Menyorot Teks) */}
          <circle
            ref={lightPoolCircleRef}
            cx="0"
            cy="0"
            r="0"
            fill="url(#spotlight-pool-grad)"
          />

          {/* Titik Sumber Cahaya di Bawah Tombol Translate */}
          <circle
            ref={originCircleRef}
            cx="0"
            cy="0"
            r="28"
            fill="#CCD5AE"
            opacity="0.6"
          />
        </g>
      </svg>

      {/* 3. Partikel Tekstur Debu Atmosfer Halus */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="spotlight-dust">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#spotlight-dust)" />
      </svg>
    </div>
  );
};

export default SpotlightBackground;
