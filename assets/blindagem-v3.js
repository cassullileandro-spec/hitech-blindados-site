(() => {
  const stage = document.querySelector('#compass-tour');
  if (!stage) return;
  const image = stage.querySelector('.tour-frame');
  const camera = stage.querySelector('.tour-camera');
  const previousImage = stage.querySelector('.tour-transition-image');
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
  const count = 72, home = 9, root = 'assets/media/compass-v3/';
  const images = new Map();
  const views = {
    vidros:[.43,.36], portas:[.57,.54], opaca:[.57,.27],
    unioes:[.51,.39], pneus:[.44,.69], mecanismos:[.57,.50]
  };
  let cameraPart = null, reveal = null;
  let mode = 'closed', frame = home, active = null, ready = false, busy = false;
  let timer = null, drag = null, revision = 0, retryAction = null, lastTrigger = null;
  const source = (state, index) => `${root}${state}/${String(index).padStart(3, '0')}.webp?v=hq2`;
  const cutSource = key => `${root}cuts-upscaled/${key}.webp?v=photo1080-1`;
  function moveCamera(key) {
    cameraPart = key;
    const [x,y] = views[key] || [0,0];
    // Keep the selected point anchored while enlarging the existing whole-car image.
    camera.style.transform = key ? `translate(${-15*x}%, ${-15*y}%) scale(1.15)` : 'none';
  }
  function showImage(src, alt, crossfade = false) {
    const previous = image.src;
    reveal?.cancel(); reveal = null; previousImage.hidden = true;
    image.src = src; image.alt = alt;
    if (!crossfade || reduced.matches || !previous || previous.endsWith(src)) return;
    previousImage.src = previous; previousImage.hidden = false;
    const animation = previousImage.animate([{opacity:1},{opacity:0}], {duration:520,delay:160,fill:'both',easing:'ease-in-out'});
    reveal = animation;
    animation.onfinish = () => { if (reveal === animation) { previousImage.hidden = true; animation.cancel(); reveal = null; } };
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
    play.textContent = 'Girar 360°';
    play.setAttribute('aria-pressed', 'false');
  }
  function setBusy(value) {
    busy = value;
    stage.setAttribute('aria-busy', String(value));
    dragSurface.setAttribute('aria-disabled', String(value || !ready));
    stage.querySelectorAll('[data-action="previous"], [data-action="next"], [data-action="play"]').forEach(button => { button.disabled = value || !ready; });
  }
  function closePanel() {
    moveCamera(null);
    active = null;
    panel.hidden = true;
    stage.classList.remove('has-detail');
    parts.forEach(button => button.setAttribute('aria-expanded', 'false'));
  }
  function render(index) {
    frame = (index % count + count) % count;
    showImage(source(mode, frame), `Jeep Compass ${mode === 'open' ? 'com portas, capô e porta-malas abertos' : 'fechado'}, ângulo ${frame * 5} graus. Fotografia CarWale.`, image.src?.includes('/cuts-upscaled/'));
    dragSurface.setAttribute('aria-valuenow', String(frame * 5));
    dragSurface.setAttribute('aria-valuetext', `${frame * 5} graus, ${mode === 'open' ? 'aberto' : 'fechado'}`);
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    pins.hidden = !!active || frame !== home || mode !== 'closed' || timer !== null;
    hint.textContent = mode === 'open' ? 'Portas e tampas abertas. Arraste para ver de todos os lados.' : pins.hidden ? 'Arraste para girar. “Visão geral” traz os pontos de proteção.' : 'Arraste para girar. Toque nos números para explorar.';
  }
  async function changeMode(next, index = frame) {
    if (!['closed', 'open'].includes(next)) return;
    const ticket = ++revision;
    stop(); closePanel(); pins.hidden = true; setBusy(true);
    retry.hidden = true;
    status.textContent = next === 'open' ? 'Preparando o Compass aberto…' : 'Preparando o giro…';
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
      showImage(cutSource(key), `Ilustração gerada por IA: ${articles[keys.indexOf(key)].querySelector('h2').textContent}. Corte conceitual sobre o Compass; não representa sua construção real.`, true);
      hint.textContent = 'Corte ilustrativo. “Visão geral” recompõe o exterior.';
      status.textContent = '';
    } catch {
      if (ticket !== revision) return;
      moveCamera(null);
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
      timer = setInterval(() => render(frame + 1), 85);
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
  reduced.addEventListener('change', () => { stop(); reveal?.cancel(); reveal = null; previousImage.hidden = true; });
  window.addEventListener('resize', () => moveCamera(cameraPart));
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }).observe(stage);
  // shortcut: open/closed use aligned photos; individual door animation needs a licensed 3D model.
  changeMode('closed', home);
})();
