const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/blindagem-v2.js'), 'utf8');
function element(dataset = {}) {
  return { dataset, hidden:false, disabled:false, attrs:{}, events:{}, style:{}, textContent:'',
    setAttribute(k,v){this.attrs[k]=String(v);}, addEventListener(k,f){this.events[k]=f;}, setPointerCapture(id){this.capture=id;},
    fire(k,props={}){return this.events[k]({preventDefault(){this.prevented=true;}, ...props});} };
}
function setup() {
  const keys=['vidros','portas','opaca','unioes','pneus','mecanismos'];
  const parts=keys.map(part=>element({part})), panels=keys.map(detail=>element({detail}));
  const controls=['previous','play','next','reset'].map(spin=>element({spin}));
  const viewport=element(),image=element(),label=element(),status=element(),retry=element(),stage=element();
  const nodes={'.explorer-viewport':viewport,'.explorer-frame':image,'.explorer-angle':label,'.explorer-loading':status,'.explorer-retry':retry,'[data-spin="play"]':controls[1]};
  stage.querySelector=s=>nodes[s]; stage.querySelectorAll=()=>controls;
  const document=Object.assign(element(),{querySelector:()=>stage,querySelectorAll:s=>s.includes('data-detail')?panels:parts});
  const window=element(),motion=element(),loads=[],timeouts=new Map(),intervals=new Map();let id=0,observer;
  const context={document,window,matchMedia:()=>motion,
    Image:class{set src(v){this.url=v;loads.push(this);}},
    IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}},
    setTimeout:fn=>{timeouts.set(++id,fn);return id;},clearTimeout:id=>timeouts.delete(id),
    setInterval:fn=>{intervals.set(++id,fn);return id;},clearInterval:id=>intervals.delete(id)};
  vm.runInNewContext(source,context);
  return {viewport,image,label,status,retry,parts,panels,controls,loads,intervals,timeouts,document,window,motion,offscreen:()=>observer([{isIntersecting:false}])};
}
const flush=()=>new Promise(setImmediate);
(async()=>{
  const s=setup();
  assert.equal(s.loads.length,12); assert.ok(s.controls.every(b=>b.disabled));
  for(const image of s.loads){assert.ok(fs.existsSync(path.join(__dirname,'..',image.url)));image.onload();}
  await flush();
  assert.ok(s.status.hidden); assert.ok(s.controls.every(b=>!b.disabled)); assert.equal(s.intervals.size,0,'No autoplay on load');
  assert.match(s.image.src,/060.webp$/);
  s.viewport.fire('keydown',{key:'Home'});s.controls[0].fire('click');assert.equal(s.viewport.attrs['aria-valuenow'],'330');
  s.controls[2].fire('click');assert.equal(s.viewport.attrs['aria-valuenow'],'0','Wrap 330 back to front');
  s.controls[3].fire('click');
  s.viewport.fire('pointerdown',{isPrimary:true,button:0,clientX:100,clientY:100,pointerId:1});
  s.viewport.fire('pointermove',{clientX:52,clientY:101,pointerId:1,cancelable:true});assert.equal(s.viewport.attrs['aria-valuenow'],'120');
  s.viewport.fire('pointercancel');
  s.viewport.fire('pointerdown',{isPrimary:true,button:0,clientX:100,clientY:100,pointerId:2});
  s.viewport.fire('pointermove',{clientX:102,clientY:140,pointerId:2});
  s.viewport.fire('pointermove',{clientX:30,clientY:140,pointerId:2});assert.equal(s.viewport.attrs['aria-valuenow'],'120','Vertical scroll does not rotate');
  s.parts.forEach((part,i)=>{part.fire('click');assert.equal(s.panels.filter(p=>!p.hidden).length,1);assert.equal(s.panels[i].hidden,false);assert.match(s.image.style.transform,/scale\(2\)/);});
  s.controls[3].fire('click');assert.equal(s.image.style.transform,'');
  s.controls[1].fire('click');assert.equal(s.intervals.size,1);[...s.intervals.values()][0]();assert.equal(s.viewport.attrs['aria-valuenow'],'90');
  s.offscreen();assert.equal(s.intervals.size,0);
  s.controls[1].fire('click');s.motion.fire('change');assert.equal(s.intervals.size,0);
  const failed=setup();failed.loads[0].onerror();await flush();assert.ok(!failed.retry.hidden);assert.ok(failed.controls.every(b=>b.disabled));
  failed.parts[1].fire('click');assert.equal(failed.panels[1].hidden,false,'Technical text works after image error');
  failed.retry.fire('click');failed.loads.slice(12).forEach(i=>i.onload());await flush();assert.ok(failed.retry.hidden);assert.ok(failed.status.hidden);
  const timeout=setup();[...timeout.timeouts.values()][0]();await flush();assert.ok(!timeout.retry.hidden);
  console.log('Cayenne: 12 assets, load, loop, keyboard, drag, vertical scroll, 6 details, reset, playback, offscreen/reduced motion, error, retry and timeout passed.');
})();
