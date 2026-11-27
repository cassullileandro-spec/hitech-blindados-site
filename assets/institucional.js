function formatContactMessage(values) {
  const name = String(values.get('nome') || '').trim();
  const email = String(values.get('email') || '').trim();
  const vehicle = String(values.get('veiculo') || '').trim();
  const message = String(values.get('text') || '').trim();
  const subject = CONTACT_MESSAGES[values.get('assunto')] || CONTACT_MESSAGES.empresa;
  return [subject, `Meu nome é ${name}.`, email ? `E-mail para retorno: ${email}` : '', vehicle ? `Veículo: ${vehicle}` : '', message].filter(Boolean).join('\n\n');
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

// A prévia estática encaminha ao WhatsApp. Destinatários recebidos em 25/11 estão
// na preparação privada wordpress/v2/formularios.json; ativar o envio no WordPress.
const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    window.location.assign('https://wa.me/5511975548105?text=' + encodeURIComponent(formatContactMessage(new FormData(inquiryForm))));
  });
}

// PDFs trocáveis (assets/docs): o botão só aparece quando o arquivo existe.
document.querySelectorAll('a[data-doc]').forEach(link => {
  fetch(link.href, { method: 'HEAD' }).then(response => { if (response.ok) link.hidden = false; }).catch(() => {});
});
