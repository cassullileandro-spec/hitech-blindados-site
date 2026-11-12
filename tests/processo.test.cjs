const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../assets/processo.js'), 'utf8');

function setup(reduced = false) {
  const element = () => ({
    attrs: {}, events: {}, hidden: false,
    classList: { toggle() {} },
    setAttribute(name, value) { this.attrs[name] = value; },
    toggleAttribute(name, enabled) { if (enabled) this.attrs[name] = ''; else delete this.attrs[name]; },
    addEventListener(name, callback) { this.events[name] = callback; }
  });
  const buttons = Array.from({ length: 4 }, element);
  const scenes = Array.from({ length: 4 }, element);
  const details = Array.from({ length: 4 }, element);
  const playback = element(), live = element();
  const section = { dataset: {}, style: { setProperty(name, value) { this[name] = value; } },
    querySelectorAll(selector) { return selector.includes('step') ? buttons : selector.includes('photo') ? scenes : details; },
    querySelector(selector) { return selector === '.process-play' ? playback : live; }
  };
  let pending, observer, motionChange;
  const document = { hidden: false, getElementById: () => section, addEventListener(name, callback) { this[name] = callback; } };
  vm.runInNewContext(source, {
    document, window: { matchMedia: () => ({ matches: reduced, addEventListener(name, callback) { motionChange = callback; } }) },
    requestAnimationFrame(callback) { pending = callback; return 1; }, cancelAnimationFrame() { pending = undefined; },
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} }
  });
  return { buttons, scenes, details, playback, section, document, motionChange,
    visible(value) { observer([{ isIntersecting: value }]); },
    frame(time) { assert.ok(pending, 'Playback must be running'); const callback = pending; pending = undefined; callback(time); },
    hasFrame: () => Boolean(pending),
    active: () => buttons.findIndex(button => button.attrs['aria-pressed'] === 'true')
  };
}
const app = setup();
assert.equal(app.hasFrame(), false, 'Offscreen playback must stop');
app.visible(true); app.frame(100); app.frame(5100);
assert.equal(app.active(), 0);
assert.ok(app.section.style['--process-progress'] > 0, 'Connector progresses after the scene');
app.frame(6700);
assert.equal(app.active(), 1, 'Playback advances to next stage');
assert.equal('hidden' in app.scenes[1].attrs, false);
assert.equal('hidden' in app.scenes[0].attrs, true);
app.playback.events.click();
assert.equal(app.hasFrame(), false, 'Pause cancels playback');
app.buttons[3].events.click();
assert.equal(app.active(), 3);
assert.equal(app.details[3].hidden, false);
assert.equal(app.hasFrame(), false, 'Manual selection respects pause');
app.playback.events.click(); app.frame(10000); app.frame(16600);
assert.equal(app.active(), 0, 'Last stage loops to first');
app.document.hidden = true; app.document.visibilitychange();
assert.equal(app.hasFrame(), false, 'Background tabs stop playback');
const accessible = setup(true); accessible.visible(true);
assert.equal(accessible.hasFrame(), false, 'Reduced motion starts paused');
accessible.buttons[2].events.click();
assert.equal(accessible.active(), 2, 'Manual controls remain available');
console.log('Process sequence: advance, connectors, images, pause, manual selection, loop, visibility and reduced motion passed.');
