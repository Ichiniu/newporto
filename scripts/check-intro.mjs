import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/introPlayback.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { createIntroPlayback } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const original = Object.fromEntries(['window', 'document', 'performance', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));

function fixture({ reduced = false, blocked = false } = {}) {
  let now = 0, serial = 0, completed = 0;
  const timers = new Map(), states = [], progress = [];
  const motion = Object.assign(new EventTarget(), { matches: reduced });
  const document = Object.assign(new EventTarget(), { hidden: false });
  const video = Object.assign(new EventTarget(), {
    paused: true, currentTime: 0, duration: 10, src: '', muted: false, loads: 0, plays: 0,
    load() { this.loads++; },
    play() {
      this.plays++;
      if (blocked) return Promise.reject(new Error('Autoplay unavailable'));
      this.paused = false; this.dispatchEvent(new Event('playing')); return Promise.resolve();
    },
    pause() { this.paused = true; },
    removeAttribute(name) { if (name === 'src') this.src = ''; },
  });
  const schedule = (callback, delay, repeat) => { const id = ++serial; timers.set(id, { callback, at: now + delay, repeat }); return id; };
  Object.assign(globalThis, { window: { matchMedia: () => motion }, document,
    setTimeout: (fn, ms) => schedule(fn, ms, 0), clearTimeout: id => timers.delete(id),
    setInterval: (fn, ms) => schedule(fn, ms, ms), clearInterval: id => timers.delete(id),
  });
  Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
  const session = createIntroPlayback({ video, source: '/intro.mp4', onState: s => states.push(s), onProgress: p => progress.push(p), onComplete: () => completed++ });
  return { session, video, motion, states, progress, timers, get completed() { return completed; },
    emit: name => video.dispatchEvent(new Event(name)),
    hidden(value) { document.hidden = value; document.dispatchEvent(new Event('visibilitychange')); },
    advance(ms) {
      const until = now + ms;
      for (;;) {
        const entry = [...timers].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!entry) break;
        const [id, timer] = entry; now = timer.at;
        if (timer.repeat) timer.at += timer.repeat; else timers.delete(id);
        timer.callback();
      }
      now = until;
    },
  };
}

try {
  let f = fixture();
  assert.equal(f.video.muted, true);
  assert.equal(f.states.at(-1), 'playing');
  f.video.currentTime = 4; f.emit('timeupdate'); assert.equal(f.progress.at(-1), 40);
  f.hidden(true); assert.equal(f.video.paused, true);
  f.advance(20000); assert.equal(f.completed, 0);
  f.hidden(false); assert.equal(f.video.paused, false);
  f.emit('ended'); f.session.skip(); f.advance(499); assert.equal(f.completed, 0);
  f.advance(1); assert.equal(f.completed, 1); assert.equal(f.progress.at(-1), 100);
  f.session.dispose(); assert.equal(f.timers.size, 0); assert.equal(f.video.src, '');

  f = fixture({ reduced: true });
  assert.equal(f.video.src, ''); assert.equal(f.video.loads, 0); assert.equal(f.video.plays, 0);
  f.advance(0); assert.equal(f.completed, 1); f.session.dispose();

  f = fixture({ blocked: true }); await Promise.resolve();
  assert.equal(f.states.at(-1), 'leaving'); f.advance(499); assert.equal(f.completed, 0);
  f.session.skip(); f.advance(500); assert.equal(f.completed, 1); f.session.dispose();

  f = fixture(); f.emit('error'); f.advance(500); assert.equal(f.completed, 1); f.session.dispose();
  f = fixture(); f.advance(9500); assert.equal(f.completed, 1, 'Stalled playback cannot trap visitors'); f.session.dispose();
  f = fixture(); f.motion.matches = true; f.motion.dispatchEvent(new Event('change'));
  f.advance(0); assert.equal(f.completed, 1); f.session.dispose();
  f = fixture(); f.session.skip(); f.session.dispose(); f.advance(10000);
  assert.equal(f.completed, 0, 'Disposed session must not complete');
  assert.equal(f.timers.size, 0);
  const count = f.states.length; f.emit('playing'); f.hidden(false);
  assert.equal(f.states.length, count, 'Disposed session must remove event listeners');
  console.log('Intro: playback, real progress, hidden-tab pause/resume, end/escape, reduced motion, autoplay fallback, error, watchdog, and cleanup passed.');
} finally {
  for (const [key, descriptor] of Object.entries(original)) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
}
