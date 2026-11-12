const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const render = app.slice(app.indexOf('function renderChrome('), app.indexOf('/* ---------- Motion:'));
function node() {
  const classes = new Set();
  return { style:{}, attrs:{}, classList:{add:k=>classes.add(k),contains:k=>classes.has(k),toggle:(k,on)=>on?classes.add(k):classes.delete(k)},
    setAttribute(k,v){this.attrs[k]=v;}, addEventListener(k,fn){this[k]=fn;}, querySelector:()=>node(), querySelectorAll:()=>[], appendChild(){} };
}
for (const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))) {
  const html=fs.readFileSync(path.join(root,file),'utf8');
  if (!html.includes('id="site-header"')) continue;
  const active=html.match(/data-page="([^"]+)"/)?.[1] || html.match(/renderChrome\('([^']+)'\)/)?.[1] || (file==='index.html'?'home':undefined);
  const opening=html.match(/<main[^>]*>\s*<[^>]+>/)?.[0] || '';
  const photo=opening.includes('photo-hero');
  const body=node(), header=node(), host=node(), headerHost=node(), themeToggle=node(), events={};
  const isTour=/<body[^>]*class="[^"]*blindagem-v3/.test(html);
  if(isTour) body.classList.add('blindagem-v3');
  const document={body,documentElement:{dataset:{theme:'light'}},createElement:node,addEventListener(){},getElementById:id=>id==='site-header'?headerHost:host,
    querySelector:s=>s==='main > .photo-hero:first-child'?(photo?node():null):s==='.header'?header:s==='.theme-toggle'?themeToggle:node(),querySelectorAll:()=>[]};
  const window={scrollY:0,addEventListener:(k,fn)=>events[k]=fn,matchMedia:()=>node()};
  const context={document,window,SITE_PAGES:[],CONTACT_MESSAGES:{},whatsappLink:()=>'',I:{},initMotion(){},applyTheme(theme){document.documentElement.dataset.theme=theme;},localStorage:{setItem(){}}};
  vm.runInNewContext(render+';renderChrome('+JSON.stringify(active)+');',context);
  assert(!headerHost.innerHTML.includes('Solicitar orçamento'),file+': no quote button in header');
  assert.equal(themeToggle.attrs['aria-checked'],'false',file+': light switch state');
  themeToggle.click();
  assert.equal(document.documentElement.dataset.theme,'dark');
  assert.equal(themeToggle.attrs['aria-checked'],'true',file+': dark switch state');
  themeToggle.click();
  assert.equal(document.documentElement.dataset.theme,'light');
  assert.equal(themeToggle.attrs['aria-checked'],'false');
  assert.equal(header.classList.contains('solid'),false,file+': transparent at top');
  window.scrollY=49;events.scroll();assert(header.classList.contains('solid'),file+': solid after scroll');
  window.scrollY=0;events.scroll();assert(!header.classList.contains('solid'),file+': transparent on return');
  assert.equal(body.classList.contains('header-overlay'),photo||active==='home'||active==='estoque'||isTour,file+': opening position');
}
console.log('Header: transparent, solid on scroll, return to top and opening offsets across all site pages passed.');
