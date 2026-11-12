const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const ctx = vm.createContext({URLSearchParams, location:{search:''}});
vm.runInContext(read('assets/data.js')+'\n'+read('assets/galerias.js'),ctx);
const cars = vm.runInContext('CARROS',ctx);
const galleries = vm.runInContext('GALERIAS',ctx);
const thumbnails = vm.runInContext('FOTO_MINIATURAS',ctx);
const webp = url => {
 assert.match(url,/^assets\/media\/estoque\/[a-z0-9-]+\/\d+(?:-640)?\.webp$/);
 const bytes = fs.readFileSync(path.join(root,url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
};
assert.equal(cars.length,55);
assert.equal(new Set(cars.map(c=>c.id)).size,55);
assert.equal(new Set(cars.map(c=>c.fonte)).size,55);
assert.equal(Object.values(galleries).flat().length,645);
assert.deepEqual(cars.reduce((a,c)=>(a[c.carroceria]=(a[c.carroceria]||0)+1,a),{}),{SUV:45,Van:1,Hatch:1,Sedan:4,Picape:4});
for (const c of cars) {
 assert(c.preco>0 && c.ano>=1973 && c.ano<=2027);
 assert(galleries[c.id].length>0 && galleries[c.id][0]===c.img);
 assert.equal(new Set(galleries[c.id]).size,galleries[c.id].length);
 for (const url of galleries[c.id]) { webp(url); webp(thumbnails[url]); }
 assert(c.imgSrcset.includes(c.img));
 assert.equal(new Set(c.imgSrcset.split(', ').map(src => src.split(' ').at(-1))).size,c.imgSrcset.split(', ').length);
 assert(c.nivel==null || c.blindado===true);
}
assert.equal(cars.find(c=>c.id==='corolla-cross-xre').km,43700);
assert.equal(cars.find(c=>c.id==='mercedes-e300').preco,629800);
assert.equal(cars.find(c=>c.id==='jeep-compass').modelo,'Compass Longitude Diesel');
assert.equal(cars.find(c=>c.id==='volkswagen-kombi-1-5-luxo').blindado,false);
assert.equal(cars.find(c=>c.id==='range-evoque').blindado,null);
assert.equal(cars.find(c=>c.id==='denza-b5-gs').km,null);
assert.equal(galleries['ford-ranger-2'].length,9);
for (const url of galleries['ford-ranger-2']) assert.match(url,/\/estoque\/ford-ranger-2\/\d+\.webp$/,'Raptor must use the locally converted original photos');
assert(read('carro.html').includes('new URL(gallery[0], url).href'),'Open Graph image stays absolute');
assert(read('carro.html').includes('gallery.map(image => new URL(image, url).href)'),'Structured data image URLs stay absolute');
const html=read('showroom.html');
vm.runInContext(html.match(/const limites =[^\n]+/)[0]+html.match(/const state =[^\n]+/)[0],ctx);
vm.runInContext(html.slice(html.indexOf('    function matches('),html.indexOf('    function activeChips(')),ctx);
assert.equal(vm.runInContext('CARROS.filter(matches).length',ctx),55,'Default filters must show the entire inventory');
assert(vm.runInContext("CARROS.filter(matches).some(c=>c.ano===1973)",ctx));
assert(vm.runInContext("CARROS.filter(matches).some(c=>c.km===138073)",ctx));
vm.runInContext('state.km=10000',ctx);
assert(vm.runInContext('CARROS.filter(matches).every(c=>c.km!=null && c.km<=10000)',ctx));
vm.runInContext("state.km=limites.km; state.carrocerias.add('Hatch')",ctx);
assert.equal(vm.runInContext('CARROS.filter(matches).length',ctx),1);
vm.runInContext("state.carrocerias.clear(); state.sort='km'",ctx);
assert.equal(vm.runInContext('sortList(CARROS).at(-1).km',ctx),null);
for (const file of ['carro.html','showroom.html','index.html']) {
 for (const match of read(file).matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (!/src=|application\/ld\+json/.test(match[1])) new vm.Script(match[2],{filename:file});
 }
}
console.log('Estoque: 55 anúncios, 645 fotos; categorias, dados, filtros e scripts aprovados.');

const redirect = read('estoque.html').match(/<script>([\s\S]*?)<\/script>/)[1];
for (const [search, hash] of [['', ''], ['?carroceria=SUV', '#conteudo'], ['?carroceria=Sedan&q=S%C3%A3o%20Paulo', '']]) {
 let destination;
 vm.runInNewContext(redirect, {location: {search, hash, replace: url => { destination = url; }}});
 assert.equal(destination, 'showroom.html' + search + hash, 'Legacy URL must preserve filters and fragment');
}
assert(read('sitemap.xml').includes('/showroom.html'));
assert(!read('sitemap.xml').includes('/estoque.html'));
console.log('Showroom: legacy redirect preserves query and fragment.');
