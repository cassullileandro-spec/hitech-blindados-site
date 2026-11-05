/* Local review aid. No requests, storage, dependencies or changes to site styles. */
(() => {
  'use strict';
  if (document.getElementById('layout-grid-inspector')) return;
  const stage = document.getElementById('grid-capture-stage');
  const picture = stage?.querySelector('img');
  const supplied = JSON.parse(document.getElementById('grid-inspector-config')?.textContent || '{}');
  const host = document.createElement('div');
  host.id = 'layout-grid-inspector';
  host.style.cssText = `position:${stage ? 'absolute' : 'fixed'};inset:0;pointer-events:none;z-index:2147483647;`;
  (stage || document.documentElement).append(host);
  const shadow = host.attachShadow({mode:'open'});
  shadow.innerHTML = `<style>
    :host{font:13px/1.4 system-ui,sans-serif;color:#f8fafc}*{box-sizing:border-box}
    svg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    aside{position:fixed;right:12px;bottom:12px;width:288px;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);overflow:auto;background:#14232f;border:1px solid #8da8b8;border-radius:8px;padding:12px;pointer-events:auto;box-shadow:0 4px 20px #0004}
    header{display:flex;align-items:center;gap:8px}header strong{flex:1}button,input{font:inherit}
    button{cursor:pointer;background:#e7f1f7;color:#14232f;border:0;border-radius:4px;padding:6px 8px}
    form{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}label{display:block}input[type=number]{display:block;width:100%;padding:4px}
    input[type=text]{width:100%;padding:5px}.wide{grid-column:1/-1}.layers{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.status{font-size:12px;color:#facc15;margin:8px 0}.legend{font-size:11px;color:#cbd5e1}summary{cursor:pointer;margin-top:10px}button:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid #fff;outline-offset:3px} [hidden]{display:none!important}
  </style><svg xmlns="http://www.w3.org/2000/svg" aria-label="Guias de referência"></svg>
  <aside aria-label="Inspetor de grid"><header><strong>Grid · inspeção</strong><button id="collapse" type="button" aria-expanded="true" aria-controls="panel">Recolher</button><button id="close" type="button" aria-label="Fechar inspetor">×</button></header><div id="panel">
  <div class="layers"><label><input id="columns" type="checkbox" checked>Colunas</label><label><input id="horizontal" type="checkbox" checked>Linhas fortes</label><label><input id="fine-lines" type="checkbox">Linhas finas</label><label><input id="bounds" type="checkbox">Contornos</label><label><input id="sections" type="checkbox">Seções e padding</label><label><input id="labels" type="checkbox" disabled>Medidas</label></div>
  <p class="legend">Rosa: colunas · azul: referências fixas · âmbar: limites e padding observados. Contornos são caixas observadas, não erros automáticos.</p>
  <div class="status" role="status"></div><details><summary>Calibrar e inspecionar detalhes</summary><form>
  <label>Margem esquerda<input name="left" type="number" min="0" step="any" value="32" required></label>
  <label>Margem direita<input name="right" type="number" min="0" step="any" value="32" required></label>
  <label>Colunas<input name="columns" type="number" min="1" max="24" value="12" required></label>
  <label>Gutter<input name="gap" type="number" min="0" step="any" value="24" required></label>
  <label>Passo fino<input name="fine" type="number" min="1" step="any" value="8" required></label>
  <label>Passo forte<input name="strong" type="number" min="1" step="any" value="64" required></label>
  <label class="wide">Origem Y no documento (px CSS)<input name="origin" type="number" min="0" step="any" value="0" required></label>
  <button class="wide" type="submit">Fixar referência</button></form>
  <label id="selector-label">Blocos a inspecionar (seletor CSS)<input id="selector" type="text" value="main h1, main h2, main h3, main p, main img, main button, main a"></label>
  <button id="export" type="button">Salvar medidas</button>
  <p class="legend">Roxo tracejado: caixas observadas. Restrinja o seletor aos blocos em revisão. Caixas não representam cap height ou baseline; terminar entre linhas fortes pode ser correto.</p></details>
  </div></aside>`;
  const svg = shadow.querySelector('svg'), form = shadow.querySelector('form');
  const status = shadow.querySelector('.status');
  const fields = [...form.querySelectorAll('input')];
  const controls = Object.fromEntries(fields.map(e => [e.name,e]));
  const initialWidth = stage ? stage.clientWidth : document.documentElement.clientWidth;
  const compact = initialWidth < 768, wide = initialWidth >= 1024;
  const margin = Math.max(compact ? 16 : wide ? 32 : 24, (initialWidth - 1200) / 2);
  for (const [key,value] of Object.entries({left:margin,right:margin,columns:compact?4:wide?12:8,gap:compact?16:24})) controls[key].value = value;
  for (const [key,value] of Object.entries(supplied.grid || {})) if (controls[key]) controls[key].value = value;
  shadow.querySelector('#sections').checked = supplied.showSections === true;
  if (picture) shadow.querySelector('#selector-label').hidden = true;
  let fixed = false, frame = 0, stopped = false;
  let last = {observed:[]};
  const namespace = 'http://www.w3.org/2000/svg';
  function node(tag, attrs, text) {
    const el = document.createElementNS(namespace, tag);
    for (const [key,value] of Object.entries(attrs)) el.setAttribute(key,String(value));
    if (text !== undefined) el.textContent = text;
    svg.append(el); return el;
  }
  function render() {
    frame = 0;
    const width = stage ? stage.clientWidth : document.documentElement.clientWidth;
    const height = stage ? stage.clientHeight : innerHeight;
    const scroll = stage ? 0 : scrollY;
    const grid = Object.fromEntries(fields.map(e => [e.name,Number(e.value)]));
    svg.setAttribute('width',width); svg.setAttribute('height',height);
    svg.replaceChildren();
    const usable = width - grid.left - grid.right - (grid.columns-1)*grid.gap;
    if (!form.checkValidity() || !Number.isFinite(usable) || usable <= 0 || grid.strong < grid.fine) {
      status.textContent = 'Configuração inválida: confira largura, colunas e passos.'; return;
    }
    const column = usable/grid.columns;
    const referenceWidth = supplied.viewportWidth || initialWidth;
    status.textContent = `${fixed ? 'REFERÊNCIA FIXADA' : 'HIPÓTESE — calibre e fixe antes de comparar'} · ${width}px CSS${referenceWidth && referenceWidth !== width ? ' · largura diferente da configuração!' : ''}`;
    if (shadow.querySelector('#columns').checked) for(let i=0;i<grid.columns;i++) {
      const x=grid.left+i*(column+grid.gap);
      node('rect',{x,y:0,width:column,height,fill:'#f43f5e08',stroke:'#f43f5e55','stroke-width':.5,'data-kind':'column'});
      node('text',{x:x+3,y:16,fill:'#b91c1c','font-size':12},i+1);
    }
    {
      for(const [step,color,kind,control] of [[grid.fine,'#38bdf826','fine','fine-lines'],[grid.strong,'#0284c799','strong','horizontal']]) {
        if (!shadow.getElementById(control).checked) continue;
        const start=Math.max(0,Math.ceil((scroll-grid.origin)/step));
        const end=Math.floor((scroll+height-grid.origin)/step);
        // Keep accidental huge captures from freezing the inspector; never alter the reference step.
        if(end-start>12000){status.textContent='Captura muito alta: revise por seção.';continue;}
        for(let i=start;i<=end;i++) {
          const position=i*step;
          if(kind==='fine' && shadow.querySelector('#horizontal').checked && Math.abs(position/grid.strong-Math.round(position/grid.strong))<1e-8) continue;
          const y=grid.origin+position-scroll;node('line',{x1:grid.left,x2:width-grid.right,y1:y,y2:y,stroke:color,'stroke-width':kind==='strong'?1:.5,'data-kind':kind});
        }
      }
    }
    let sections = [];
    if (stage) sections = Array.isArray(supplied.sections) ? supplied.sections : [];
    else {
      try {
        for (const e of document.querySelectorAll(supplied.sectionSelector || 'main > section, footer, [data-grid-section], [data-grid-padding]')) {
          if (e === host || host.contains(e)) continue;
          const r = e.getBoundingClientRect(), style = getComputedStyle(e);
          if (!r.width || !r.height) continue;
          const label = e.dataset.gridSection || e.dataset.gridPadding || e.getAttribute('aria-label') || e.id || e.querySelector('h1,h2')?.textContent.trim() || (e.tagName === 'FOOTER' ? 'Rodapé' : 'Seção');
          sections.push({label, x:r.left + scrollX, y:r.top + scrollY, width:r.width, height:r.height, paddingTop:parseFloat(style.paddingTop), paddingBottom:parseFloat(style.paddingBottom), borderTop:parseFloat(style.borderTopWidth), borderBottom:parseFloat(style.borderBottomWidth)});
        }
      } catch {status.textContent = 'Seletor de seções inválido; as outras guias continuam disponíveis.';}
    }
    if (shadow.querySelector('#sections').checked) for (const r of sections) {
      if (![r.x,r.y,r.width,r.height,r.paddingTop,r.paddingBottom,r.borderTop || 0,r.borderBottom || 0].every(Number.isFinite) || r.width <= 0 || r.height <= 0 || r.paddingTop < 0 || r.paddingBottom < 0) continue;
      const x = r.x - (stage ? 0 : scrollX), y = r.y - scroll, bottom = y + r.height;
      if (bottom < 0 || y > height) continue;
      const paddingStart = y + (r.borderTop || 0), paddingEnd = bottom - (r.borderBottom || 0) - r.paddingBottom;
      for (const [start,size] of [[paddingStart,r.paddingTop],[paddingEnd,r.paddingBottom]]) {
        if (size) node('rect',{x,y:start,width:r.width,height:size,fill:'#fbbf2414','data-kind':'section-padding'});
      }
      for (const edge of [y,bottom]) node('line',{x1:x,x2:x+r.width,y1:edge,y2:edge,stroke:'#fbbf24aa','stroke-dasharray':'6 4','data-kind':'section-edge'});
      const caption = `${r.label || 'Seção'} · topo ${r.paddingTop}px · base ${r.paddingBottom}px`;
      const labelY = y >= 0 || paddingStart + r.paddingTop > 22 ? Math.max(4,y+4) : paddingEnd+4;
      const labelX = Math.max(4,x,grid.left);
      if (labelY >= 0 && labelY + 22 < Math.min(height,bottom) && labelX < width-20) {
        node('rect',{x:labelX,y:labelY,width:Math.min(width-labelX-4,caption.length*6.4+16),height:22,rx:3,fill:'#241c08ed','data-kind':'section-label'});
        node('text',{x:labelX+8,y:labelY+15,fill:'#fde68a','font-size':11,'data-kind':'section-label'},caption);
      }
    }
    let observed=[];
    if(stage) observed=(supplied.observed || []).map(r=>({...r}));
    else {
      try {
        for(const e of document.querySelectorAll(shadow.querySelector('#selector').value)) {
          if(e===host || host.contains(e))continue;
          const closed=e.closest('details:not([open])');
          if(closed && !closed.querySelector('summary')?.contains(e))continue;
          const r=e.getBoundingClientRect();if(!r.width||!r.height)continue;
          const s=getComputedStyle(e);
          observed.push({label:e.id ? '#'+e.id : e.tagName.toLowerCase(),x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,fontSize:s.fontSize,lineHeight:s.lineHeight});
        }
      } catch {status.textContent='Seletor CSS inválido. Guias mantidas; contornos indisponíveis.';}
    }
    shadow.querySelector('#labels').disabled = !shadow.querySelector('#bounds').checked;
    if(shadow.querySelector('#bounds').checked) for(const r of observed) {
      const y=r.y-scroll,x=r.x-(stage?0:scrollX);
      if(y+r.height<0||y>height)continue;
      node('rect',{x,y,width:r.width,height:r.height,fill:'none',stroke:'#a855f7','stroke-dasharray':'4 3','stroke-width':1,'data-kind':'observed'});
      if(shadow.querySelector('#labels').checked) node('text',{x:x+2,y:y-3,fill:'#9333ea','font-size':11,'data-kind':'measurement'},`${r.label || 'caixa'} · ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    last={viewportWidth:width,mode:stage?'screenshot':'live',referenceFixed:fixed,grid,sections,observed};
  }
  function schedule(){if(!stopped&&!frame)frame=requestAnimationFrame(render);}
  form.addEventListener('submit',e=>{e.preventDefault();fixed=!fixed;fields.forEach(f=>f.disabled=fixed);form.querySelector('button').textContent=fixed?'Recalibrar referência':'Fixar referência';render();});
  shadow.addEventListener('input',schedule);
  shadow.querySelector('#collapse').onclick=e=>{const panel=shadow.querySelector('#panel');panel.hidden=!panel.hidden;e.target.textContent=panel.hidden?'Expandir':'Recolher';e.target.setAttribute('aria-expanded',String(!panel.hidden));};
  shadow.querySelector('#export').onclick=()=>{
    render();const url=URL.createObjectURL(new Blob([JSON.stringify(last,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='grid-medidas.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const resize = new ResizeObserver(schedule);resize.observe(stage || document.documentElement);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  document.addEventListener('load',schedule,true);document.fonts?.ready.then(schedule);
  const changes = new MutationObserver(schedule);
  changes.observe(document.body,{subtree:true,childList:true,attributes:true,characterData:true});
  shadow.querySelector('#close').onclick=()=>{stopped=true;cancelAnimationFrame(frame);resize.disconnect();changes.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);document.removeEventListener('load',schedule,true);host.remove();};
  picture?.addEventListener('load',schedule);render();
})();
