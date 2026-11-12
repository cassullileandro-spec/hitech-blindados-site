/* Aplicado antes do CSS para manter o tema entre páginas sem piscar. */
function applyTheme(theme) {
  const selected = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = selected;
  document.documentElement.style.colorScheme = selected;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = selected === 'light' ? '#F4F6F8' : '#08090B';
}
try { applyTheme(localStorage.getItem('hitech-theme')); }
catch { applyTheme('light'); }
