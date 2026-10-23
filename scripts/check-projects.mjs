import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { transform } = require('framer-motion');
let language = 'id', reduced = false, progress = 0, states = [], cursor = 0;
const react = {
  createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat(Infinity) }),
  useState: initial => {
    const index = cursor++;
    return [states[index] ?? initial, value => { states[index] = value; }];
  },
  useEffect() {},
  useRef: () => ({ current: null }),
};
const data = load('../src/data/portfolio.ts');
const mocks = {
  react,
  'next/image': 'img',
  '@/data/portfolio': data,
  'lucide-react': {},
  '@/components/ui/Icons': {},
  '@/context/LanguageContext': { useLanguage: () => ({ lang: language, t: key => key }) },
  'framer-motion': {
    motion: new Proxy({}, { get: (_, tag) => tag }),
    AnimatePresence: 'presence',
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
const { Projects } = load('../src/components/Projects.tsx');
function nodes(tree) {
  return tree && typeof tree === 'object' ? [tree, ...tree.children.flatMap(nodes)] : [];
}
function render(filter = 'all') {
  states = [filter]; cursor = 0;
  return nodes(Projects()).filter(node => typeof node.type === 'function');
}
for (language of ['id', 'en']) {
  assert.equal(render().length, 5);
  assert.deepEqual(render('php').map(node => node.props.project.id), ['photobox', 'reservasi', 'userguide-fingerspot']);
  assert.deepEqual(render('next').map(node => node.props.index), [0, 1]);
  assert.deepEqual(render('php').map(node => node.props.index), [2, 3, 4], 'Filtering preserves project numbering and alignment');
  for (const item of render()) {
    function media(at, preference) {
      progress = at; reduced = preference; states = []; cursor = 0;
      const tree = nodes(item.type(item.props));
      const preview = tree.find(node => node.type === 'button' && node.props['aria-label']?.includes(item.props.project.title));
      assert(preview, 'Inline preview must be a keyboard-operable button');
      preview.props.onClick();
      assert(states.some(value => value?.projectId === item.props.project.id), 'Preview opens the selected project');
      return nodes(preview).find(node => node.props.style?.width)?.props.style;
    }
    const small = media(0.15, false), large = media(0.65, false);
    assert(parseFloat(large.width) > parseFloat(small.width));
    assert(parseFloat(large.height) > parseFloat(small.height));
    assert.deepEqual(media(0.15, true), media(0.9, true), 'Reduced motion must keep media stationary');
  }
}
console.log('Projects: both languages, filters, stable numbering, keyboard triggers, scroll growth and reduced motion passed.');
