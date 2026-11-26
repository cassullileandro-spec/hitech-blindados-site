const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/home.js'), 'utf8').split('const instagramFeed')[1].split('// Vídeos:')[0];

function setup(present = true) {
  const scripts = [], observers = [];
  const feed = { querySelector: () => feed.frame };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  vm.runInNewContext('const instagramFeed' + source, {
    document: { querySelector: () => present ? feed : null, createElement: () => ({}), body: { append: script => scripts.push(script) } },
    IntersectionObserver: Observer, MutationObserver: Observer, window: {}
  });
  return { scripts, observers, feed };
}

assert.equal(setup(false).observers.length, 0, 'Pages without the feed must not load Instagram');
const s = setup();
assert.equal(s.scripts.length, 0, 'The feed must not load alongside the hero');
s.observers[0].callback([{ isIntersecting: false }]);
assert.equal(s.scripts.length, 0);
s.observers[0].callback([{ isIntersecting: true }]);
assert(s.observers[0].disconnected, 'Observe proximity only once');
assert.equal(s.scripts.length, 1);
assert.equal(s.scripts[0].src, 'https://www.instagram.com/embed.js');
s.observers[1].callback();
assert(!s.observers[1].disconnected, 'Wait for the actual iframe before labeling it');
s.feed.frame = {};
s.observers[1].callback();
assert.equal(s.feed.frame.title, 'Publicações de Gabriel Bucker no Instagram');
assert(s.observers[1].disconnected);
s.scripts[0].onload(); // A blocked Instagram global must not break the page.
const blocked = setup();
blocked.observers[0].callback([{ isIntersecting: true }]);
blocked.scripts[0].onerror();
assert(blocked.observers[1].disconnected);
assert.equal(blocked.feed.frame, undefined, 'The original profile link remains when the script is blocked');
console.log('Instagram: deferred loading, absent section, accessible iframe and blocked-script fallback passed.');
