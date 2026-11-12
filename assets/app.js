/* ============================================================
   Hi-Tech Blindados — Protótipo — lógica compartilhada
   ============================================================ */

const CONTACT_MESSAGES = {
  blindagem: 'Olá! Gostaria de um orçamento para blindar meu veículo.',
  estoque: 'Olá! Tenho interesse em um veículo do estoque Hi-Tech.',
  assistencia: 'Olá! Gostaria de agendar uma assistência para meu blindado.',
  revisao: 'Olá! Gostaria de agendar a revisão da blindagem do meu veículo.',
  consignacao: 'Olá! Gostaria de conversar sobre a venda ou consignação do meu veículo.',
  jeep: 'Olá! Gostaria de conhecer os modelos e as condições da blindagem certificada Jeep.',
  caoa: 'Olá! Gostaria de conhecer os modelos e as condições da blindagem homologada CAOA.',
  gwm: 'Olá! Gostaria de conhecer os modelos e as condições da blindagem certificada GWM.',
  empresa: 'Olá! Gostaria de conhecer melhor a Hi-Tech e seus serviços.',
  carreiras: 'Olá! Gostaria de informações sobre oportunidades na Hi-Tech e orientação para envio de currículo.',
  documentos: 'Olá! Gostaria da lista de documentos para iniciar a blindagem do meu veículo.',
  duvidas: 'Olá! Gostaria de tirar algumas dúvidas sobre a blindagem do meu veículo.'
};
const whatsappLink = subject => 'https://wa.me/5511975548105?text=' + encodeURIComponent(CONTACT_MESSAGES[subject] || 'Olá! Gostaria de falar com a equipe da Hi-Tech.');
const WA = whatsappLink('estoque');
function proposalWhatsAppLink(values, vehicle) {
  const field = name => String(values.get(name) || '').trim();
  const url = new URL(whatsappLink('estoque'));
  const message = [CONTACT_MESSAGES.estoque, `Veículo: ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}.`,
    `Nome: ${field('nome')}`, `Telefone: ${field('telefone')}`,
    field('email') ? `E-mail: ${field('email')}` : '', field('mensagem')].filter(Boolean).join('\n\n');
  url.searchParams.set('text', message);
  return url.href;
}
const SITE_PAGES = [
  ['blindagem', 'blindagem.html', 'Processo de blindagem'],
  ['estoque', 'estoque.html', 'Estoque'],
  ['empresa', 'empresa.html', 'A Hi-Tech'],
  ['homologacoes', 'homologacoes.html', 'Homologações'],
  ['assistencia', 'assistencia.html', 'Assistência'],
  ['contato', 'contato.html', 'Contato']
];

/* ---------- Ícones (inline SVG) ---------- */
const I = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  shieldCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.6 1.5-1.5 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.9.6-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.3-10-8.3z"/></svg>',
  door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3M13 20h9M10 12v.01M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.562z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="13" x2="21" y2="13"/><line x1="3" y1="19" x2="21" y2="19"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  chevronL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevronR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2-.97-.28-.1-.48-.15-.68.15-.2.3-.78.96-.96 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.28.17-1.42-.07-.13-.27-.2-.57-.35z"/><path d="M12 2a10 10 0 0 0-8.6 15.06L2 22l5.06-1.33A10 10 0 1 0 12 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.5-.46-5.17a3 3 0 0 0-2.12-2.12C18.75 4.25 12 4.25 12 4.25s-6.75 0-8.42.46a3 3 0 0 0-2.12 2.12C1 8.5 1 12 1 12s0 3.5.46 5.17a3 3 0 0 0 2.12 2.12c1.67.46 8.42.46 8.42.46s6.75 0 8.42-.46a3 3 0 0 0 2.12-2.12C23 15.5 23 12 23 12zM10 15.5v-7l6 3.5z"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-3a9 9 0 0 1 18 0v3"/><path d="M21 16a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3zM3 16a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3z"/></svg>',
};

/* ---------- Helpers ---------- */
const fmtPrice = n => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
const fmtKm = n => n == null ? 'Km sob consulta' : n === 0 ? '0 km' : n.toLocaleString('pt-BR') + ' km';
const armorLabel = c => c.blindado === false ? 'Não blindado' : c.blindado === true ? (c.nivel ? 'Blindado ' + c.nivel : 'Blindado') : 'Blindagem sob consulta';

function parcelaEstimada(preco, entradaPct = 20, meses = 48, taxa = 0.0149) {
  const financiado = preco * (1 - entradaPct / 100);
  const p = financiado * (taxa * Math.pow(1 + taxa, meses)) / (Math.pow(1 + taxa, meses) - 1);
  return p;
}

/* ---------- Header / Footer ---------- */
function renderChrome(active) {
  const isHome = active === 'home';
  const current = active === 'carro' ? 'estoque' : active;
  const overMedia = isHome || active === 'estoque' || !!document.querySelector('main > .photo-hero:first-child');
  if (overMedia || document.body.classList.contains('blindagem-v3')) document.body.classList.add('header-overlay');
  const header = `
  <svg class="brand-filters" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;pointer-events:none"><defs>
    <filter id="brand-logo-light" color-interpolation-filters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 5 0 0" result="accentMask"/>
      <feFlood flood-color="#666666" result="gray"/>
      <feComposite in="gray" in2="SourceAlpha" operator="in" result="grayLogo"/>
      <feComposite in="grayLogo" in2="accentMask" operator="out" result="neutralLogo"/>
      <feComposite in="SourceGraphic" in2="accentMask" operator="in" result="accentLogo"/>
      <feMerge><feMergeNode in="neutralLogo"/><feMergeNode in="accentLogo"/></feMerge>
    </filter>
  </defs></svg>
  <header class="header ${overMedia ? 'over-media' : ''}"><div class="wrap">
    <a href="index.html" class="logo" aria-label="Hi-Tech Blindados">
      <img src="assets/media/logo-hitech.webp" alt="Hi-Tech Blindados">
    </a>
    <nav class="nav" aria-label="Navegação principal">
      ${SITE_PAGES.map(([key, href, label]) => `<a href="${href}"${current === key ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    ${!isHome ? `<div class="header-right">
      <a href="tel:+551132027777" class="header-phone">(11) 3202-7777</a>
      <a href="${whatsappLink('blindagem')}" class="btn btn-wa" data-contact="blindagem">${I.wa} Solicitar orçamento</a>
    </div>` : ''}
    <button class="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Modo escuro"><span class="theme-label theme-label-light" aria-hidden="true">Light</span><span class="theme-track" aria-hidden="true"><span class="theme-thumb"></span></span><span class="theme-label theme-label-dark" aria-hidden="true">Dark</span></button>
    <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu">${I.menu}</button>
  </div></header>`;

  const footer = `
  <footer class="footer" id="contato"><div class="wrap">
    <div class="footer-invitation">
      <div class="footer-intro">
        <p class="footer-intro-title">Conte com a gente em cada etapa.</p>
        <p>Converse sobre blindagem, escolha do veículo ou assistência. Nossa equipe orienta o seu próximo passo.</p>
        <div class="footer-team"><img src="assets/media/logo-hitech.webp" alt="" width="96" height="48" loading="lazy"><div><strong>Equipe Hi-Tech</strong><span>Atendimento e orientação</span></div></div>
      </div>
      <div class="footer-cta">
        <h2>Seu próximo passo começa com uma conversa.</h2>
        <a href="${whatsappLink('empresa')}" class="btn btn-primary" data-contact="empresa">Falar com a Hi-Tech <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo" aria-label="Hi-Tech Blindados"><img src="assets/media/logo-hitech.webp" alt="Hi-Tech Blindados"></a>
        <p>Fábrica própria, showroom e assistência para acompanhar você.</p>
        <div class="socials">
          <a href="https://www.facebook.com/hitechblindados/" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
          <a href="https://www.instagram.com/hitech.blindagens/" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
          <a href="https://www.youtube.com/c/HITECHBLINDADOSOFICIAL/videos" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a>
        </div>
      </div>
      <div><h4>Navegação</h4><ul>
        ${SITE_PAGES.map(([, href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}
        <li><a href="trabalhe-conosco.html"${active === 'carreiras' ? ' aria-current="page"' : ''}>Trabalhe conosco</a></li>
      </ul></div>
      <div><h4>Serviços</h4><ul>
        <li><a href="blindagem.html">Blindagem de veículos</a></li>
        <li><a href="assistencia.html">Assistência técnica</a></li>
        <li><a href="assistencia.html#revisoes">Revisão de blindados</a></li>
        <li><a href="${whatsappLink('consignacao')}" data-contact="consignacao">Consignação</a></li>
        <li><a href="documentos.html">Documentação</a></li>
      </ul></div>
      <div class="footer-units"><h4>Conheça nossas unidades</h4><div class="footer-maps">
        <div class="footer-location">
          <iframe title="Mapa do Showroom Aeroporto Hi-Tech" src="https://www.google.com/maps?q=Av.+Washington+Luis,+5670,+Sao+Paulo,+SP&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <p class="addr"><b>Showroom Aeroporto</b><br>Av. Washington Luís, 5670<br>Jardim Aeroporto — São Paulo/SP<br><a href="tel:+551132027777">(11) 3202-7777</a></p>
          <a href="https://www.google.com/maps/search/?api=1&query=Av.+Washington+Luis+5670+Sao+Paulo" class="footer-unit-link" target="_blank" rel="noopener">Como chegar ↗</a>
        </div>
        <div class="footer-location">
          <iframe title="Mapa da fábrica e assistência Hi-Tech" src="https://www.google.com/maps?q=Rua+Barao+de+Monte+Santo,+426,+Sao+Paulo,+SP&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <p class="addr"><b>Fábrica e assistência</b><br>Rua Barão de Monte Santo, 426<br>Moóca — São Paulo/SP<br><a href="tel:+551132027676">(11) 3202-7676</a></p>
          <a href="https://www.google.com/maps/search/?api=1&query=Rua+Barao+de+Monte+Santo+426+Sao+Paulo" class="footer-unit-link" target="_blank" rel="noopener">Como chegar ↗</a>
        </div>
      </div>
      </div>
    </div>
    <div class="footer-bot">
      <span>© ${new Date().getFullYear()} Hi-Tech Blindados</span>
      <span>Design & desenvolvimento — RNW</span>
    </div>
  </div></footer>
  <a href="${whatsappLink(current === 'estoque' ? 'estoque' : CONTACT_MESSAGES[active] ? active : 'blindagem')}" class="wa-float" aria-label="Falar com a Hi-Tech pelo WhatsApp"><span class="wa-mark" aria-hidden="true">${I.wa}</span><svg class="wa-armor" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path class="wa-shield" d="M32 5 55 14v17c0 14-13 23-23 28C22 54 9 45 9 31V14Z" pathLength="100"/><g class="wa-impact"><path d="m1 9 12 12m-3-7 3 7-7-3M13 21l6-2m-6 2 1 6m-1-6 5 4"/></g><g class="wa-impact wa-impact-two"><path d="m63 15-12 9m6-7-6 7 7-2M51 24l-6-2m6 2-1 6m1-6-5 4"/></g><g class="wa-impact wa-impact-three"><path d="m1 44 12-8m-7 1 7-1-3 6M13 36l6 2m-6-2 1-6m-1 6 5-4"/></g><path class="wa-cracks" d="m13 21 7 5-3 6 6 6m28-14-8 5 3 7-6 5m-27-5 8 5 1 6"/></svg></a>`;

  document.getElementById('site-header').innerHTML = header;
  document.getElementById('site-footer').innerHTML = footer;

  const themeToggle = document.querySelector('.theme-toggle');
  const updateThemeLabel = () => {
    const label = document.documentElement.dataset.theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
    themeToggle.setAttribute('aria-checked', String(document.documentElement.dataset.theme === 'dark'));
    themeToggle.title = label;
  };
  updateThemeLabel();
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('hitech-theme', theme); } catch { /* O tema continua funcionando sem armazenamento. */ }
    updateThemeLabel();
  });

  if (!isHome) document.body.classList.add('inner');

  // Menu mobile
  const menu = document.createElement('div');
  menu.id = 'mobile-menu';
  menu.className = 'mobile-menu';
  menu.setAttribute('role', 'navigation');
  menu.setAttribute('aria-label', 'Navegação móvel');
  menu.inert = true;
  menu.innerHTML = `
    ${SITE_PAGES.map(([key, href, label]) => `<a class="mm-link" href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    <div class="mm-foot">
      <div class="mm-phone">Showroom Aeroporto · (11) 3202-7777</div>
      <a href="${whatsappLink('blindagem')}" class="btn btn-wa btn-lg btn-block">${I.wa} Solicitar orçamento</a>
      <a href="estoque.html" class="btn btn-primary btn-lg btn-block">Ver estoque</a>
    </div>`;
  document.body.appendChild(menu);
  const tog = document.querySelector('.menu-toggle');
  const setMenu = (open) => {
    menu.inert = !open;
    menu.classList.toggle('open', open);
    document.querySelector('.header').classList.toggle('menu-open', open);
    tog.setAttribute('aria-expanded', String(open));
    tog.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    tog.innerHTML = open ? I.close : I.menu;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a').focus();
    else tog.focus({ preventScroll: true });
  };
  tog.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (!menu.classList.contains('open')) return;
    if (event.key === 'Escape') setMenu(false);
    if (event.key === 'Tab') {
      const links = [...menu.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === links[0]) {
        event.preventDefault(); links[links.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
        event.preventDefault(); links[0].focus();
      }
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', event => {
    if (event.matches && menu.classList.contains('open')) setMenu(false);
  });
  document.querySelectorAll('a[data-contact]').forEach(link => {
    link.href = whatsappLink(link.dataset.contact);
  });

  const hdr = document.querySelector('.header');
  const onScroll = () => hdr.classList.toggle('solid', window.scrollY > 48);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  initMotion();
}

/* ---------- Motion: reveal on scroll (com fail-safe) ---------- */
let __ioWorks = false;
function initMotion() {
  const els = [...document.querySelectorAll('.reveal:not(.in)')];
  if (!els.length) return;
  // Se o IntersectionObserver não existe OU já sabemos que não dispara aqui → revela na hora.
  if (!('IntersectionObserver' in window) || window.__revealBroken) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    __ioWorks = true;
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach(e => io.observe(e));
  // Fail-safe: se em 1,2s o observer nunca disparou (iframes/ambientes onde ele não
  // funciona), o conteúdo NUNCA pode ficar invisível — revela tudo e desliga o efeito.
  setTimeout(() => {
    if (!__ioWorks) {
      window.__revealBroken = true;
      document.querySelectorAll('.reveal:not(.in)').forEach(e => e.classList.add('in'));
    }
  }, 1200);
}

/* ---------- Card ---------- */
function carCard(c) {
  return `
  <a href="carro.html?id=${c.id}" class="car-card reveal">
    <div class="car-media">
      <img loading="lazy" src="${c.img}" srcset="${c.imgSrcset || ''}" sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1080px) 45vw, 400px" alt="${c.marca} ${c.modelo}" decoding="async">
      <span class="badge">${c.blindado === true ? I.shield : I.tag} ${armorLabel(c)}</span>
    </div>
    <div class="car-body">
      <span class="car-brand">${c.marca}</span>
      <div class="car-head"><h3>${c.modelo}</h3><span class="car-year">${c.ano}</span></div>
      <p class="ver">${c.versao}</p>
      <div class="car-specs">
        <span>${I.gauge}${fmtKm(c.km)}</span>
        <span>${I.gear}${c.cambio || 'Câmbio sob consulta'}</span>
        <span>${I.fuel}${c.combustivel}</span>
      </div>
      <div class="car-foot">
        <div class="price"><small>à vista</small><b>${fmtPrice(c.preco)}</b></div>
        <span class="car-link">Ver veículo ${I.arrow}</span>
      </div>
    </div>
  </a>`;
}

/* ---------- Preloader: logo preenchendo de baixo pra cima ---------- */
function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  let skip = false;
  try { skip = !!sessionStorage.getItem('htpre'); } catch (e) {}
  if (skip) { pre.remove(); return; }

  const fill = pre.querySelector('.pre-fill');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let p = 0.06;
  const apply = () => {
    if (fill) fill.style.clipPath = `inset(${((1 - p) * 100).toFixed(1)}% 0 0 0)`;
  };
  apply();

  let iv = null;
  if (reduce) { p = 0.9; apply(); }
  else { iv = setInterval(() => { if (p < 0.9) { p = Math.min(0.9, p + Math.random() * 0.10 + 0.02); apply(); } }, 150); }

  const finish = () => {
    if (iv) clearInterval(iv);
    p = 1; apply();
    setTimeout(() => {
      pre.classList.add('done');
      try { sessionStorage.setItem('htpre', '1'); } catch (e) {}
      setTimeout(() => pre.remove(), 650);
    }, reduce ? 120 : 400);
  };

  const start = Date.now();
  const ready = () => {
    const minShow = reduce ? 300 : 1250;
    setTimeout(finish, Math.max(0, minShow - (Date.now() - start)));
  };
  if (document.readyState !== 'loading') ready();
  else document.addEventListener('DOMContentLoaded', ready);
}

// roda assim que o app.js carrega (fim do body → #preloader já existe no DOM)
initPreloader();

// Ferramenta de revisão solicitada, carregada somente com ?grid=1.
if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('grid') === '1') {
  const review = document.createElement('script');
  review.src = new URL('revisao-grid.js?v=composicao-20261105', document.currentScript.src).href;
  document.body.append(review);
}
