(() => {
  const section = document.getElementById('processo');
  const buttons = [...section.querySelectorAll('[data-process-step]')];
  const scenes = [...section.querySelectorAll('[data-process-photo]')];
  const details = [...section.querySelectorAll('[data-process-detail]')];
  const playback = section.querySelector('.process-play');
  const liveRegion = section.querySelector('.process-details');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 6500;
  let selected = 0;
  let elapsed = 0;
  let previousTime = 0;
  let frame = 0;
  let visible = false;
  let paused = reducedMotion.matches;

  function select(index) {
    selected = index;
    elapsed = 0;
    section.style.setProperty('--process-progress', 0);
    buttons.forEach((button, position) => {
      button.setAttribute('aria-pressed', String(position === index));
      button.classList.toggle('is-complete', position < index);
      scenes[position].toggleAttribute('hidden', position !== index);
      details[position].hidden = position !== index;
    });
  }

  function tick(time) {
    if (previousTime) elapsed += time - previousTime;
    previousTime = time;
    if (elapsed >= duration) select((selected + 1) % buttons.length);
    section.style.setProperty('--process-progress', Math.max(0, Math.min(1, (elapsed - 4500) / 2000)));
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    const running = !paused && visible && !document.hidden;
    section.dataset.running = String(running);
    playback.setAttribute('aria-label', paused ? 'Reproduzir sequência' : 'Pausar sequência');
    playback.innerHTML = paused ? 'Reproduzir <span aria-hidden="true">▶</span>' : 'Pausar <span aria-hidden="true">Ⅱ</span>';
    liveRegion.setAttribute('aria-live', paused ? 'polite' : 'off');
    if (running) frame = requestAnimationFrame(tick);
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    select(index);
    syncPlayback();
  }));
  playback.addEventListener('click', () => {
    paused = !paused;
    syncPlayback();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0 }).observe(section);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    syncPlayback();
  });
  select(0);
  syncPlayback();
})();
