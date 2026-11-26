function formatContactMessage(values) {
  const name = String(values.get('nome') || '').trim();
  const vehicle = String(values.get('veiculo') || '').trim();
  const message = String(values.get('text') || '').trim();
  const subject = CONTACT_MESSAGES[values.get('assunto')] || CONTACT_MESSAGES.empresa;
  return [subject, `Meu nome é ${name}.`, vehicle ? `Veículo: ${vehicle}` : '', message].filter(Boolean).join('\n\n');
}

renderChrome(document.body.dataset.page);

// O link de uma marca na home já abre o respectivo programa.
function openLinkedHomologation() {
  const program = document.getElementById(location.hash.slice(1));
  if (!program?.matches('.homolog-program')) return;
  program.open = true;
  requestAnimationFrame(() => program.scrollIntoView({ block: 'start' }));
}
openLinkedHomologation();
window.addEventListener('hashchange', openLinkedHomologation);

// Cópia por e-mail para os gestores (call de 17/11). Fica desligada até a Hi-Tech definir quem recebe
// (tarefa 28). No WordPress vira a ação "E-mail" do Form do Elementor, antes do redirecionamento ao WhatsApp.
const CONTACT_EMAIL = { endpoint: '', recipients: [] };
function sendContactEmail(values) {
  if (!CONTACT_EMAIL.endpoint || !navigator.sendBeacon) return false;
  const body = new FormData();
  for (const [key, value] of values) body.append(key, value);
  body.append('destinatarios', CONTACT_EMAIL.recipients.join(','));
  body.append('pagina', location.href);
  return navigator.sendBeacon(CONTACT_EMAIL.endpoint, body);
}

const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    sendContactEmail(new FormData(inquiryForm));
    window.location.assign('https://wa.me/5511975548105?text=' + encodeURIComponent(formatContactMessage(new FormData(inquiryForm))));
  });
}

// PDFs trocáveis (assets/docs): o botão só aparece quando o arquivo existe.
document.querySelectorAll('a[data-doc]').forEach(link => {
  fetch(link.href, { method: 'HEAD' }).then(response => { if (response.ok) link.hidden = false; }).catch(() => {});
});
