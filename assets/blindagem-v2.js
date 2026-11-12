(() => {
  const stage = document.querySelector('#explorer-stage');
  if (!stage) return;
  const viewport = stage.querySelector('.explorer-viewport');
  const image = stage.querySelector('.explorer-frame');
  const label = stage.querySelector('.explorer-angle');
  const status = stage.querySelector('.explorer-loading');
  const retry = stage.querySelector('.explorer-retry');
  const controls = [...stage.querySelectorAll('[data-spin]')];
  const play = stage.querySelector('[data-spin="play"]');
  const parts = [...document.querySelectorAll('.explorer-parts [data-part]')];
  const panels = [...document.querySelectorAll('[data-detail]')];
  const views = ['frontal', 'dianteira esquerda', 'dianteira esquerda', 'lateral esquerda', 'traseira esquerda', 'traseira esquerda', 'traseira', 'traseira direita', 'traseira direita', 'lateral direita', 'dianteira direita', 'dianteira direita'];
  const sources = views.map((_, i) => `assets/media/cayenne-360/cayenne-${String(i * 30).padStart(3, '0')}.webp`);
  // shortcut: 12 AI poses form a stepped spin; use a rendered model for a continuous, geometrically exact turntable.
  const areas = { vidros: [2, 53, 36], portas: [3, 49, 54], opaca: [3, 52, 25], unioes: [3, 54, 40], pneus: [3, 25, 67], mecanismos: [3, 46, 51] };
  let frame = 2, ready = false, timer = null, drag = null;
  function stop() {
    clearInterval(timer);
    timer = null;
    play.textContent = 'Girar 360°';
    play.setAttribute('aria-pressed', 'false');
  }
  function show(index, point) {
    if (!ready) return;
    frame = (index % sources.length + sources.length) % sources.length;
    image.src = sources[frame];
    image.alt = `Porsche Cayenne prata, vista ${views[frame]}. Imagem gerada por IA.`;
    viewport.setAttribute('aria-valuenow', frame * 30);
    viewport.setAttribute('aria-valuetext', `${frame * 30} graus, vista ${views[frame]}`);
    label.textContent = `${frame * 30}° / 360°`;
    const clamp = value => Math.max(-50, Math.min(50, value));
    image.style.transform = point ? `translate(${clamp((50 - point[0]) * 2)}%, ${clamp((50 - point[1]) * 2)}%) scale(2)` : '';
  }
  parts.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.part;
    if (!areas[key]) return;
    stop();
    panels.forEach(panel => { panel.hidden = panel.dataset.detail !== key; });
    parts.forEach(part => part.setAttribute('aria-pressed', String(part === button)));
    const [index, x, y] = areas[key];
    show(index, [x, y]);
  }));
  controls.forEach(button => button.addEventListener('click', () => {
    if (!ready) return;
    const action = button.dataset.spin;
    if (action === 'play' && timer === null) {
      show(frame);
      play.textContent = 'Pausar giro';
      play.setAttribute('aria-pressed', 'true');
      timer = setInterval(() => show(frame + 1), 350);
    } else {
      stop();
      if (action === 'reset') show(2);
      if (action === 'previous') show(frame - 1);
      if (action === 'next') show(frame + 1);
    }
  }));
  viewport.addEventListener('keydown', event => {
    const target = { ArrowLeft: frame - 1, ArrowRight: frame + 1, ArrowUp: frame + 1, ArrowDown: frame - 1, Home: 0, End: 11, Escape: 2 }[event.key];
    if (target === undefined || !ready) return;
    event.preventDefault();
    stop();
    show(target);
  });
  viewport.addEventListener('pointerdown', event => {
    if (!ready || !event.isPrimary || event.button !== 0) return;
    stop();
    drag = { x: event.clientX, y: event.clientY, frame, id: event.pointerId, active: false };
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      if (Math.abs(dx) < 8) return;
      drag.active = true;
      viewport.setPointerCapture(event.pointerId);
    }
    if (event.cancelable) event.preventDefault();
    show(drag.frame - Math.round(dx / 24));
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => viewport.addEventListener(type, () => { drag = null; }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('blur', stop);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', stop);
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }).observe(stage);
  async function load() {
    stop();
    ready = false;
    viewport.setAttribute('aria-disabled', 'true');
    controls.forEach(button => { button.disabled = true; });
    retry.hidden = true;
    status.hidden = false;
    status.textContent = 'Carregando os ângulos…';
    try {
      await Promise.all(sources.map(src => new Promise((resolve, reject) => {
        const preload = new Image();
        const timeout = setTimeout(() => reject(new Error('timeout')), 15000);
        preload.onload = () => { clearTimeout(timeout); resolve(); };
        preload.onerror = () => { clearTimeout(timeout); reject(new Error('image')); };
        preload.src = src;
      })));
      ready = true;
      viewport.setAttribute('aria-disabled', 'false');
      controls.forEach(button => { button.disabled = false; });
      status.hidden = true;
      show(frame);
    } catch {
      status.textContent = 'Não foi possível carregar todos os ângulos. Tente novamente.';
      retry.hidden = false;
    }
  }
  retry.addEventListener('click', load);
  load();
})();
