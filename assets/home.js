renderChrome('home');

document.getElementById('destaques').innerHTML = CARROS.filter(car => car.destaque).slice(0, 3).map(carCard).join('');
document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = I[element.dataset.icon] || ''; });
initMotion();

const heroVideo = document.getElementById('hero-video');
const videoToggle = document.getElementById('video-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduceData = window.matchMedia('(prefers-reduced-data: reduce)').matches || navigator.connection?.saveData;
let heroPlayer;
let playerReady = false;
let userPaused = false;

function updateVideoToggle(playing) {
  if (playing) heroVideo.parentElement.classList.add('playing');
  videoToggle.textContent = playing ? 'Pausar vídeo Ⅱ' : 'Reproduzir vídeo ▷';
  videoToggle.setAttribute('aria-label', playing ? 'Pausar vídeo de abertura' : 'Reproduzir vídeo de abertura');
}

function videoUnavailable() {
  heroVideo.parentElement.classList.remove('playing');
  videoToggle.hidden = true;
}

function playHeroVideo() {
  if (document.hidden || reduceMotion.matches || reduceData || userPaused) return;
  if (playerReady) { heroPlayer.playVideo(); return; }
  if (heroVideo.hasAttribute('src')) return;

  const url = new URL(heroVideo.dataset.src);
  url.searchParams.set('origin', window.location.origin);
  heroVideo.src = url.href;
  const createPlayer = () => {
    heroPlayer = new YT.Player('hero-video', {
      events: {
        onReady(event) {
          playerReady = true;
          event.target.mute();
          videoToggle.hidden = false;
          if (document.hidden || reduceMotion.matches || userPaused) event.target.pauseVideo();
          else event.target.playVideo();
          // O autoplay pode começar antes de a API registrar a mudança de estado.
          updateVideoToggle(event.target.getPlayerState() === YT.PlayerState.PLAYING);
        },
        onStateChange(event) {
          updateVideoToggle(event.data === YT.PlayerState.PLAYING);
          if (event.data === YT.PlayerState.ENDED && !document.hidden && !reduceMotion.matches && !userPaused) {
            event.target.seekTo(15, true);
            event.target.playVideo();
          }
        },
        onAutoplayBlocked() { updateVideoToggle(false); },
        onError: videoUnavailable
      }
    });
  };
  if (window.YT?.Player) createPlayer();
  else {
    window.onYouTubeIframeAPIReady = createPlayer;
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = videoUnavailable;
    document.head.appendChild(script);
  }
}

videoToggle.addEventListener('click', () => {
  if (!playerReady) return;
  userPaused = heroPlayer.getPlayerState() === YT.PlayerState.PLAYING;
  if (userPaused) heroPlayer.pauseVideo();
  else heroPlayer.playVideo();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && playerReady) heroPlayer.pauseVideo();
  else playHeroVideo();
});
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches && playerReady) heroPlayer.pauseVideo();
  else playHeroVideo();
});
playHeroVideo();
