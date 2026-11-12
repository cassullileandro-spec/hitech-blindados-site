const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/home.js'), 'utf8').split('const heroVideo')[1];

function setup({ reduced = false, mobile = false, saveData = false } = {}) {
  const events = {};
  const classes = new Set();
  const motion = { matches: reduced, addEventListener: (_, fn) => { motion.change = fn; } };
  const size = { matches: mobile, addEventListener: (_, fn) => { size.change = fn; } };
  const button = { hidden: true, setAttribute() {}, addEventListener: (_, fn) => { button.click = fn; } };
  const video = {
    dataset: { src: 'hero.mp4', mobileSrc: 'hero-mobile.mp4' }, paused: true,
    parentElement: { classList: { add: v => classes.add(v), remove: v => classes.delete(v) } },
    addEventListener: (name, fn) => { events[name] = fn; },
    hasAttribute: () => !!video.src, getAttribute: () => video.src,
    removeAttribute: () => { delete video.src; }, load() {},
    play() { video.paused = false; events.playing(); return Promise.resolve(); },
    pause() { video.paused = true; events.pause(); }
  };
  const document = {
    hidden: false, getElementById: id => id === 'hero-video' ? video : button,
    addEventListener: (_, fn) => { document.visibility = fn; }
  };
  vm.runInNewContext('const heroVideo' + source, {
    document, navigator: { connection: { saveData } },
    window: { matchMedia: query => query.includes('reduced-motion') ? motion : query.includes('max-width') ? size : { matches: false } }
  });
  return { video, button, motion, size, document, classes, events };
}

const reduced = setup({ reduced: true });
assert.equal(reduced.video.src, undefined, 'Reduced motion must not load an MP4');
assert(reduced.video.paused && reduced.button.hidden);
assert.equal(setup({ saveData: true }).video.src, undefined);

const s = setup();
assert.equal(s.video.src, 'hero.mp4');
assert(s.video.muted && !s.video.paused && s.classes.has('playing'));
s.size.matches = true; s.size.change();
assert.equal(s.video.src, 'hero-mobile.mp4');
s.button.click();
assert(s.video.paused && !s.video.autoplay);
s.size.matches = false; s.size.change();
assert(s.video.paused && !s.video.autoplay, 'Resizing must preserve a manual pause');
s.document.hidden = true; s.document.visibility();
s.document.hidden = false; s.document.visibility();
assert(s.video.paused, 'Returning to the tab must preserve a manual pause');
s.button.click();
assert(!s.video.paused);
s.document.hidden = true; s.document.visibility();
assert(s.video.paused);
s.document.hidden = false; s.document.visibility();
assert(!s.video.paused);
s.motion.matches = true; s.motion.change();
assert(s.video.paused && s.button.hidden && !s.classes.has('playing'));
assert.equal(s.video.src, undefined, 'Switching to reduced motion must restore the poster');
s.motion.matches = false; s.motion.change();
assert(!s.video.paused && s.video.src === 'hero.mp4');
s.events.error();
assert(s.button.hidden && !s.classes.has('playing'), 'Errors must expose the poster');
console.log('Hero video: responsive source, reduced motion, save data, pause/resume, visibility and fallback passed.');
