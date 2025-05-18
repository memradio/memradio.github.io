import { renderMemeList } from './MemeList.js';
import { renderHeader } from './Header.js';
import { renderFooter } from './Footer.js';

document.addEventListener('DOMContentLoaded', async () => {

  const app = document.getElementById('app');
  renderHeader(app, { smallLogo: true, displayToggle: false }); // маленька іконка

  const urlParams = new URLSearchParams(window.location.search);
  const memeId = urlParams.get('id');
  const source = urlParams.get('source') ?? 'default';

  const { MEME_DATA } = await import(`/data/memdata_${source}.js`);
  const meme = MEME_DATA.find(m => m.number === memeId);
  renderMeme(meme);

  renderFooter(app);

  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    const scrollUrl = source !== 'default'
      ? `/pages/${source}#scrollto-${memeId}`
      : `/#scrollto-${memeId}`;
    window.location.href = scrollUrl;
  });

  function renderMeme(meme) {
    const container = document.getElementById('memeContainer');

    if (meme) {
      // ✨ Змінюємо заголовок сторінки
      document.title = `Мєм Рація — ${meme.name}`;

      renderMemeList(container, [meme]);
      if (typeof LikeBtn !== 'undefined') {
        LikeBtn.init();
      }

      if (meme.audio) {
        const audio = document.createElement('audio');
        audio.src = '/audio/' + meme.audio;
        audio.controls = true;
        audio.controlsList = 'nodownload';
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
  }
});
