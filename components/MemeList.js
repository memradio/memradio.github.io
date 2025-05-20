import { getBookmarks, isBookmarked, toggleBookmark } from './Bookmarks.js';
import { playMemeByNumber } from './Player.js';

export function renderMemeList(container, memes) {
  const list = document.createElement('div');
  list.className = 'meme-list';
  list.classList.toggle('text-mode', localStorage.getItem('textModeToggle') === 'true');

  memes.forEach((meme, index) => {
    const item = document.createElement('div');
    item.className = 'meme-item';
    item.setAttribute("data-number", meme.number);
    const pathParts = window.location.pathname.split('/');
    let source = null;
    if (pathParts.includes('pages')) {
      const afterPages = pathParts[pathParts.indexOf('pages') + 1];
      if (afterPages) {
        source = afterPages.replace('.html', '').replace('index', '') || null;
      }
    }
    const sourceParam = source && source != 'index' ? `&source=${source}` : '';
    const shareLink = `${window.location.origin}/meme.html?id=${encodeURIComponent(meme.number)}${sourceParam}`;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const shareText = isIOS ? `\n${meme.name}\n` : `\`\`\`\n${meme.name}\n\`\`\``;

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
      ${meme.links?.instagram ? `
    <br>
    <a href="${meme.links.instagram}" target="_blank" class="instagram-button">
      <svg class="instagram-icon" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
      </svg>
    </a>` : ''}
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
      playMemeByNumber(meme.number); // 🛠️ при кліку на мем запускаємо плеєр
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

    if (memes.length < 5) {
      const tracker = renderViewsTracker(meme, memes.length > 1);
      item.appendChild(tracker);
    }
  });

  container.appendChild(list);

  AfterRender();


  function AfterRender() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#scrollto-')) {
      const memeNumber = hash.replace('#scrollto-', '');
      // Шукаємо елемент із data-number або класом
      const target = document.querySelector(`.meme-item[data-number="${memeNumber}"]`);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('active'); // можна додати візуальну підсвітку
        }, 300); // трохи почекати, щоб DOM точно був готовий
      }
    }
  }


  function renderViewsTracker(meme, readOnly) {
    const s = document.createElement("script");
    s.src = "https://counterapi.com/c.js";
    s.setAttribute("async", "");

    const el = document.createElement('div');
    const key = `${window.location.host}-${meme.number}`;
    const readOnlyAttr = readOnly ? `readOnly=${readOnly}` : '';
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
        ${readOnlyAttr}
        anim-duration="800"></div>`;
    el.appendChild(s);
    return el;
  }

  window.addEventListener('textModeToggled', (e) => {
    const isText = e.detail.enabled;
    list.classList.toggle('text-mode', isText);
  });

}
