import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { transform } = require('framer-motion');
let language = 'id', reduced = false, progress = 0, fits = false;
let effect, measure, disconnected = false, observed = 0;
const react = {
  createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat(Infinity) }),
  useState: () => [fits, value => { fits = value; }],
  useEffect: callback => { effect = callback; },
  useRef: () => ({ current: null }),
};
const mocks = {
  react,
  'lucide-react': {},
  './Timeline.module.css': new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key }),
  '@/context/LanguageContext': { useLanguage: () => ({ lang: language, t: key => key }) },
  'framer-motion': {
    motion: new Proxy({}, { get: (_, tag) => tag }),
    useReducedMotion: () => reduced,
    useScroll: () => ({ scrollYProgress: progress }),
    useTransform: (value, input, output) => transform(value, input, output),
  },
};
function load(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true,
  } }).outputText;
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => mocks[name] ?? require(name), loaded, loaded.exports);
  return loaded.exports;
}
mocks['@/data/portfolio'] = load('../src/data/portfolio.ts');
const { Timeline } = load('../src/components/Timeline.tsx');
const nodes = tree => tree && typeof tree === 'object' ? [tree, ...tree.children.flatMap(nodes)] : [];
const words = tree => typeof tree === 'string' ? tree : tree?.children?.flatMap(words) ?? [];
globalThis.ResizeObserver = class {
  constructor(callback) { measure = callback; }
  observe() { observed++; }
  disconnect() { disconnected = true; }
};
globalThis.window = { innerWidth: 1440, innerHeight: 900,
  addEventListener: (_, callback) => { measure = callback; },
  removeEventListener: (_, callback) => assert.equal(callback, measure),
};

for (language of ['id', 'en']) {
  fits = false; reduced = false;
  const initial = nodes(Timeline());
  const track = initial.find(node => Object.hasOwn(node.props, 'data-pinned'));
  assert.equal(track.props['data-pinned'], false, 'Server/initial render must show every entry');
  const stage = initial.find(node => node.props.className === 'stage');
  const sizes = [640, 700, 640, 640, 640].map(offsetHeight => ({ offsetHeight }));
  stage.props.ref.current = { querySelectorAll: () => sizes };
  window.innerWidth = 1440; window.innerHeight = 900;
  observed = 0; disconnected = false;
  const cleanup = effect();
  assert.equal(observed, 5);
  assert.equal(fits, true);
  sizes[1].offsetHeight = 850; measure();
  assert.equal(fits, false, 'Long descriptions must disable pinning');
  sizes[1].offsetHeight = 700;
  window.innerWidth = 390; measure(); assert.equal(fits, false);
  window.innerWidth = 1440; window.innerHeight = 700; measure(); assert.equal(fits, false);
  window.innerHeight = 900; measure(); assert.equal(fits, true);
  cleanup(); assert(disconnected);

  for (reduced of [false, true]) {
    const tree = nodes(Timeline());
    assert.equal(tree.find(node => Object.hasOwn(node.props, 'data-pinned')).props['data-pinned'], !reduced);
    const entries = tree.filter(node => typeof node.type === 'function');
    assert.equal(entries.length, 5);
    entries.forEach((entry, index) => {
      const scene = () => entry.type({ ...entry.props, progress });
      const content = words(scene()).flat(Infinity).join(' ');
      for (const value of [entry.props.item.role, entry.props.item.company, entry.props.item.period, ...entry.props.item.descriptions, ...entry.props.item.tags]) assert(content.includes(value));
      if (index === 0 || reduced) {
        assert.equal(scene().props.style, undefined, 'Static scenes must stay fully visible');
      } else {
        progress = (index - 0.35) / entries.length;
        const hidden = scene().props.style;
        assert.equal(hidden.scale, 0.92);
        assert.equal(hidden.clipPath, 'inset(0% 50% 0% 50%)');
        progress = index / entries.length;
        const visible = scene().props.style;
        assert.equal(visible.scale, 1);
        assert.equal(visible.clipPath, 'inset(0% 0% 0% 0%)');
        const cover = nodes(scene()).find(node => node.props.className === 'curtain');
        assert.equal(cover.props.style.opacity, 0, 'Curtain must uncover readable text');
        progress = (index - 0.35) / entries.length;
        assert.deepEqual(scene().props.style, hidden, 'Reverse scrolling restores the previous transition state');
      }
    });
  }
}
const css = readFileSync(new URL('../src/components/Timeline.module.css', import.meta.url), 'utf8');
assert(!/#[\da-f]{3,8}\b|(?:rgb|hsl)a?\(/i.test(css), 'Reuse the existing palette');
assert(css.includes('@media (prefers-reduced-motion: reduce), print'));
console.log('Timeline: both languages and all content, viewport/content fallback, resize cleanup, reversible reveals, reduced motion, and palette checks passed.');
