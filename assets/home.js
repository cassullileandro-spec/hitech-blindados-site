renderChrome('home');

document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = I[element.dataset.icon] || ''; });
initMotion();

// O embed oficial só carrega quando o visitante se aproxima da seção.
const instagramFeed = document.querySelector('[data-instagram-feed]');
if (instagramFeed) {
  const instagramObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    instagramObserver.disconnect();
    const frameObserver = new MutationObserver(() => {
      const frame = instagramFeed.querySelector('iframe');
      if (!frame) return;
      frame.title = 'Publicações de Gabriel Bucker no Instagram';
      frameObserver.disconnect();
    });
    frameObserver.observe(instagramFeed, { childList: true, subtree: true });
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onerror = () => frameObserver.disconnect();
    script.onload = () => window.instgrm?.Embeds.process();
    document.body.append(script);
  }, { rootMargin: '400px' });
  instagramObserver.observe(instagramFeed);
}

// Vídeos: o iframe do YouTube só é criado no clique (sem cookies nem peso antes disso).
const videoDialog = document.getElementById('video-dialog');
if (videoDialog) {
  const frame = videoDialog.querySelector('iframe');
  document.querySelectorAll('[data-video]').forEach(card => card.addEventListener('click', () => {
    frame.src = `https://www.youtube-nocookie.com/embed/${card.dataset.video}?autoplay=1&rel=0`;
    videoDialog.showModal();
  }));
  videoDialog.querySelector('.video-dialog-close').addEventListener('click', () => videoDialog.close());
  videoDialog.addEventListener('click', event => { if (event.target === videoDialog) videoDialog.close(); });
  videoDialog.addEventListener('close', () => { frame.removeAttribute('src'); });
}

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

