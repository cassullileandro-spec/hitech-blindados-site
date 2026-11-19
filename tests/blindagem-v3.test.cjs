const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const base = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(base, 'assets/blindagem-v3.js'), 'utf8');
const keys = ['vidros','portas','opaca','unioes','pneus','mecanismos'];
function element(dataset = {}) {
  return { dataset, hidden:false, disabled:false, attrs:{}, events:{}, style:{}, textContent:'',
    classList:{add(){},remove(){}}, animations:0,
    setAttribute(k,v){this.attrs[k]=String(v);}, addEventListener(k,f){this.events[k]=f;},
    setPointerCapture(){}, focus(){this.focused=true;}, animate(){this.animations++;return this.animation={cancel(){this.cancelled=true;}};}, closest(){return null;}, scrollIntoView(){this.scrolled=true;},
    fire(k,props={}){return this.events[k]({preventDefault(){}, ...props});} };
}
function setup() {
  const parts=keys.map(part=>element({part})), articles=keys.map(detail=>Object.assign(element({detail}),{querySelector:()=>({textContent:detail})}));
  const actions=Object.fromEntries(['previous','play','next','home','retry','close','previous-detail','next-detail'].map(action=>[action,element({action})]));
  const modes=[];
  const stage=element(), image=element(), slider=element(), pins=element(), panel=element(), content=element(), status=element(), hint=element(), counter=element();
  const camera=element(),ghost=element(),mobile=element();
  const nodes={'.tour-camera':camera,'.tour-transition-image':ghost,'.tour-frame':image,'.tour-drag':slider,'.tour-pins':pins,'.tour-detail':panel,'.tour-panel-content':content,'.tour-status':status,'#tour-hint':hint,'.tour-detail-count':counter};
  stage.querySelector=s=>nodes[s]||actions[s.match(/data-action="([^"]+)"/)?.[1]];
  stage.querySelectorAll=s=>s==='[data-mode]'?modes:s==='[data-action]'?Object.values(actions):[actions.previous,actions.next,actions.play];
  panel.querySelectorAll=()=>articles;
  const document=Object.assign(element(),{querySelector:()=>stage,querySelectorAll:()=>parts});
  const window=element(), motion=element(), loads=[], timeouts=new Map(), intervals=new Map();let id=0, observer;
  vm.runInNewContext(source,{document,window,matchMedia:q=>q.includes("max-width")?mobile:motion,
    Image:class{set src(v){this.url=v;loads.push(this);}},
    IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}},
    setTimeout:fn=>{timeouts.set(++id,fn);return id;},clearTimeout:id=>timeouts.delete(id),
    setInterval:fn=>{intervals.set(++id,fn);return id;},clearInterval:id=>intervals.delete(id)});
  return {camera,ghost,mobile,stage,image,slider,pins,panel,content,status,hint,counter,parts,articles,actions,modes,motion,loads,timeouts,intervals,document,window,offscreen:()=>observer([{isIntersecting:false}])};
}
const flush=()=>new Promise(setImmediate);
const finish=s=>s.loads.forEach(i=>{if(!i.done){i.done=true;i.onload();}});
(async()=>{
  for(let i=0;i<37;i++) {
    const file=path.join(base,`assets/media/suv-generico/${String(i).padStart(3,'0')}.webp`);
    const bytes=fs.readFileSync(file);
    assert.ok(bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP',`Valid image header: ${file}`);
  }
  const html=fs.readFileSync(path.join(base,'blindagem.html'),'utf8');
  assert.ok(!html.includes('noindex'), 'Main Blindagem page must be indexable');
  assert.ok(html.includes('assets/blindagem-v3.js'), 'Main Blindagem page uses V3');
  for(const key of keys) {
    assert.ok(html.includes(`src="assets/media/compass-v3/details/${key}.webp"`));
    assert.ok(!html.includes('Compass'),'No brand on the page');
    assert.ok(fs.statSync(path.join(base,`assets/media/compass-v3/details/${key}.webp`)).size>10000);
  }
  const s=setup();assert.equal(s.loads.length,37);assert.ok(s.actions.play.disabled);finish(s);await flush();
  assert.match(s.image.src,/suv-generico\/000.webp\?v=kling1$/);assert.equal(s.intervals.size,0);assert.ok(!s.pins.hidden);
  s.actions.previous.fire('click');assert.equal(s.slider.attrs['aria-valuenow'],'0','Half turn does not wrap below 0°');
  s.slider.fire('keydown',{key:'End'});assert.equal(s.slider.attrs['aria-valuenow'],'180');
  s.actions.next.fire('click');assert.equal(s.slider.attrs['aria-valuenow'],'180','Half turn does not wrap past 180°');
  s.actions.home.fire('click');await flush();assert.match(s.image.src,/suv-generico\/000.webp\?v=kling1$/);assert.ok(!s.pins.hidden);
  s.slider.fire('pointerdown',{isPrimary:true,button:0,clientX:100,clientY:100,pointerId:1});
  s.slider.fire('pointermove',{clientX:75,clientY:101,pointerId:1,cancelable:true});assert.equal(s.slider.attrs['aria-valuenow'],'25');
  s.slider.fire('pointercancel');s.slider.fire('pointerdown',{isPrimary:true,button:0,clientX:100,clientY:100,pointerId:2});
  s.slider.fire('pointermove',{clientX:102,clientY:140,pointerId:2});s.slider.fire('pointermove',{clientX:30,clientY:140,pointerId:2});
  assert.equal(s.slider.attrs['aria-valuenow'],'25','Vertical scroll must not rotate');
  for(let i=0;i<keys.length;i++) {s.parts[i].fire('click');finish(s);await flush();assert.match(s.image.src,/suv-generico\/000.webp\?v=kling1$/,'Details zoom the generic SUV, never a branded cut');assert.equal(s.articles.filter(a=>!a.hidden).length,1);assert.ok(!s.articles[i].hidden);const zoom=Number(s.camera.style.transform.match(/scale\(([^)]+)\)/)[1]);assert.equal(zoom,1.15,'Every detail uses exactly 1.15×');}
  s.panel.scrollTop=200;s.actions['next-detail'].fire('click');await flush();assert.equal(s.panel.scrollTop,0);assert.ok(!s.articles[0].hidden);
  const desktopTransform=s.camera.style.transform;s.mobile.matches=true;s.window.fire('resize');assert.equal(s.camera.style.transform,desktopTransform);
  s.actions.close.fire('click');assert.equal(s.camera.style.transform,'none');assert.ok(s.panel.hidden);assert.match(s.image.src,/suv-generico\/000.webp\?v=kling1$/);
  s.actions.play.fire('click');assert.equal(s.intervals.size,1);const tick=[...s.intervals.values()][0];tick();assert.equal(s.slider.attrs['aria-valuenow'],'5');
  for(let i=0;i<40;i++) tick();assert.equal(s.slider.attrs['aria-valuenow'],'155','Playback bounces back at 180°');
  s.offscreen();assert.equal(s.intervals.size,0);s.actions.play.fire('click');s.motion.fire('change');assert.equal(s.intervals.size,0);
  s.motion.matches=true;const animations=s.content.animations;s.parts[0].fire('click');await flush();assert.equal(s.content.animations,animations);
  // Late loads must not reopen a dismissed panel.
  const race=setup();finish(race);await flush();race.parts[1].fire('click');race.actions.home.fire('click');finish(race);await flush();
  assert.match(race.image.src,/suv-generico\/000.webp\?v=kling1$/);assert.ok(race.panel.hidden);assert.equal(race.stage.attrs['aria-busy'],'false');
  const failed=setup();failed.loads[0].onerror();await flush();failed.parts[1].fire('click');failed.loads.at(-1).onerror();await flush();
  assert.ok(!failed.panel.hidden);assert.ok(!failed.articles[1].hidden);assert.ok(!failed.actions.retry.hidden);
  failed.actions.retry.fire('click');finish(failed);await flush();assert.ok(failed.actions.retry.hidden);assert.match(failed.camera.style.transform,/scale\(1\.15\)/);
  const initial=setup();initial.loads[0].onerror();await flush();assert.ok(initial.actions.play.disabled);assert.ok(!initial.actions.retry.hidden);
  initial.parts[0].fire('click');initial.actions.close.fire('click');finish(initial);await flush();assert.equal(initial.stage.attrs['aria-busy'],'false');assert.ok(!initial.actions.play.disabled);
  const timeout=setup();[...timeout.timeouts.values()][0]();await flush();assert.ok(!timeout.actions.retry.hidden);
  console.log('Blindagem V3 (SUV genérico): 37 frames, half-turn clamp, bounce playback, keyboard, horizontal/vertical gestures, panels, playback, reduced motion, stale loads, close while loading, failures/retry and timeout passed.');
})();
