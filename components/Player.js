let globalPlayerElement;
let currentMemeNameElement;
let playlist = [];
let currentIndex = -1;

export function renderPlayer(container) {
  const playerContainer = document.createElement('div');
  playerContainer.id = 'globalPlayerContainer';

  playerContainer.innerHTML = `
    <audio id="globalPlayer" controls controlsList="nodownload"></audio>
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
    number: meme.number,
    name: meme.name,
    audioUrl: 'audio/' + meme.audio
  }));
}

export function playMeme(memeNumber) {
  const index = playlist.findIndex(meme => meme.number === memeNumber);
  if (index >= 0 && index < playlist.length) {
    currentIndex = index;
    const m = playlist[currentIndex];
    const audioUrl = m.audioUrl;
    globalPlayerElement.src = audioUrl;
    currentMemeNameElement.textContent = `${m.number}: ${m.name}`;

    console.log('🛠 Trying to play:', audioUrl);

    globalPlayerElement.load();
    globalPlayerElement.play()
      .then(() => {
        console.log('✅ Playing started');
        highlightActiveMeme();
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

// ✨ Додаємо цю нову функцію:
function highlightActiveMeme() {
    const allItems = document.querySelectorAll('.meme-item');
    allItems.forEach(item => item.classList.remove('active'));
  
    const activeNumber = playlist[currentIndex].audioUrl.split('/').pop().split(' ')[0]; // беремо номер
    const activeItem = Array.from(allItems).find(item => 
      item.querySelector('.meme-number')?.textContent.trim() === activeNumber
    );
  
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
