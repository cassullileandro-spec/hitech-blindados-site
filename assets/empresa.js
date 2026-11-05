document.querySelectorAll('[data-story-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.story-track');
  const slides = [...track.children];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const status = carousel.querySelector('[data-carousel-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const step = () => slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;

  const update = () => {
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maximum - 2;
    const index = Math.min(slides.length - 1, Math.round(track.scrollLeft / Math.max(1, step())));
    status.textContent = `${index + 1} / ${slides.length}`;
  };
  const move = direction => track.scrollBy({
    left: direction * step(),
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
