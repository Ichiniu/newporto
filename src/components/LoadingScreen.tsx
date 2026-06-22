"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ═══════════════════════════════════════════════════════════
LOADING SCREEN — Endless Runner (Dino Game Style)
Visual: Bola Holographic Iridescent, Batu Semi-Hitam, Teks Goals
═══════════════════════════════════════════════════════════ */

const DURATION = 6;

// Daftar goals/tujuan yang muncul di bola
const GOALS = ["Dream", "Build", "Create", "Grow", "Ship"];

/* ── Helper: buat canvas texture bertulisan ── */
function makeGoalTexture(text: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Transparan background
  ctx.clearRect(0, 0, size, size);

  // Teks
  ctx.font = "bold 52px 'Helvetica Neue', Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Shadow tipis biar mudah dibaca
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(text, size / 2, size / 2);

  return new THREE.CanvasTexture(canvas);
}

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;

    const isDark = document.documentElement.classList.contains("dark");
    const bgHex = isDark ? 0x030712 : 0xf8fafc;

    /* ── Renderer & Scene ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // ringan: cap 1.5
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(bgHex);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(bgHex, 0.04);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 3.5, 12);
    camera.lookAt(0, 0.3, 0);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.5 : 0.7));

    const dir = new THREE.DirectionalLight(0xffffff, isDark ? 0.9 : 1.2);
    dir.position.set(4, 8, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(512, 512);
    scene.add(dir);

    // Accent light biru/ungu buat efek iridescent
    const accentLight1 = new THREE.PointLight(0x38bdf8, isDark ? 1.2 : 0.9, 8);
    accentLight1.position.set(-3, 2, 3);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xa855f7, isDark ? 1.0 : 0.7, 8);
    accentLight2.position.set(3, 1, 2);
    scene.add(accentLight2);

    const accentLight3 = new THREE.PointLight(0x34d399, isDark ? 0.8 : 0.5, 6);
    accentLight3.position.set(0, -1, 4);
    scene.add(accentLight3);

    /* ── Awan (low-poly, ringan) ── */
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x334155 : 0xffffff,
      roughness: 1,
      flatShading: true,
    });

    const createCloud = (x: number, y: number, z: number, scale: number) => {
      const group = new THREE.Group();
      // Pakai octahedron buat flat look lebih ringan
      const p1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), cloudMat);
      const p2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 1), cloudMat);
      p2.position.set(0.55, -0.18, 0);
      const p3 = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 1), cloudMat);
      p3.position.set(-0.48, -0.1, 0);
      group.add(p1, p2, p3);
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      return group;
    };

    const clouds = new THREE.Group();
    clouds.add(createCloud(5, 3, -4, 1));
    clouds.add(createCloud(12, 4, -5, 0.8));
    clouds.add(createCloud(19, 2.5, -3, 1.1));
    scene.add(clouds);

    /* ══════════════════════════════════════════
       BOLA HOLOGRAPHIC IRIDESCENT
       Trick: MeshPhysicalMaterial + envMap simulasi
       + lapisan tipis transparan di atas
    ══════════════════════════════════════════ */

    // Core ball — iridescent via MeshPhysicalMaterial
    const ballGeo = new THREE.SphereGeometry(0.3, 64, 64);
    const ballMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 400],
      reflectivity: 0.95,
    });

    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0.3, 0);
    ball.castShadow = true;
    scene.add(ball);

    /* ── Goal Sprites yang mengitari bola ── */
    const goalSprites: THREE.Sprite[] = [];
    GOALS.forEach((text, i) => {
      const tex = makeGoalTexture(text);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.55, 0.28, 1);
      // Posisikan di berbagai titik di "permukaan" bola
      const angle = (i / GOALS.length) * Math.PI * 2;
      sprite.position.set(
        Math.cos(angle) * 0.01,
        Math.sin(angle) * 0.01,
        0
      );
      ball.add(sprite);
      goalSprites.push(sprite);
    });

    /* ── Rintangan Batu ── */
    const rockGeo = new THREE.DodecahedronGeometry(0.35, 0);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.3,
    });

    const rock1 = new THREE.Mesh(rockGeo, rockMat);
    rock1.position.set(15, 0.25, 0);
    rock1.castShadow = true;
    scene.add(rock1);

    const rock2 = new THREE.Mesh(rockGeo, rockMat);
    rock2.position.set(15, 0.25, 0);
    rock2.castShadow = true;
    scene.add(rock2);

    const rock3 = new THREE.Mesh(rockGeo, rockMat);
    rock3.position.set(15, 0.25, 0);
    rock3.castShadow = true;
    scene.add(rock3);

    /* ═════════════════════════════
       GSAP MASTER TIMELINE
    ═════════════════════════════ */
    const master = gsap.timeline();
    const counter = { val: 0 };

    // Counter progress + fade mulai di 90%
    master.to(
      counter,
      {
        val: 100,
        duration: DURATION,
        ease: "none",
        onUpdate: () => {
          const p = Math.floor(counter.val);
          if (percentRef.current) percentRef.current.textContent = `${p}%`;
          if (barRef.current) barRef.current.style.width = `${p}%`;

          // ── Fade out overlay mulai dari 90% ──
          if (p >= 90 && overlayRef.current) {
            const fadeProgress = (p - 90) / 10; // 0 → 1 selama 90-100%
            overlayRef.current.style.opacity = String(
              Math.max(0, 1 - fadeProgress * fadeProgress) // easing curve
            );
          }
        },
      },
      0
    );

    /* Awan bergerak kiri */
    gsap.to(clouds.position, { x: -18, duration: 6, repeat: -1, ease: "none" });

    /* Bola berputar di tempat (lebih smooth) */
    master.to(
      ball.rotation,
      { z: -(Math.PI * 2) * 12, duration: DURATION, ease: "sine.inOut" },
      0
    );
    // Sedikit rotasi Y biar iridescence keliatan
    master.to(
      ball.rotation,
      { y: Math.PI * 4, duration: DURATION, ease: "sine.inOut" },
      0
    );

    /* Accent lights bergerak memutar (buat efek iridescent hidup) */
    gsap.to(accentLight1.position, {
      x: 3,
      z: -3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(accentLight2.position, {
      x: -3,
      z: 3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(accentLight3.position, {
      y: 2,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    /* Goal sprite muncul bergantian */
    const goalDelay = DURATION / GOALS.length;
    goalSprites.forEach((sprite, i) => {
      master.to(
        sprite.material,
        { opacity: 0.88, duration: 0.3, ease: "power2.out" },
        i * goalDelay + 0.3
      );
      master.to(
        sprite.material,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        i * goalDelay + goalDelay - 0.1
      );
    });

    /* ── BATU + LOMPAT ── */
    // BATU 1 — start t=0.5s
    master.to(rock1.position, { x: -15, duration: 3, ease: "none" }, 0.5);
    master.to(rock1.rotation, { x: -Math.PI * 4, duration: 3, ease: "none" }, 0.5);
    master.to(
      ball.position,
      { y: 1.5, duration: 0.38, ease: "power2.out" },
      0.5 + 1.15
    );
    master.to(
      ball.position,
      { y: 0.3, duration: 0.38, ease: "power3.in" },
      0.5 + 1.53
    );

    // BATU 2 — start t=1.9s
    master.to(rock2.position, { x: -15, duration: 3, ease: "none" }, 1.9);
    master.to(rock2.rotation, { x: -Math.PI * 4, duration: 3, ease: "none" }, 1.9);
    master.to(
      ball.position,
      { y: 1.5, duration: 0.38, ease: "power2.out" },
      1.9 + 1.15
    );
    master.to(
      ball.position,
      { y: 0.3, duration: 0.38, ease: "power3.in" },
      1.9 + 1.53
    );

    // BATU 3 — start t=3.3s
    master.to(rock3.position, { x: -15, duration: 3, ease: "none" }, 3.3);
    master.to(rock3.rotation, { x: -Math.PI * 4, duration: 3, ease: "none" }, 3.3);
    master.to(
      ball.position,
      { y: 1.5, duration: 0.38, ease: "power2.out" },
      3.3 + 1.15
    );
    master.to(
      ball.position,
      { y: 0.3, duration: 0.38, ease: "power3.in" },
      3.3 + 1.53
    );

    /* ── COMPLETE callback setelah progress selesai ── */
    master.call(
      () => {
        // Pastikan overlay sudah 0 lalu panggil onComplete
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power1.out",
          onComplete: () => {
            renderer.dispose();
            onComplete();
          },
        });
      },
      [],
      DURATION + 0.05
    );

    /* ── Render Loop ── */
    let animId: number;
    let lastTime = 0;
    const TARGET_FPS = 60;
    const FRAME_MS = 1000 / TARGET_FPS;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      if (time - lastTime < FRAME_MS - 1) return; // throttle ringan
      lastTime = time;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      master.kill();
      gsap.killTweensOf([
        clouds.position,
        accentLight1.position,
        accentLight2.position,
        accentLight3.position,
      ]);
      goalSprites.forEach((s) => {
        s.material.map?.dispose();
        s.material.dispose();
      });
      ballMat.dispose();
      ballGeo.dispose();
      rockGeo.dispose();
      rockMat.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <div ref={overlayRef} className="ls-overlay">
      <div ref={canvasRef} className="ls-canvas" />
      <div className="ls-ui">
        <div className="ls-greeting">
          <span className="ls-hello">Hello,</span>
          <span className="ls-welcome">
            welcome to{" "}
            <strong className="ls-name">Ikhsan Wahyu Utomo</strong>
          </span>
        </div>
        <div className="ls-bottom">
          <span ref={percentRef} className="ls-percent">
            0%
          </span>
          <div className="ls-bar-wrap">
            <div ref={barRef} className="ls-bar-fill" />
          </div>
          <span className="ls-label">Memuat</span>
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
};

const styles = `
  .ls-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--background, #f8fafc);
    overflow: hidden;
    /* opacity dikendalikan inline oleh GSAP */
  }

  .ls-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .ls-canvas canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }

  .ls-ui {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 5vh 0 6vh;
    pointer-events: none;
    z-index: 2;
  }

  .ls-greeting {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .ls-hello {
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    color: var(--text-muted, #8b7e6a);
    font-family: "Playfair Display", serif;
  }

  .ls-welcome {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    color: var(--foreground, #3a3226);
    font-family: "Playfair Display", serif;
    font-style: italic;
  }

  .ls-name {
    font-weight: 700;
    font-style: normal;
    color: var(--primary, #3a3226);
  }

  .ls-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  .ls-percent {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    font-weight: 300;
    color: var(--foreground, #3a3226);
    line-height: 1;
  }

  .ls-bar-wrap {
    width: min(240px, 50vw);
    height: 2px;
    background: var(--card-border, #e0d8c4);
    border-radius: 99px;
    overflow: hidden;
  }

  .ls-bar-fill {
    height: 100%;
    width: 0%;
    border-radius: 99px;
    background: linear-gradient(
      90deg,
      var(--primary, #0891b2),
      var(--accent, #9333ea)
    );
    transition: width 0.1s linear;
  }

  .ls-label {
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    color: var(--text-muted, #8b7e6a);
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;
  }
`;
