import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderPlayer, initPlayer } from './components/Player.js';
import { renderTabs } from './components/Tabs.js';
import { renderSearch } from './components/Search.js';
import { renderMemeList } from './components/MemeList.js';
import { renderFriendsTab } from './components/FriendsTab.js';

let currentFilter = '';
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');

  renderHeader(app, { smallLogo: false, displayToggle: true });
  renderPlayer(app);

  const mainContent = document.createElement('div');
  mainContent.id = 'mainContent';
  mainContent.classList.toggle('text-mode', localStorage.getItem('textModeToggle') === 'true');
  app.appendChild(mainContent);
  renderFooter(app);

  renderTabs(mainContent, (tab) => {
    currentTab = tab;
    renderFilteredMemes();
  });

  renderSearch(mainContent, (value) => {
    currentFilter = value;
    renderFilteredMemes();
  });

  const memeListContainer = document.createElement('div');
  memeListContainer.id = 'memeListContainer';
  mainContent.appendChild(memeListContainer);

  let source = 'default';
  const pathParts = window.location.pathname.split('/');
  if (pathParts.includes('pages')) {
    const afterPages = pathParts[pathParts.indexOf('pages') + 1];
    if (afterPages) {
      source = afterPages.replace('.html', '').replace('index', '') || null;
    }
  }

  const { MEME_DATA } = await import(`/data/memdata_${source}.js`);
  const memeData = MEME_DATA;
  initPlayer(memeData); // Ініціалізувати плеєр

  renderFilteredMemes();
  renderFriendsTab(mainContent);

  function renderFilteredMemes() {
    const memeListContainer = document.getElementById('memeListContainer');
    const friendsTab = document.getElementById('friendsTab');
    memeListContainer.innerHTML = '';

    let filtered = memeData.filter(meme => meme.number.toLocaleLowerCase().includes(currentFilter.toLocaleLowerCase())
      || meme.name.toLowerCase().includes(currentFilter.toLowerCase())
      || (meme.description && meme.description.toLowerCase().includes(currentFilter.toLowerCase()))
    );

    if (currentTab === 'bookmarks') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedMemes') || '[]');
      filtered = filtered.filter(meme => bookmarks.includes(meme.number));
    }

    if (friendsTab) {
      if (currentTab === 'showFriends') {
        memeListContainer.style.display = 'none';   // <- приховує меми
        friendsTab.style.display = 'block';
      } else {
        memeListContainer.style.display = 'block';   // <- приховує меми
        friendsTab.style.display = 'none';
      }
    }

    renderMemeList(memeListContainer, filtered);
  }


  window.addEventListener('textModeToggled', (e) => {
    const isText = e.detail.enabled;
    mainContent.classList.toggle('text-mode', isText);
  });
});
