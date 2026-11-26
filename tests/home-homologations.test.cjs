const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, '../assets/home.js'), 'utf8').split('const homologTabs')[1].split('// O embed oficial')[0];
const buttonTags = [...html.matchAll(/<button class="hh-tab"[^>]*>/g)].map(m => m[0]);
const panelTags = [...html.matchAll(/<div class="hh-panel[^>]*>/g)].map(m => m[0]);
const attr = (tag, key) => tag.match(new RegExp(`${key}="([^"]+)"`))?.[1];
assert.equal(buttonTags.length, 9);
assert.equal(panelTags.length, 9);
const panels = Object.fromEntries(panelTags.map(tag => [attr(tag, 'id'), { hidden: /\shidden[\s>]/.test(tag) }]));
assert.deepEqual(Object.keys(panels).filter(id => !panels[id].hidden), ['hh-jeep'], 'Jeep must be visible before JavaScript');
let focused;
const tabs = buttonTags.map(tag => {
  const tab = { id: attr(tag, 'id'), controls: attr(tag, 'aria-controls'), selected: attr(tag, 'aria-selected'), tabIndex: Number(attr(tag, 'tabindex')), events: {} };
  assert(panels[tab.controls]);
  assert.equal(attr(panelTags.find(p => attr(p, 'id') === tab.controls), 'aria-labelledby'), tab.id);
  tab.getAttribute = key => key === 'aria-controls' ? tab.controls : undefined;
  tab.setAttribute = (key, value) => { if (key === 'aria-selected') tab.selected = value; };
  tab.addEventListener = (event, handler) => { tab.events[event] = handler; };
  tab.focus = () => { focused = tab; };
  return tab;
});
vm.runInNewContext('const homologTabs' + source, { document: { querySelectorAll: () => tabs, getElementById: id => panels[id] } });
function check(selected) {
  assert.deepEqual(tabs.filter(t => t.selected === 'true'), [selected]);
  assert.deepEqual(tabs.filter(t => t.tabIndex === 0), [selected]);
  assert.deepEqual(Object.keys(panels).filter(id => !panels[id].hidden), [selected.controls]);
}
check(tabs[0]);
for (const tab of tabs) { tab.events.click(); check(tab); }
function key(tab, key, expected) {
  let prevented = false;
  tab.events.keydown({ key, preventDefault() { prevented = true; } });
  assert(prevented); check(expected); assert.equal(focused, expected);
}
key(tabs[8], 'ArrowRight', tabs[0]);
key(tabs[0], 'ArrowLeft', tabs[8]);
key(tabs[8], 'Home', tabs[0]);
key(tabs[0], 'End', tabs[8]);
let prevented = false;
tabs[8].events.keydown({ key: 'Tab', preventDefault() { prevented = true; } });
assert(!prevented, 'Native Tab navigation must remain available');
check(tabs[8]);
console.log('Homologations: Jeep initially open, all nine panels, exclusive selection and keyboard navigation passed.');
