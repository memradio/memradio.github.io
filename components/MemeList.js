import { getBookmarks, isBookmarked, toggleBookmark } from './Bookmarks.js';
import { playMeme } from './Player.js'; // додали імпорт для виклику playMeme(index)

export function renderMemeList(container, memes) {
  const list = document.createElement('div');
  list.className = 'meme-list';

  memes.forEach((meme, index) => {
    const item = document.createElement('div');
    item.className = 'meme-item';
    const shareLink = `${window.location.origin}/meme.html?id=${encodeURIComponent(meme.number)}`;

    item.innerHTML = `
      <div class="meme-header">
        <div class="meme-number">${meme.number}</div>
        <div class="meme-name">${meme.name}</div>
        <button class="bookmark-button ${isBookmarked(meme.number) ? 'active' : ''}" title="Додати в збережене">&#9733;</button>
      </div>
      <div class="meme-description" style="display:none;">
        ${meme.description || ''}
        ${meme.youtubelink ? `<br><a class="meme-link" href="${meme.youtubelink}" target="_blank">YouTube</a>` : ''}
        ${meme.links?.youtube ? `<br><a class="meme-link" href="${meme.links?.youtube}" target="_blank">YouTube</a>` : ''}
        ${meme.links?.tiktok ? `<br><a class="meme-link tiktok" href="${meme.links?.tiktok}" target="_blank">TikTok</a>` : ''}
      </div>
      <a class="meme-link telegram" href="https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(meme.name)}" target="_blank">
       <i class="fab fa-telegram-plane"></i>
      </a>
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
  });

  container.appendChild(list);
}
