// Read-only browser audit: run after navigation at each viewport and theme.
() => {
  const failures = [], root = document.documentElement, theme = root.dataset.theme;
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const style = (e, pseudo) => getComputedStyle(e, pseudo);
  const expectedBg = theme === 'light' ? 'rgb(244, 246, 248)' : 'rgb(8, 9, 11)';
  check(style(document.body).backgroundColor === expectedBg, 'Fundo diferente do aprovado');
  check(style(document.body).color === (theme === 'light' ? 'rgb(65, 65, 65)' : 'rgb(243, 241, 236)'), 'Texto principal diferente do aprovado');
  const cards = [...document.querySelectorAll('.company-policy-card,.car-card,.info-card,.buy-card,.sim,.filters,.contact-direct a,.inquiry-form,.pdp-block .spec,.table-wrap,.category-card')];
  for (const e of cards) {
    if (e.matches('.category-card:hover')) continue;
    const s = style(e);
    check(theme !== 'light' || (s.backgroundColor === 'rgb(249, 249, 249)' && s.backgroundImage === 'none'), `Card fora do F9F9F9: ${e.className}`);
    check(theme !== 'dark' || s.backgroundColor !== 'rgb(249, 249, 249)', `Card claro indevido no dark: ${e.className}`);
  }
  let photos = 0;
  for (const [selector,pseudo] of [['.photo-card','::before'],['.photo-hero','::after'],['.home-factory-panorama','::before'],['.home-homologations-photo,.editorial-split > figure,.story-slide','::after']]) {
    for(const e of document.querySelectorAll(selector)) {
      photos++;
      const s = style(e,pseudo);
      check(s.opacity === '0.2' && s.mixBlendMode === 'color' && s.backgroundColor === 'rgb(62, 155, 224)', `Camada fotográfica inconsistente: ${e.className}`);
    }
  }
  for (const e of document.querySelectorAll('.car-media,.category-card,.pg-main,.pg-thumbs,.lightbox')) {
    for (const pseudo of ['::before','::after']) check(style(e,pseudo).mixBlendMode !== 'color', `Filtro indevido no veículo: ${e.className}`);
  }
  const logo = document.querySelector('.header .logo img');
  check(theme === 'light' ? style(logo).filter.includes('brand-logo-light') : style(logo).filter === 'none', 'Logo incompatível com o tema');
  const controls = [...document.querySelectorAll('.header .logo,.theme-toggle,.menu-toggle')].filter(e=>e.getBoundingClientRect().width);
  const rects = controls.map(e=>e.getBoundingClientRect());
  check(rects.every(r=>r.left>=0 && r.right<=innerWidth), 'Controle do cabeçalho fora da tela');
  check(rects.every((r,i)=>!i || r.left>=rects[i-1].right), 'Controles do cabeçalho sobrepostos');
  check(root.scrollWidth<=innerWidth+1, 'Overflow horizontal');
  return {page:location.pathname,width:innerWidth,theme,cards:cards.length,photos,failures};
}
