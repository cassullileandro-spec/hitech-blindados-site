const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'assistencia.html'), 'utf8');
const details = [...html.matchAll(/<details name="assistance-services"([^>]*)>/g)].map(([, attrs]) => ({
  open: /\bopen\b/.test(attrs),
  dataset: {
    photo: attrs.match(/data-photo="([^"]+)"/)[1],
    photoAlt: attrs.match(/data-photo-alt="([^"]+)"/)[1]
  },
  addEventListener(event, callback) { this.toggle = callback; }
}));
assert.equal(details.length, 3);
const photo = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/assistencia.js'), 'utf8'), {
  document: { getElementById: () => photo, querySelectorAll: () => details }
});
for (const index of [0, 1, 2, 0]) {
  const selected = details[index];
  selected.open = true;
  selected.toggle();
  assert.equal(details.filter(item => item.open).length, 1);
  assert.equal(photo.alt, selected.dataset.photoAlt);
  assert(photo.src.includes(selected.dataset.photo));
  for (const source of [photo.src, ...photo.srcset.split(', ').map(item => item.split(' ')[0])]) {
    assert(fs.existsSync(path.join(root, source)), source);
  }
  const previous = photo.src;
  selected.open = false;
  selected.toggle();
  assert.equal(photo.src, previous, 'Closing a service retains its photo');
}
console.log('Assistência: serviços exclusivos, imagens responsivas e reabertura aprovados.');
