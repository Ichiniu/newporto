import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';

const gaitSource = readFileSync(new URL('../src/lib/menuGait.ts', import.meta.url), 'utf8');
const gaitCode = ts.transpileModule(gaitSource, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const gaitUrl = 'data:text/javascript;base64,' + Buffer.from(gaitCode).toString('base64');
const { footPose, projectLimb } = await import(gaitUrl);
const source = readFileSync(new URL('../src/lib/menuCrowd.ts', import.meta.url), 'utf8').replace('"./menuGait"', JSON.stringify(gaitUrl));
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { createCrowd, advanceCrowd, onScreen } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
let minimum = Infinity, maximum = 0, simulations = 0;
for (const [width, height] of [[390, 844], [320, 568], [768, 600], [1440, 900], [2560, 1080]]) {
  for (let seed = 1; seed <= 8; seed++) {
    let state = seed;
    const random = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
    const crowd = createCrowd(width, height, random);
    assert.equal(crowd.maximum, 4, 'Menu must never allocate more than four people');
    assert.equal(crowd.walkers.length, 4, 'Menu starts with four people');
    const durations = new Set(), outfits = new Set();
    const initial = JSON.stringify(crowd.walkers);
    for (let frame = 0; frame < 12000; frame++) {
      advanceCrowd(crowd, 0.05);
      const visible = crowd.walkers.filter(walker => onScreen(crowd, walker)).length;
      crowd.walkers.forEach(walker => { durations.add(walker.duration); outfits.add(walker.outfit); });
      assert(visible >= crowd.minimum, `Empty/under-filled viewport ${width} at ${crowd.clock}`);
      assert(crowd.walkers.length <= crowd.maximum, 'Population exceeds the performance cap');
      minimum = Math.min(minimum, visible);
      maximum = Math.max(maximum, crowd.walkers.length);
    }
    assert.notEqual(JSON.stringify(crowd.walkers), initial);
    assert(crowd.nextId > 40, 'Crowd must keep creating new walkers');
    assert(durations.size > 20, 'Speeds should vary over time');
    assert.equal(outfits.size, 4, 'Clothes should vary over time');
    simulations++;
  }
}
console.log(`Crowd: ${simulations} seeded simulations, 10 minutes each; minimum visible ${minimum}, maximum allocated ${maximum}.`);

// Planted feet must not slide as the pelvis moves; toe-off/wrap remain C1 smooth.
for (const side of [-1, 1]) {
  const offset = side > 0 ? -0.5 : 0;
  const stride = 180, step = 1e-5;
  for (let phase = 0.05; phase < 0.59; phase += 0.05) {
    const a = footPose(phase + offset, side, stride);
    const b = footPose(phase + offset + step, side, stride);
    assert(Math.abs(b.forward - a.forward + step * stride) < 1e-7, 'Planted foot must stay anchored');
    assert.equal(a.lift, 0);
  }
  for (const boundary of [0.6, 1]) {
    const at = footPose(boundary + offset, side, stride).forward;
    const left = (at - footPose(boundary + offset - step, side, stride).forward) / step;
    const right = (footPose(boundary + offset + step, side, stride).forward - at) / step;
    assert(Math.abs(left - right) < 0.01, 'Foot velocity must be continuous at contact transitions');
  }
}
const floor = projectLimb(900, 650, 0, 1280, 720);
const raised = projectLimb(900, 650, 180, 1280, 720);
assert.equal(floor.x, 900);
assert.equal(floor.y, 650);
assert(raised.y < floor.y && raised.x < floor.x && raised.depth < floor.depth);
console.log('Gait: fixed ground contact, continuous swing velocity, and raised-body perspective passed.');

const root = new URL('../src/', import.meta.url);
const css = readFileSync(new URL('app/globals.css', root), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)].map(m => [m[1], m[2]]));
const luminance = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
};
assert.deepEqual(Object.keys(tokens).sort(), ['bg', 'olive', 'pistachio', 'sage', 'text']);
assert.deepEqual(new Set(Object.values(tokens)), new Set(['#FFFFFF', '#000000', '#8F9E8B', '#5E6E52', '#CCD5AE']));
for (const [fg, bg] of [['text', 'bg'], ['text', 'sage'], ['text', 'pistachio'], ['bg', 'olive'], ['olive', 'bg']]) {
  const l = [luminance(tokens[fg]), luminance(tokens[bg])].sort((a,b) => b-a);
  const ratio = (l[0]+0.05)/(l[1]+0.05);
  assert(ratio >= 4.5, `${fg}/${bg} has insufficient contrast: ${ratio}`);
  console.log(`Contrast ${fg}/${bg}: ${ratio.toFixed(2)}:1`);
}
function audit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.next', 'out', 'coverage', '.vercel'].includes(entry.name)) audit(file);
      continue;
    }
    if (!/\.(?:[cm]?[jt]sx?|css|html|svg)$/.test(entry.name) || file.href.endsWith('app/globals.css') || file.href.endsWith('scripts/check-design.mjs')) continue;
    const text = readFileSync(file, 'utf8');
    assert(!/#[\da-f]{3,8}\b|0x[\da-f]{6}\b|(?:rgb|hsl|hwb|lab|lch|oklab|oklch)a?\(/i.test(text), `Literal color outside tokens: ${file}`);
    assert(!/(?:text|bg|border|ring|shadow|from|via|to|fill|stroke|placeholder)-(?:blue|cyan|teal|sky|purple|pink|slate|gray|red|green|black|white)(?:-\d|\b)/.test(text), `Old color utility: ${file}`);
    assert(!/dark:|--olive-(?:deep|ink)|--pistachio-(?:paper|mist)/.test(text), `Obsolete color theme: ${file}`);
    for (const [, variable] of text.matchAll(/var\((--[\w-]+)\)/g)) {
      assert(css.includes(variable + ':') || variable.startsWith('--font-'), `Undefined color token ${variable}: ${file}`);
    }
    if (entry.name.endsWith('.svg')) assert(!/(?:fill|stroke)="(?!none|currentColor|url\()[^"]+"/.test(text), `SVG must use currentColor: ${file}`);
  }
}
audit(new URL('../', import.meta.url));
assert(css.includes('filter: grayscale(1)'), 'Inline photos must not introduce blue');
assert(css.includes('color-scheme: light'), 'Browser controls must stay light');
assert(css.includes('outline: 2px solid var(--color-primary-hover)'), 'Focus outline must be Olive');
assert(css.includes('transition: background-color 200ms'), 'Buttons need a 200ms color transition');
assert(css.includes('.button-primary:disabled'), 'Disabled state must be explicit');
console.log('Palette audit: whole-project source/SVG scan passed; five literal colors, valid tokens, no obsolete theme.');

// Exercise the real component's effect lifecycle without a browser or GPU.
let cleanup, nextFrame = 1, draws = 0, sprites = 0;
const frames = new Map(), mediaListeners = new Set(), visibilityListeners = new Set();
const context = new Proxy({}, {
  get: (_, key) => key === 'createLinearGradient' ? () => ({ addColorStop() {} }) :
    key === 'drawImage' ? () => { draws++; } : () => {},
  set: () => true,
});
const canvas = { width: 0, height: 0, getBoundingClientRect: () => ({ width: 1280, height: 800 }), getContext: () => context };
const media = { matches: true, addEventListener: (_, cb) => mediaListeners.add(cb), removeEventListener: (_, cb) => mediaListeners.delete(cb) };
globalThis.window = { devicePixelRatio: 2, matchMedia: () => media };
globalThis.document = {
  hidden: false, documentElement: {},
  createElement: () => { sprites++; return { ...canvas }; },
  addEventListener: (_, cb) => visibilityListeners.add(cb),
  removeEventListener: (_, cb) => visibilityListeners.delete(cb),
};
const semanticTokens = Object.fromEntries([...css.matchAll(/--(color-[\w-]+):\s*var\(--([\w-]+)\);/g)].map(m => [m[1], tokens[m[2]]]));
globalThis.getComputedStyle = () => ({ getPropertyValue: name => semanticTokens[name.slice(2)] || tokens[name.slice(2)] } );
globalThis.ResizeObserver = class { observe() {} disconnect() {} };
globalThis.requestAnimationFrame = cb => { const id = nextFrame++; frames.set(id, cb); return id; };
globalThis.cancelAnimationFrame = id => frames.delete(id);
globalThis.testHooks = {
  useRef: () => ({ current: canvas }),
  useEffect: effect => { cleanup = effect(); },
};
const moduleUrl = code => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
const palette = ts.transpileModule(readFileSync(new URL('../src/lib/palette.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const component = readFileSync(new URL('../src/components/MenuWalkers.tsx', import.meta.url), 'utf8')
  .replace('import { useEffect, useRef } from "react";', 'const { useEffect, useRef } = globalThis.testHooks; const React = { createElement: () => null };')
  .replace('"@/lib/menuCrowd"', JSON.stringify(moduleUrl(code)))
  .replace('"@/lib/menuGait"', JSON.stringify(gaitUrl))
  .replace('"@/lib/palette"', JSON.stringify(moduleUrl(palette)));
const componentJs = ts.transpileModule(component, { compilerOptions: { module: ts.ModuleKind.ES2022, jsx: ts.JsxEmit.React } }).outputText;
const { MenuWalkers } = await import(moduleUrl(componentJs));
MenuWalkers({ active: true });
assert.equal(frames.size, 0, 'Reduced motion must not schedule animation');
assert.equal(sprites, 0, 'Reduced motion must not allocate a sprite atlas');
media.matches = false;
mediaListeners.forEach(cb => cb());
assert.equal(frames.size, 1);
const atlasSize = sprites;
for (let i = 0; i < 100; i++) {
  const before = draws;
  const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(cb => cb(i * 1000 / 60));
  assert(draws > before, 'Every display frame should render without frame skipping');
}
assert(draws > 0);
assert.equal(sprites, atlasSize, 'Sprites must be reused across frames');
document.hidden = true;
visibilityListeners.forEach(cb => cb());
assert.equal(frames.size, 0, 'Hidden tabs must pause');
document.hidden = false;
visibilityListeners.forEach(cb => cb());
assert.equal(frames.size, 1, 'Visible tabs must resume');
media.matches = true;
mediaListeners.forEach(cb => cb());
assert.equal(frames.size, 0, 'Changing motion preference must stop immediately');
cleanup();
assert.equal(mediaListeners.size + visibilityListeners.size + frames.size, 0, 'Close must release listeners and frames');
MenuWalkers({ active: false });
assert.equal(frames.size, 0, 'Closed menu must stay idle');
console.log('Lifecycle: reduced motion, hidden-tab pause/resume, sprite reuse, and cleanup passed.');
