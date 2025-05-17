export async function renderFriendsTab(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'user-tab';
  wrapper.id = 'friendsTab';
  wrapper.style.display = 'none';

  wrapper.innerHTML = `<h3>🔸 Мем-хвилі друзів:</h3><div class="user-grid"></div>`;
  container.appendChild(wrapper);

  const grid = wrapper.querySelector('.user-grid');

  const FRIEND_PAGES = ['kraveculya', 'oleg', 'viktor', 'kateryn'];

  for (const username of FRIEND_PAGES) {
    try {
      await import(`../data/memdata_${username}.js`);

      const meta = window.meta || {};
      const emoji = meta.emoji || '👤';
      const name = meta.name || username;

      const tile = document.createElement('a');
      tile.href = `/pages/${username}`;
      tile.className = 'user-tile';
      tile.innerHTML = `
        <span class="emoji">${emoji}</span>
        <span class="name">${name}</span>
      `;
      grid.appendChild(tile);
    } catch (err) {
      console.warn(`Не вдалося завантажити memdata для ${username}`, err);
    }
  }

  // Додати головну і нову сторінку
  grid.innerHTML += `
    <a href="/" class="user-tile">
      <img src="/image/logo-full.png" alt="Мєм Рація" class="tile-logo">
      <span class="name">Мєм Рація</span>
    </a>
    <a href="/pages/newpage" class="user-tile">
      <span class="emoji">➕</span>
      <span class="name">Додати</span>
    </a>
  `;
}
