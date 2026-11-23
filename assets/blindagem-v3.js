(() => {
  const stage = document.querySelector('#compass-tour');
  if (!stage) return;
  const image = stage.querySelector('.tour-frame');
  const camera = stage.querySelector('.tour-camera');
  const cut = stage.querySelector('.tour-cut');
  const dragSurface = stage.querySelector('.tour-drag');
  const pins = stage.querySelector('.tour-pins');
  const panel = stage.querySelector('.tour-detail');
  const content = stage.querySelector('.tour-panel-content');
  const status = stage.querySelector('.tour-status');
  const hint = stage.querySelector('#tour-hint');
  const play = stage.querySelector('[data-action="play"]');
  const retry = stage.querySelector('[data-action="retry"]');
  const modes = [...stage.querySelectorAll('[data-mode]')];
  const parts = [...document.querySelectorAll('.tour-section [data-part]')];
  const articles = [...panel.querySelectorAll('[data-detail]')];
  const keys = articles.map(article => article.dataset.detail);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // shortcut: meia volta (0–180°) gerada no Kling, sem versão aberta; giro completo precisa de modelo 3D.
  const count = 37, home = 0, root = 'assets/media/suv-generico/';
  const images = new Map();
  // O corte tem o mesmo quadro do giro; ambos acompanham a mesma câmera.
  const views = {
    vidros:[.22,.10,1.6], portas:[.29,.25,1.6], opaca:[.25,.07,1.6],
    unioes:[.25,.12,1.6], pneus:[.19,.35,1.6], mecanismos:[.29,.23,1.6]
  };
  let cameraPart = null, fade = null;
  let mode = 'closed', frame = home, active = null, ready = false, busy = false;
  let timer = null, direction = 1, drag = null, revision = 0, retryAction = null, lastTrigger = null;
  const source = (state, index) => `${root}${String(index).padStart(3, '0')}.webp?v=kling2`;
  const cutSource = key => `${root}cortes/${key}.webp?v=suv4`;
  function moveCamera(key) {
    cameraPart = key;
    const [x,y,s] = views[key] || [0,0,1];
    camera.style.transform = key ? `translate(${-s*x*100}%, ${-s*y*100}%) scale(${s})` : 'none';
  }
  function showCut(src, alt) {
    fade?.cancel(); fade = null;
    cut.src = src; cut.alt = alt; cut.hidden = false;
    if (!reduced.matches) fade = cut.animate([{opacity:0},{opacity:1}], {duration:520,delay:880,fill:'backwards',easing:'ease-in-out'});
  }
  function hideCut() {
    fade?.cancel(); fade = null;
    if (cut.hidden || reduced.matches) { cut.hidden = true; return; }
    const animation = cut.animate([{opacity:1},{opacity:0}], {duration:420,fill:'forwards',easing:'ease-out'});
    fade = animation;
    animation.onfinish = () => { if (fade === animation) { cut.hidden = true; animation.cancel(); fade = null; } };
  }
  function loadImage(src) {
    if (images.has(src)) return images.get(src);
    const promise = new Promise((resolve, reject) => {
      const preload = new Image();
      const timeout = setTimeout(() => reject(new Error('timeout')), 15000);
      preload.onload = () => { clearTimeout(timeout); resolve(); };
      preload.onerror = () => { clearTimeout(timeout); reject(new Error('image')); };
      preload.src = src;
    });
    images.set(src, promise);
    promise.catch(() => images.delete(src));
    return promise;
  }
  const loadMode = state => Promise.all(Array.from({ length: count }, (_, i) => loadImage(source(state, i))));
  function stop() {
    clearInterval(timer); timer = null;
    play.textContent = 'Girar';
    play.setAttribute('aria-pressed', 'false');
  }
  function setBusy(value) {
    busy = value;
    stage.setAttribute('aria-busy', String(value));
    dragSurface.setAttribute('aria-disabled', String(value || !ready));
    stage.querySelectorAll('[data-action="previous"], [data-action="next"], [data-action="play"]').forEach(button => { button.disabled = value || !ready; });
  }
  function closePanel() {
    moveCamera(null); hideCut();
    active = null;
    panel.hidden = true;
    stage.classList.remove('has-detail');
    parts.forEach(button => button.setAttribute('aria-expanded', 'false'));
  }
  function render(index) {
    frame = Math.max(0, Math.min(count - 1, index));
    image.src = source(mode, frame); image.alt = `SUV conceitual sem marca, ângulo ${frame * 5} graus. Imagem gerada por IA.`;
    dragSurface.setAttribute('aria-valuenow', String(frame * 5));
    dragSurface.setAttribute('aria-valuetext', `${frame * 5} graus, ${mode === 'open' ? 'aberto' : 'fechado'}`);
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    pins.hidden = !!active || frame !== home || mode !== 'closed' || timer !== null;
    hint.textContent = pins.hidden ? 'Arraste para girar. “Visão geral” traz os pontos de proteção.' : 'Arraste para girar. Toque nos números para explorar.';
  }
  async function changeMode(next, index = frame) {
    if (next !== 'closed') return;
    const ticket = ++revision;
    stop(); closePanel(); pins.hidden = true; setBusy(true);
    retry.hidden = true;
    status.textContent = 'Preparando o giro…';
    try {
      await loadMode(next);
      if (ticket !== revision) return;
      mode = next; ready = true; render(index);
      status.textContent = '';
    } catch {
      if (ticket !== revision) return;
      status.textContent = 'Não foi possível carregar esse giro. A imagem atual foi mantida.';
      retryAction = () => changeMode(next, index); retry.hidden = false;
    } finally {
      if (ticket === revision) setBusy(false);
    }
  }
  async function select(key, trigger) {
    if (!keys.includes(key)) return;
    const ticket = ++revision;
    stop(); setBusy(true); pins.hidden = true; retry.hidden = true;
    lastTrigger = trigger || lastTrigger;
    active = key;
    panel.hidden = false; stage.classList.add('has-detail');
    articles.forEach(article => { article.hidden = article.dataset.detail !== key; });
    panel.scrollTop = 0;
    parts.forEach(button => button.setAttribute('aria-expanded', String(button.dataset.part === key)));
    stage.querySelector('.tour-detail-count').textContent = `${String(keys.indexOf(key) + 1).padStart(2, '0')} / 06`;
    status.textContent = 'Preparando o corte ilustrativo…';
    if (!reduced.matches) content.animate([{ opacity:0, transform:'translateY(14px)' }, { opacity:1, transform:'none' }], { duration:320, easing:'ease-out' });
    try {
      await Promise.all([loadMode('closed'), loadImage(cutSource(key))]);
      if (ticket !== revision) return;
      if (!cameraPart) { mode = 'closed'; ready = true; render(home); }
      moveCamera(key);
      showCut(cutSource(key), `Ilustração gerada por IA: ${articles[keys.indexOf(key)].querySelector('h2').textContent}. Corte conceitual; não representa a construção real.`);
      hint.textContent = 'Corte ilustrativo. “Visão geral” recompõe o veículo.';
      status.textContent = '';
    } catch {
      if (ticket !== revision) return;
      moveCamera(null); hideCut();
      if (ready) render(frame);
      status.textContent = 'O corte não carregou. Você pode consultar a explicação no card.';
      retryAction = () => select(key, lastTrigger); retry.hidden = false;
    } finally {
      if (ticket === revision) {
        setBusy(false); panel.focus({ preventScroll:true });
        if (trigger?.closest('.tour-parts')) stage.scrollIntoView({ behavior:reduced.matches ? 'instant' : 'smooth', block:'start' });
      }
    }
  }
  function step(delta) {
    if (!ready || busy) return;
    ++revision; stop(); closePanel(); status.textContent = ''; retry.hidden = true;
    render(frame + delta);
  }
  parts.forEach(button => button.addEventListener('click', () => select(button.dataset.part, button)));
  modes.forEach(button => button.addEventListener('click', () => changeMode(button.dataset.mode)));
  stage.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', async () => {
    const action = button.dataset.action;
    if (action === 'previous') return step(-1);
    if (action === 'next') return step(1);
    if (action === 'home') return changeMode('closed', home);
    if (action === 'retry') return retryAction?.();
    if (action === 'close') {
      ++revision; closePanel(); setBusy(false); status.textContent = ''; retry.hidden = true;
      if (!ready) changeMode(mode, frame); else render(frame);
      lastTrigger?.focus({ preventScroll:true });
      return;
    }
    if (action.endsWith('-detail')) {
      const current = keys.indexOf(active);
      return select(keys[(current + (action === 'next-detail' ? 1 : -1) + keys.length) % keys.length]);
    }
    if (action === 'play') {
      if (!ready || busy) return;
      if (timer !== null) { stop(); render(frame); return; }
      ++revision; closePanel(); render(frame); pins.hidden = true;
      play.textContent = 'Pausar giro'; play.setAttribute('aria-pressed', 'true');
      timer = setInterval(() => { if (frame + direction < 0 || frame + direction > count - 1) direction = -direction; render(frame + direction); }, 85);
    }

  }));
  stage.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      ++revision; closePanel(); setBusy(false); status.textContent = ''; retry.hidden = true;
      if (!ready) changeMode(mode, frame); else render(frame);
      lastTrigger?.focus({ preventScroll:true });
    }
  });
  dragSurface.addEventListener('keydown', event => {
    if (!ready || busy) return;
    const index = { ArrowLeft:frame - 1, ArrowRight:frame + 1, ArrowUp:frame + 1, ArrowDown:frame - 1, Home:0, End:count - 1 }[event.key];
    if (index === undefined) return;
    event.preventDefault(); step(index - frame);
  });
  dragSurface.addEventListener('pointerdown', event => {
    if (!ready || busy || !event.isPrimary || event.button !== 0) return;
    stop();
    drag = { x:event.clientX, y:event.clientY, frame, id:event.pointerId, active:false };
  });
  dragSurface.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      if (Math.abs(dx) < 6) return;
      drag.active = true; ++revision; closePanel(); dragSurface.setPointerCapture(event.pointerId);
    }
    if (event.cancelable) event.preventDefault();
    render(drag.frame - Math.round(dx / 5));
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => dragSurface.addEventListener(type, () => { drag = null; }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('blur', stop);
  reduced.addEventListener('change', stop);
  window.addEventListener('resize', () => moveCamera(cameraPart));
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }).observe(stage);
  changeMode('closed', home);
})();
