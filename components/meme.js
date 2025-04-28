import { renderMemeList } from './MemeList.js';
import { renderHeader } from './Header.js';

document.addEventListener('DOMContentLoaded', () => {

  const app = document.getElementById('app');
  renderHeader(app, { smallLogo: true }); // маленька іконка

  const urlParams = new URLSearchParams(window.location.search);
  const memeId = urlParams.get('id');

  const meme = memeData.find(m => m.number === memeId);

  const container = document.getElementById('memeContainer');

  if (meme) {
    // ✨ Змінюємо заголовок сторінки
    document.title = `Мєм Рація — ${meme.name}`;

    renderMemeList(container, [meme]);
    
    if (meme.audio) {
      const audio = document.createElement('audio');
      audio.src = 'audio/' + meme.audio;
      audio.controls = true;
      audio.autoplay = true;
      audio.style.display = 'block';
      audio.style.margin = '30px auto 0 auto';
      container.appendChild(audio);

      audio.play().catch(err => {
        console.warn('Автовідтворення заборонене, треба натиснути Play вручну.', err);
      });
    }
  } else {
    document.title = 'Мєм Рація — Мем не знайдено';
    container.innerHTML = '<p>Мем не знайдено 😢</p>';
  }

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
