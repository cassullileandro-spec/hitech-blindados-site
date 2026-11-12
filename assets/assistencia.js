const servicePhoto = document.getElementById('service-photo');
const serviceDetails = document.querySelectorAll('.assistance-services-list details');

serviceDetails.forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    serviceDetails.forEach(other => {
      if (other !== detail) other.open = false;
    });
    const base = 'assets/media/hitech/' + detail.dataset.photo;
    const large = base + (detail.dataset.photo === 'ajuste-porta' ? '-1600' : '') + '.webp';
    servicePhoto.srcset = `${base}-800.webp 800w, ${large} 1600w`;
    servicePhoto.src = large;
    servicePhoto.alt = detail.dataset.photoAlt;
  });
});
