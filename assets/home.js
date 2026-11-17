renderChrome('home');

document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = I[element.dataset.icon] || ''; });
initMotion();

// Abertura trocável: com <video id="hero-video"> toca o vídeo; com <img class="hero-banner"> fica só o banner.
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
  const videoToggle = document.getElementById('video-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceData = window.matchMedia('(prefers-reduced-data: reduce)').matches || navigator.connection?.saveData;
  const mobileVideo = window.matchMedia('(max-width: 760px)');
  let userPaused = false;
  
  function updateVideoToggle(playing) {
    videoToggle.textContent = playing ? 'Ⅱ' : '▷';
    videoToggle.setAttribute('aria-label', playing ? 'Pausar vídeo de abertura' : 'Reproduzir vídeo de abertura');
  }
  
  function syncHeroVideo() {
    // Sem src, a preferência de movimento reduzido também evita baixar o MP4.
    if (reduceMotion.matches || reduceData) {
      heroVideo.pause();
      if (heroVideo.hasAttribute('src')) {
        heroVideo.removeAttribute('src');
        heroVideo.load();
      }
      heroVideo.parentElement.classList.remove('playing');
      videoToggle.hidden = true;
      return;
    }
    if (document.hidden) { heroVideo.pause(); return; }
    const source = !mobileVideo.matches && window.innerWidth * window.devicePixelRatio > 1920 ? heroVideo.dataset.src : heroVideo.dataset.mobileSrc;
    heroVideo.muted = true;
    heroVideo.autoplay = !userPaused;
    if (heroVideo.getAttribute('src') !== source) {
      heroVideo.parentElement.classList.remove('playing');
      heroVideo.src = source;
      heroVideo.load();
    }
    videoToggle.hidden = false;
    if (userPaused) heroVideo.pause();
    else heroVideo.play().catch(() => updateVideoToggle(false));
  }
  
  heroVideo.addEventListener('playing', () => {
    heroVideo.parentElement.classList.add('playing');
    updateVideoToggle(true);
  });
  heroVideo.addEventListener('pause', () => updateVideoToggle(false));
  heroVideo.addEventListener('error', () => {
    heroVideo.parentElement.classList.remove('playing');
    videoToggle.hidden = true;
  });
  videoToggle.addEventListener('click', () => {
    userPaused = !heroVideo.paused;
    syncHeroVideo();
  });
  document.addEventListener('visibilitychange', syncHeroVideo);
  reduceMotion.addEventListener('change', syncHeroVideo);
  window.addEventListener('resize', syncHeroVideo);
  syncHeroVideo();
}
