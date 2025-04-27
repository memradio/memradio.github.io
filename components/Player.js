let globalPlayerElement;
let currentMemeNameElement;
let playlist = [];
let currentIndex = -1;

export function renderPlayer(container) {
  const playerContainer = document.createElement('div');
  playerContainer.id = 'globalPlayerContainer';

  playerContainer.innerHTML = `
    <audio id="globalPlayer" controls></audio>
    <div class="player-controls">
      <button id="prevButton"><span class="material-icons">skip_previous</span></button>
      <button id="playPauseButton"><span class="material-icons" id="playPauseIcon">play_arrow</span></button>
      <button id="nextButton"><span class="material-icons">skip_next</span></button>
    </div>
    <div id="currentMemeName"></div>
  `;

  container.appendChild(playerContainer);

  globalPlayerElement = document.getElementById('globalPlayer');
  currentMemeNameElement = document.getElementById('currentMemeName');

  document.getElementById('playPauseButton').addEventListener('click', togglePlayPause);
  document.getElementById('prevButton').addEventListener('click', () => {
    if (currentIndex > 0) playMeme(currentIndex - 1);
  });
  document.getElementById('nextButton').addEventListener('click', () => {
    if (currentIndex < playlist.length - 1) playMeme(currentIndex + 1);
  });

  globalPlayerElement.addEventListener('play', () => {
    document.getElementById('playPauseIcon').innerText = 'pause';
  });

  globalPlayerElement.addEventListener('pause', () => {
    document.getElementById('playPauseIcon').innerText = 'play_arrow';
  });

  globalPlayerElement.addEventListener('ended', () => {
    if (currentIndex < playlist.length - 1) {
      setTimeout(() => {
        playMeme(currentIndex + 1);
      }, 3000);
    }
  });
}

export function initPlayer(memes) {
  playlist = memes.filter(meme => meme.audio).map(meme => ({
    name: meme.name,
    audioUrl: 'audio/' + meme.audio
  }));
}

export function playMeme(index) {
  if (index >= 0 && index < playlist.length) {
    currentIndex = index;
    const audioUrl = playlist[currentIndex].audioUrl;
    globalPlayerElement.src = audioUrl;
    currentMemeNameElement.textContent = playlist[currentIndex].name;

    console.log('🛠 Trying to play:', audioUrl);

    globalPlayerElement.load();
    globalPlayerElement.play()
      .then(() => {
        console.log('✅ Playing started');
      })
      .catch(error => {
        console.error('❌ Play error:', error);
      });
  } else {
    console.warn('⚠️ Invalid index:', index);
  }
}

function togglePlayPause() {
  if (globalPlayerElement.paused) {
    globalPlayerElement.play();
  } else {
    globalPlayerElement.pause();
  }
}
