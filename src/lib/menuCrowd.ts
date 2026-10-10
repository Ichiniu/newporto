import { walkerScale } from "./menuGait";

export interface Walker {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  age: number;
  born: number;
  size: number;
  period: number;
  phase: number;
  outfit: number;
  build: number;
}

export interface Crowd {
  width: number;
  height: number;
  walkers: Walker[];
  minimum: number;
  maximum: number;
  clock: number;
  nextArrival: number;
  nextId: number;
  random: () => number;
}

export function position(walker: Walker, ahead = 0) {
  const progress = (walker.age + ahead) / walker.duration;
  return {
    x: walker.startX + (walker.endX - walker.startX) * progress,
    y: walker.startY + (walker.endY - walker.startY) * progress,
  };
}

export function onScreen(crowd: Crowd, walker: Walker, ahead = 0) {
  const p = position(walker, ahead);
  return p.x > 0 && p.x < crowd.width && p.y > 0 && p.y < crowd.height;
}

function arrive(crowd: Crowd, alreadyVisible: boolean) {
  const { width, height, random } = crowd;
  const range = (low: number, high: number) => low + random() * (high - low);
  const angle = range(0, Math.PI * 2);
  const dx = Math.cos(angle), dy = Math.sin(angle);
  let centerX = width * range(0.12, 0.88), centerY = height * range(0.16, 0.84);
  if (alreadyVisible && crowd.walkers.length) {
    // Spread initial residents/coverage arrivals, so the center never becomes a pile-up.
    let bestDistance = -1;
    for (let attempt = 0; attempt < 10; attempt++) {
      const x = width * range(0.12, 0.88), y = height * range(0.16, 0.84);
      const distance = Math.min(...crowd.walkers.map(walker => {
        const p = position(walker);
        return Math.hypot((p.x - x) / width, (p.y - y) / height);
      }));
      if (distance > bestDistance) {
        bestDistance = distance;
        centerX = x;
        centerY = y;
      }
    }
  }
  const edge = (vx: number, vy: number) => Math.min(
    Math.abs(vx) < 0.0001 ? Infinity : ((vx > 0 ? width + 160 : -160) - centerX) / vx,
    Math.abs(vy) < 0.0001 ? Infinity : ((vy > 0 ? height + 160 : -160) - centerY) / vy,
  );
  const before = edge(-dx, -dy), after = edge(dx, dy);
  const size = range(0.7, 1.05);
  // Couple travel speed to character scale: each stride covers real ground.
  const speed = range(105, 145) * walkerScale(width, height, size);
  const duration = (before + after) / speed;
  const centerProgress = before / (before + after);
  crowd.walkers.push({
    id: crowd.nextId++,
    startX: centerX - dx * before,
    startY: centerY - dy * before,
    endX: centerX + dx * after,
    endY: centerY + dy * after,
    duration,
    // Initial residents are distributed around the interior, not at the edges.
    age: alreadyVisible ? duration * centerProgress : 0,
    born: crowd.clock,
    size,
    period: range(1.3, 1.7),
    phase: range(0, 1),
    outfit: Math.floor(range(0, 4)),
    build: range(0.82, 1.17),
  });
}

export function createCrowd(width: number, height: number, random = Math.random): Crowd {
  const crowd: Crowd = {
    width, height, random, walkers: [], minimum: 2,
    maximum: 4, clock: 0, nextArrival: 0.5, nextId: 0,
  };
  for (let i = 0; i < crowd.maximum; i++) arrive(crowd, true);
  return crowd;
}

export function advanceCrowd(crowd: Crowd, delta: number) {
  crowd.clock += delta;
  for (const walker of crowd.walkers) walker.age += delta;
  crowd.walkers = crowd.walkers.filter(walker => walker.age < walker.duration);
  const visibleSoon = crowd.walkers.filter(walker => onScreen(crowd, walker, 3)).length;
  // Begin overlapping arrivals well before residents leave the viewport.
  if (crowd.walkers.length < crowd.maximum &&
      (crowd.clock >= crowd.nextArrival || visibleSoon < crowd.minimum)) {
    arrive(crowd, false);
    crowd.nextArrival = crowd.clock + 1.5 + crowd.random() * 2;
  }
  // Coverage guard for arbitrary aspect ratios/resizes; always preserve residents.
  while (crowd.walkers.filter(walker => onScreen(crowd, walker)).length < crowd.minimum) {
    if (crowd.walkers.length >= crowd.maximum) {
      const offscreen = crowd.walkers.findIndex(walker => !onScreen(crowd, walker));
      if (offscreen < 0) break;
      crowd.walkers.splice(offscreen, 1);
    }
    arrive(crowd, true);
  }
}
