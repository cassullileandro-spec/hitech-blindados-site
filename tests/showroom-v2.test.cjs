const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const ctx = { URLSearchParams, URL, window: { location: { search: '' } }, document: { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; }, documentElement: { classList: { add() {}, remove() {} } } }, sessionStorage: { getItem() {}, setItem() {} } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8') + ';this.CARROS=CARROS;', ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8') + ';this.semelhantes=semelhantes;this.isentoRodizio=isentoRodizio;this.OPCIONAIS_PADRAO=OPCIONAIS_PADRAO;', ctx);
const { CARROS, semelhantes, isentoRodizio, OPCIONAIS_PADRAO } = ctx;

for (const car of CARROS) {
  const rel = semelhantes(car, CARROS);
  assert.equal(rel.length, 4, car.id + ': four similar cars');
  const models = rel.map(x => x.modelo);
  assert.equal(new Set(models).size, 4, car.id + ': no repeated model');
  assert(!models.includes(car.modelo), car.id + ': same model excluded');
  const cheaper = CARROS.some(x => x.modelo !== car.modelo && x.id !== car.id && x.preco <= car.preco);
  const pricier = CARROS.some(x => x.modelo !== car.modelo && x.preco > car.preco);
  if (cheaper) assert(rel.some(x => x.preco <= car.preco), car.id + ': one below');
  if (pricier) assert(rel.some(x => x.preco > car.preco), car.id + ': one above');
}
assert(isentoRodizio({ combustivel: 'Elétrico' }) && isentoRodizio({ combustivel: 'Híbrido' }) && !isentoRodizio({ combustivel: 'Flex' }));
assert(OPCIONAIS_PADRAO.length > 0 && CARROS.every(c => c.opcionais.every(o => OPCIONAIS_PADRAO.includes(o))));

const html = fs.readFileSync(path.join(root, 'showroom.html'), 'utf8');
assert(!html.includes('BRAND_LOGOS') && html.includes('brand-filter-name') && html.includes('f-rodizio'));
const pdp = fs.readFileSync(path.join(root, 'carro.html'), 'utf8');
assert(pdp.includes('Quero negociar agora') && !/Fazer uma proposta|tel:/.test(pdp));
console.log('Showroom V2: similares por preço sem repetir modelo, rodízio, opcionais padrão, marcas por nome e negociação passed.');
