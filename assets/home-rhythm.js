/* Completa só a caixa externa; mantém cap height/baseline e o reflow do texto. */
(() => {
  const texts = [...document.querySelectorAll('.home main :is(h1,h2,h3,p):not(.car-card *)')];
  let frame = 0;
  function alignTextBoxes() {
    frame = 0;
    const changes = texts.map(element => {
      const previous = parseFloat(element.style.getPropertyValue('--text-rhythm-tail')) || 0;
      const height = element.getBoundingClientRect().height;
      if (!height) return null;
      const natural = height - previous;
      const padding = Math.ceil((natural - 0.01) / 8) * 8 - natural;
      return Math.abs(padding - previous) > 0.01 ? { element, padding: Math.max(0, padding) } : null;
    });
    for (const change of changes) {
      if (change) change.element.style.setProperty('--text-rhythm-tail', `${change.padding}px`);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(alignTextBoxes);
  }
  const observer = new ResizeObserver(schedule);
  texts.forEach(element => observer.observe(element));
  document.fonts.ready.then(schedule);
  document.fonts.addEventListener('loadingdone', schedule);
  schedule();
})();
