"use client";

import { useEffect, useRef } from "react";
import { advanceCrowd, createCrowd, position, type Walker } from "@/lib/menuCrowd";
import { readPalette } from "@/lib/palette";
import { footPose, projectLimb, walkerScale } from "@/lib/menuGait";

type Sprite = HTMLCanvasElement;
type Outfit = { body: Sprite; head: Sprite; leg: Sprite; arm: Sprite; shoe: Sprite; liftedShoe: Sprite };

function sprite(width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const image = document.createElement("canvas");
  image.width = width;
  image.height = height;
  const ctx = image.getContext("2d")!;
  paint(ctx);
  return image;
}

/** Blur is baked into small reusable sprites, never recomputed per animation frame. */
function wardrobe(): Outfit[] {
  const colors = readPalette();
  return [colors.sage, colors.olive, colors.sage, colors.pistachio].map((cloth, index) => {
    const body = sprite(180, 220, ctx => {
      ctx.filter = "blur(23px)";
      ctx.fillStyle = cloth;
      ctx.globalAlpha = 0.24;
      ctx.beginPath();
      ctx.ellipse(90, 110, 35 + index * 2, 57, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    const head = sprite(120, 120, ctx => {
      ctx.filter = "blur(20px)";
      ctx.fillStyle = colors.olive;
      ctx.globalAlpha = 0.14;
      ctx.beginPath();
      ctx.ellipse(60, 60, 21, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    const limb = (color: string, alpha: number) => sprite(80, 180, ctx => {
      ctx.filter = "blur(10px)";
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(40, 25);
      ctx.lineTo(40, 155);
      ctx.stroke();
    });
    const shoe = (blur: number) => sprite(100, 140, ctx => {
      ctx.translate(50, 70);
      ctx.filter = `blur(${blur}px)`;
      const ink = ctx.createLinearGradient(-17, -35, 19, 37);
      ink.addColorStop(0, index % 2 ? colors.olive : colors.sage);
      ink.addColorStop(1, colors.olive);
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(-10, 26);
      ctx.bezierCurveTo(-14, 15, -9, 6, -13, -5);
      ctx.bezierCurveTo(-20, -24, -13, -38, 1, -39);
      ctx.bezierCurveTo(17, -39, 21, -26, 15, -10);
      ctx.bezierCurveTo(10, 5, 11, 16, 10, 26);
      ctx.bezierCurveTo(8, 34, -8, 34, -10, 26);
      ctx.fill();
    });
    return { body, head, leg: limb(index % 2 ? colors.sage : colors.olive, 0.24),
      arm: limb(cloth, 0.12), shoe: shoe(3), liftedShoe: shoe(13) };
  });
}

export function MenuWalkers({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!active || !canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let outfits: Outfit[] | undefined;
    let frame = 0, lastTime = 0, width = 0, height = 0;
    let crowd = createCrowd(1, 1);
    const smooth = (v: number) => { const p = Math.max(0, Math.min(1, v)); return p * p * (3 - 2 * p); };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width === width && bounds.height === height) return;
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crowd = createCrowd(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const drawLimb = (image: Sprite, x1: number, y1: number, x2: number, y2: number) => {
      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2);
      ctx.drawImage(image, -40, -12, 80, Math.hypot(x2 - x1, y2 - y1) + 24);
      ctx.restore();
    };

    const drawWalker = (person: Walker) => {
      const p = position(person);
      const scale = walkerScale(width, height, person.size);
      if (p.x < -210 * scale || p.x > width + 210 * scale ||
          p.y < -270 * scale || p.y > height + 270 * scale) return;
      const outfit = outfits![person.outfit];
      const dx = person.endX - person.startX, dy = person.endY - person.startY;
      const speed = Math.hypot(dx, dy) / person.duration / scale;
      const distance = Math.hypot(dx, dy);
      const directionX = dx / distance, directionY = dy / distance;
      const stride = speed * person.period;
      const cycle = person.age / person.period + person.phase;
      const sway = Math.sin(cycle * Math.PI * 2) * 2;
      const bob = Math.cos(cycle * Math.PI * 4) * 1.5;
      const project = (side: number, forward: number, z: number) => projectLimb(
        p.x + (directionX * forward - directionY * side) * scale,
        p.y + (directionY * forward + directionX * side) * scale,
        z * scale, width, height,
      );
      // Initial residents are visible immediately; later safety arrivals dissolve in.
      const fade = person.born === 0 ? 1 : smooth((crowd.clock - person.born) / 1.2);
      ctx.save();
      ctx.globalAlpha = fade;
      const torso = project(sway, 0, 122 + bob);
      const head = project(sway, 3, 184 + bob);
      // The body stays upright in perspective, rather than rotating flat on the floor.
      ctx.save();
      ctx.translate(torso.x, torso.y);
      ctx.rotate(Math.atan2(head.x - torso.x, torso.y - head.y));
      ctx.drawImage(outfit.body, -90 * scale * person.build, -110 * scale,
        180 * scale * person.build, 220 * scale);
      ctx.restore();
      ctx.drawImage(outfit.head, head.x - 60 * scale, head.y - 60 * scale, 120 * scale, 120 * scale);
      for (let index = 0; index < 2; index++) {
        const side = index === 0 ? -1 : 1;
        const { forward, lift } = footPose(cycle, side, stride);
        const foot = project(side * 17 * person.build, forward, lift * 48);
        const hip = project(side * 13 + sway, 0, 86 + bob);
        const knee = project(side * 16, forward * 0.5 + lift * 14, 47 + lift * 23);
        const shoulder = project(side * 25 + sway, 0, 149 + bob);
        const hand = project(side * 32, -forward * 0.34, 91 + bob);
        // Draw in screen space: bones recede with height, feet stay on the floor.
        ctx.save();
        ctx.scale(scale, scale);
        drawLimb(outfit.leg, hip.x / scale, hip.y / scale, knee.x / scale, knee.y / scale);
        drawLimb(outfit.leg, knee.x / scale, knee.y / scale, foot.x / scale, foot.y / scale);
        drawLimb(outfit.arm, shoulder.x / scale, shoulder.y / scale, hand.x / scale, hand.y / scale);
        ctx.restore();
        ctx.save();
        ctx.translate(foot.x, foot.y);
        ctx.rotate(Math.atan2(directionX, -directionY) + side * 0.06);
        ctx.scale(side * scale * foot.depth, scale * foot.depth * (1 - lift * 0.35));
        // Contact is dark and defined; lifted soles dissolve into the frosted glass.
        ctx.globalAlpha = fade * 0.88 * (1 - lift) ** 2;
        ctx.drawImage(outfit.shoe, -50, -70);
        ctx.globalAlpha = fade * 0.3 * lift;
        ctx.drawImage(outfit.liftedShoe, -50, -70);
        ctx.restore();
      }
      ctx.restore();
    };

    const animate = (now: number) => {
      frame = 0;
      if (motion.matches || document.hidden) return;
      // Four cached characters are cheap enough to render on every display frame.
      // Follow the refresh rate without the uneven pacing of a 30 fps skip gate.
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      advanceCrowd(crowd, delta);
      ctx.clearRect(0, 0, width, height);
      for (const person of [...crowd.walkers].sort((a, b) => a.size - b.size)) drawWalker(person);
      frame = requestAnimationFrame(animate);
    };

    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (motion.matches) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      if (document.hidden) return;
      outfits ??= wardrobe();
      frame = requestAnimationFrame(animate);
    };
    syncPlayback();
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }} />;
}
