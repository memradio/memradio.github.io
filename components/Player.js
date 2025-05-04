let globalPlayerElement;
let currentMemeNameElement;
let playlist = [];
let currentIndex = -1;

export function renderPlayer(container) {
  const playerContainer = document.createElement('div');
  playerContainer.id = 'globalPlayerContainer';
  playerContainer.classList.toggle('text-mode', localStorage.getItem('textModeToggle') === 'true');

  playerContainer.innerHTML = `
    <audio id="globalPlayer" controls controlsList="nodownload"></audio>
    <div class="player-controls">
      <button id="prevButton"><span class="material-icons">skip_previous</span></button>
      <button id="playPauseButton"><span class="material-icons" id="playPauseIcon">play_arrow</span></button>
      <button id="nextButton"><span class="material-icons">skip_next</span></button>
      <button id="buyRadioButton" title="Купити рацію">
        <span class="material-icons">storefront</span>
      </button>
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


  window.addEventListener('textModeToggled', (e) => {
    const isText = e.detail.enabled;
    playerContainer.classList.toggle('text-mode', isText);
  });

  document.getElementById('buyRadioButton').addEventListener('click', () => {
    window.open('/pages/landing#order', '_blank');
  });
}

export function initPlayer(memes) {
  playlist = memes.filter(meme => meme.audio).map(meme => ({
    number: meme.number,
    name: meme.name,
    audioUrl: '/audio/' + meme.audio
  }));
}

export function playMeme(memeNumber) {

  if(localStorage.getItem('textModeToggle') === 'true'){
    return;
  }

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
        highlightActiveMeme(memeNumber);
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
function highlightActiveMeme(memeNumber) {
    const allItems = document.querySelectorAll('.meme-item');
    allItems.forEach(item => item.classList.remove('active'));
  
    const activeItem = Array.from(allItems).find(item => 
      item.querySelector('.meme-number')?.textContent.trim() === memeNumber
    );
  
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
