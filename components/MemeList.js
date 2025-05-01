import { getBookmarks, isBookmarked, toggleBookmark } from './Bookmarks.js';
import { playMeme } from './Player.js'; // додали імпорт для виклику playMeme(index)

export function renderMemeList(container, memes) {
  const list = document.createElement('div');
  list.className = 'meme-list';

  memes.forEach((meme, index) => {
    const item = document.createElement('div');
    item.className = 'meme-item';
    const pathParts = window.location.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const source = fileName.replace('.html', '') || null;
    const sourceParam = source && source != 'index' ? `&source=${source}` : '';
    const shareLink = `${window.location.origin}/meme.html?id=${encodeURIComponent(meme.number)}${sourceParam}`;
    const shareText = `\`\`\`\n${meme.name}\n\`\`\``;


    item.innerHTML = `
  <div class="meme-header">
    <div class="meme-number">${meme.number}</div>
    <div class="meme-name">${meme.name}</div>
  </div>

  <div class="meme-description" style="display:none;">
    ${meme.description || ''}
    ${meme.youtubelink ? `<br><a class="meme-link youtube" href="${meme.youtubelink}" target="_blank">YouTube</a>` : ''}
    ${meme.links?.youtube ? `<br><a class="meme-link youtube" href="${meme.links?.youtube}" target="_blank">YouTube</a>` : ''}
    ${meme.links?.tiktok ? `<br><a class="meme-link tiktok" href="${meme.links?.tiktok}" target="_blank">TikTok</a>` : ''}
  </div>

  <div class="meme-actions">
    <button class="action-button bookmark-button ${isBookmarked(meme.number) ? 'active' : ''}" title="Зберегти">
      <i class="material-icons">bookmark</i>
    </button>

    <span class="likebtn-wrapper" data-theme="custom" data-identifier="meme_${meme.number}" data-icon_l="hrt1" data-icon_d="thmb7-d"></span>

    <button class="meme-link instagram-share" data-id="${meme.number}" data-name="${meme.name}" title="Поділитися в Instagram">
      <i class="fab fa-instagram"></i>
    </button>
    <a class="meme-link telegram" href="https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}" target="_blank">
      <i class="fab fa-telegram-plane"></i>
    </a>
  </div>
`;

    const bookmarkBtn = item.querySelector('.bookmark-button');
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(meme.number);
      bookmarkBtn.classList.toggle('active');
    });


    const desc = item.querySelector('.meme-description');
    item.addEventListener('click', (e) => {
      if (e.target.closest('.telegram') || e.target.closest('.bookmark-button')) return;
      desc.style.display = (desc.style.display === 'block') ? 'none' : 'block';
      playMeme(meme.number); // 🛠️ при кліку на мем запускаємо плеєр
    });

    list.appendChild(item);

    const instagramBtn = item.querySelector('.instagram-share');
    instagramBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = instagramBtn.dataset.id;
      const name = instagramBtn.dataset.name;
      const url = `${window.location.origin}/meme.html?id=${encodeURIComponent(id)}`;
      const text = `\`\`\`\n${name}\n\`\`\`\n${url}`;

      if (navigator.share) {
        navigator.share({
          title: 'Мєм Рація',
          text: name,
          url: url
        });
      } else {
        alert("Instagram sharing доступне лише на мобільному пристрої");
      }
    });

    if(memes.length < 5){
      debugger
      const tracker = renderViewsTracker(meme, memes.length > 1);
      item.appendChild(tracker);
    }
  });

  container.appendChild(list);



  function renderViewsTracker(meme, readOnly) {
    const s = document.createElement("script");
    s.src = "https://counterapi.com/c.js";
    s.setAttribute("async", "");

    const el = document.createElement('div');
    const key = `${window.location.host}-${meme.number}`;
    el.innerHTML = `
  <div class="counterapi" 
        style="min-height:44px" 
        key="${key}"
        icon="eye"
        label="переглядів"
        color="#666"
        icon-color="#2196f3"
        bg="transparent"
        hide-if-zero="true"
        no-link="true"
        readOnly=${readOnly}
        anim-duration="800"></div>`;
        el.appendChild(s);
      return el;
  }
}
