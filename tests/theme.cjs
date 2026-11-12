const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/theme.js'), 'utf8');
for (const saved of [null, 'light', 'dark', 'invalid', new Error('Storage blocked')]) {
  const html = {dataset: {}, style: {}};
  const meta = {};
  const context = vm.createContext({document: {documentElement: html, querySelector: () => meta}, localStorage: {getItem() {if (saved instanceof Error) throw saved; return saved;}}});
  vm.runInContext(source, context);
  const expected = saved === 'dark' ? 'dark' : 'light';
  assert.equal(html.dataset.theme, expected);
  assert.equal(html.style.colorScheme, expected);
  assert.equal(meta.content, expected === 'dark' ? '#08090B' : '#F4F6F8');
  context.applyTheme(expected === 'dark' ? 'light' : 'dark');
  assert.notEqual(html.dataset.theme, expected);
}
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
assert(pages.length >= 9);
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const early = html.indexOf('src="assets/theme.js');
  assert(early > 0 && early < html.indexOf('rel="stylesheet"'), page + ': tema antes do CSS');
}
console.log('Tema: padrão claro, preferência salva, valor inválido, armazenamento bloqueado e inicialização em todas as páginas aprovados.');
