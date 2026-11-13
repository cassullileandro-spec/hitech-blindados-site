const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync(require('node:path').join(__dirname, '../assets/app.js'), 'utf8');
const source = app.slice(app.indexOf('function initPreloader()'), app.indexOf('// roda assim'));
function setup({reduced = false, saveData = false, skip = false, readyState = 0} = {}) {
  const timers = new Map(), events = {}, classes = new Set();
  let next = 0, removed = false;
  const pre = {querySelector: () => ({style: {}}), classList: {add: name => classes.add(name)}, remove: () => {removed = true;}};
  const hero = {readyState, addEventListener: (name, fn) => {events[name] = fn;}, removeEventListener: name => {delete events[name];}};
  vm.runInNewContext(source + ';initPreloader();', {
    document: {getElementById: id => id === 'preloader' ? pre : hero},
    window: {matchMedia: q => ({matches: q.includes('reduced-motion') ? reduced : false})},
    navigator: {connection: {saveData}}, sessionStorage: {getItem: () => skip, setItem() {}},
    setInterval: () => 1, clearInterval() {}, setTimeout: (fn, delay) => {timers.set(++next, {fn, delay}); return next;}, clearTimeout: id => timers.delete(id)
  });
  return {events, timers, classes, removed: () => removed};
}
const waiting = setup({skip: true});
assert(!waiting.classes.has('done') && !waiting.removed(), 'Returning home must still wait for video');
assert([...waiting.timers.values()].some(t => t.delay === 8000));
waiting.events.canplaythrough();
assert(waiting.classes.has('done'), 'Ready video dismisses the preloader');
assert(!waiting.events.error && !waiting.events.canplaythrough);
assert(![...waiting.timers.values()].some(t => t.delay === 8000), 'Ready state cancels safety timeout');
const timeout = setup();
[...timeout.timers.values()].find(t => t.delay === 8000).fn();
assert(timeout.classes.has('done'), 'Slow connection must open page after 8 seconds');
const failed = setup(); failed.events.error(); assert(failed.classes.has('done'));
for (const options of [{reduced: true}, {saveData: true}, {readyState: 4}]) {
  const result = setup(options);
  assert(result.classes.has('done'), 'Reduced motion, save data or buffered video must not wait');
  assert(![...result.timers.values()].some(t => t.delay === 8000));
}
console.log('Hero preloader: readiness, 8s fallback, repeat visits, errors and reduced motion passed.');
