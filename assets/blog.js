function normalizeBlogText(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}
function matchesBlogQuery(text, query) {
  const haystack = normalizeBlogText(text);
  return normalizeBlogText(query).trim().split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}
if (typeof module !== 'undefined') module.exports = {normalizeBlogText, matchesBlogQuery};
if (typeof document !== 'undefined') {
  const form = document.querySelector('.blog-search');
  if (form) {
    const input = form.querySelector('input');
    const cards = [...document.querySelectorAll('[data-blog-card]')];
    const count = document.getElementById('blog-count');
    const empty = document.getElementById('blog-empty');
    const feature = document.querySelector('.blog-feature');
    function filter(updateURL = true) {
      const query = input.value.trim();
      let visible = 0;
      cards.forEach(card => { card.hidden = !matchesBlogQuery(card.dataset.search, query); if (!card.hidden) visible++; });
      count.textContent = `${visible} ${visible === 1 ? 'artigo encontrado' : 'artigos encontrados'}`;
      empty.hidden = visible > 0;
      if (feature) feature.hidden = Boolean(query);
      if (updateURL) {
        const url = new URL(window.location.href);
        if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
        history.replaceState(null, '', url);
      }
    }
    function restore() { input.value = (new URLSearchParams(location.search).get('q') || '').slice(0,120); filter(false); }
    form.addEventListener('submit', event => { event.preventDefault(); filter(); });
    input.addEventListener('input', () => filter());
    window.addEventListener('popstate', restore);
    restore();
  }
  const copy = document.getElementById('copy-article');
  if (copy) copy.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      const url = new URL(location.href); url.search = ''; url.hash = '';
      await navigator.clipboard.writeText(url.href);
      status.textContent = 'Link copiado.';
    } catch { status.textContent = 'Não foi possível copiar. Use o endereço da barra do navegador.'; }
  });
}
