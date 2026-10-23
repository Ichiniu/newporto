import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { transform } = require('framer-motion');
let progress = 0, reduced = false, language = 'id', viewport, hydrating = false;
const mediaListeners = new Set();
globalThis.window = { matchMedia: () => ({
  matches: reduced === true,
  addEventListener: (_, callback) => mediaListeners.add(callback),
  removeEventListener: (_, callback) => mediaListeners.delete(callback),
}) };
const scroll = { get: () => progress };
const react = {
  createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat(Infinity) }),
  useRef: () => ({ current: null }),
  useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => {
    const unsubscribe = subscribe(() => {});
    assert.equal(mediaListeners.size, 1);
    unsubscribe();
    assert.equal(mediaListeners.size, 0, 'Media preference subscription cleans up');
    return hydrating ? getServerSnapshot() : getSnapshot();
  },
};
const mocks = {
  react,
  'lucide-react': {},
  'framer-motion': {
    motion: new Proxy({}, { get: (_, tag) => tag }),
    useScroll: options => { viewport = options; return { scrollYProgress: scroll }; },
    useTransform: (source, input, output) => ({ get: () => typeof input === 'function' ? input(source.get()) : transform(source.get(), input, output) }),
  },
  '@/context/LanguageContext': { useLanguage: () => ({ lang: language, t: key => key }) },
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
mocks['./ui/Card'] = load('../src/components/ui/Card.tsx');
const { Card } = mocks['./ui/Card'];
assert.deepEqual(Card({ children: null }).props.initial, { opacity: 0, y: 20 });
assert.equal(Card({ children: null, animateEntrance: false }).props.initial, false);
const { Skills } = load('../src/components/Skills.tsx');
const nodes = tree => tree && typeof tree === 'object' ? [tree, ...(tree.children ?? []).flatMap(nodes)] : [];
const values = style => Object.fromEntries(Object.entries(style).map(([key, value]) => [key, value.get()]));

function markup(tree) {
  if (!tree || typeof tree !== 'object') return tree;
  if (typeof tree.type === 'function') return markup(tree.type({ ...tree.props, children: tree.children }));
  const props = { ...tree.props };
  delete props.ref;
  if (props.style) props.style = Object.fromEntries(Object.entries(props.style).map(([key, value]) => [key, value?.get ? value.get() : value]));
  return { type: tree.type, props, children: (tree.children ?? []).map(markup) };
}
for (language of ['id', 'en']) {
  hydrating = true;
  reduced = null;
  const server = JSON.stringify(markup(Skills()));
  for (reduced of [false, true]) {
    assert.equal(JSON.stringify(markup(Skills())), server, 'Server and initial hydration markup must match for either motion preference');
  }
  hydrating = false;
}

for (language of ['id', 'en']) {
  const cards = nodes(Skills()).filter(node => typeof node.type === 'function');
  assert.equal(cards.length, 4);
  for (const card of cards) {
    reduced = false;
    const tree = card.type(card.props);
    assert.deepEqual(viewport.offset, ['start 90%', 'start 25%']);
    assert.equal(tree.props.ref, viewport.target, 'Measure an untransformed wrapper');
    const body = tree.children[0];
    const tags = nodes(tree).filter(node => typeof node.type === 'function' && 'name' in node.props);
    assert.deepEqual(tags.map(tag => tag.props.name), card.props.category.skills.map(skill => skill.name));
    const rendered = tags.map(tag => tag.type(tag.props));
    const snapshot = () => ({
      card: values(body.props.style),
      tags: rendered.map(tag => ({ ...values(tag.props.style), text: tag.children[1].children[0].get() })),
    });
    const samples = [0, 0.2, 0.45, 0.75, 1];
    const forward = samples.map(at => { progress = at; return snapshot(); });
    for (let i = samples.length - 1; i >= 0; i--) {
      progress = samples[i];
      assert.deepEqual(snapshot(), forward[i], 'Reverse scroll exactly restores each pose and decode state');
      assert.deepEqual(snapshot(), snapshot(), 'Paused scroll stays still');
    }
    progress = 1;
    assert.equal(tags[0].props.time.get(), 3, 'Timeline spans three seconds');
    rendered.forEach((tag, i) => {
      assert.deepEqual(values(tag.props.style), { x: 0, y: 0, rotate: 0, opacity: 1 });
      assert.equal(tag.children[0].children[0], tags[i].props.name, 'Accessible real label always reserves width');
      assert.equal(tag.children[1].props['aria-hidden'], 'true');
      assert.equal(tag.children[1].children[0].get(), tags[i].props.name);
      assert(tags[i].props.end > tags[i].props.start && tags[i].props.end <= 2.7);
    });
    progress = 0;
    assert.notEqual(rendered[0].children[1].children[0].get(), tags[0].props.name);
    assert.equal(rendered[0].props.style.y.get(), -12);
    for (progress = 0; progress <= 1; progress += 0.01) assert(Math.abs(body.props.style.x.get()) <= 1.5);
    reduced = true;
    const still = card.type(card.props);
    assert.equal(still.children[0].props.style, undefined);
    for (const tag of nodes(still).filter(node => typeof node.type === 'function' && 'name' in node.props)) {
      const staticTag = tag.type(tag.props);
      assert.equal(staticTag.props.style, undefined);
      assert.equal(staticTag.children[0].props.style.opacity, 1);
      assert.equal(staticTag.children[1], false);
    }
  }
}
console.log('Skills: three-second scroll timeline, exact forward/reverse poses and decode, stationary pause, both languages, accessible labels, reduced motion and hydration parity passed.');
