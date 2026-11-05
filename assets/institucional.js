function formatContactMessage(values) {
  const name = String(values.get('nome') || '').trim();
  const vehicle = String(values.get('veiculo') || '').trim();
  const message = String(values.get('text') || '').trim();
  const subject = CONTACT_MESSAGES[values.get('assunto')] || CONTACT_MESSAGES.empresa;
  return [subject, `Meu nome é ${name}.`, vehicle ? `Veículo: ${vehicle}` : '', message].filter(Boolean).join('\n\n');
}

renderChrome(document.body.dataset.page);

const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    window.location.assign('https://wa.me/5511975548105?text=' + encodeURIComponent(formatContactMessage(new FormData(inquiryForm))));
  });
}
