/* Inspetor portátil da skill, disponível somente em ?grid=1. */
(() => {
  const wrap = document.querySelector('main .wrap') || document.querySelector('.wrap');
  if (!wrap) return;
  const box = wrap.getBoundingClientRect();
  const style = getComputedStyle(wrap);
  const width = document.documentElement.clientWidth;
  const config = document.createElement('script');
  config.type = 'application/json';
  config.id = 'grid-inspector-config';
  config.textContent = JSON.stringify({
    viewportWidth: width,
    showSections: true,
    sectionSelector: 'main > header, main > section, footer, [data-grid-padding]',
    grid: {
      left: box.left + parseFloat(style.paddingLeft),
      right: width - box.right + parseFloat(style.paddingRight),
      columns: width <= 600 ? 4 : width <= 1080 ? 8 : 12,
      gap: Math.max(24, Math.min(40, width * .03)),
      fine: 8, strong: 64, origin: 0
    }
  });
  const inspector = document.createElement('script');
  inspector.src = new URL('grid-inspector.js?v=composicao-20261105', document.currentScript.src).href;
  document.body.append(config, inspector);
})();
