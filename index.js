import { renderHeader } from './components/Header.js';
import { renderPlayer, initPlayer } from './components/Player.js';
import { renderTabs } from './components/Tabs.js';
import { renderSearch } from './components/Search.js';
import { renderMemeList } from './components/MemeList.js';
import { renderFriendsTab } from './components/FriendsTab.js';

let currentFilter = '';
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  renderHeader(app, { smallLogo: false });
  renderPlayer(app);

  const mainContent = document.createElement('div');
  mainContent.id = 'mainContent';
  app.appendChild(mainContent);

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
});
