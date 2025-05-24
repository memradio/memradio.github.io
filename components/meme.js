import { renderMemeList } from './MemeList.js';
import { renderHeader } from './Header.js';
import { renderFooter } from './Footer.js';
import { getYoutubeEmbed } from '/utils/youtube.js';

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
        console.log('audio');
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
      } else if (meme.links?.youtube) {
        console.log('embed');
        // 🎥 Вставляємо YouTube embed
        const embedLink = getYoutubeEmbed(meme.links.youtube);
        if (embedLink) {
          const iframe = document.createElement('iframe');
          iframe.src = embedLink;
          iframe.width = '100%';
          iframe.height = '80';
          iframe.frameBorder = '0';
          iframe.allow = 'autoplay; encrypted-media';
          iframe.allowFullscreen = true;
          iframe.style.display = 'block';
          iframe.style.margin = '30px auto 0 auto';
          iframe.style.borderRadius = '8px';
          container.appendChild(iframe);
        }
      }
      else {
        console.log('else');
        document.title = 'Мєм Рація — Мем не знайдено';
        container.innerHTML = '<p>Мем не знайдено 😢</p>';
      }
    }
  }
});
