export function renderFriendsTab(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'user-tab';
    wrapper.id = 'friendsTab';
    wrapper.style.display = 'none';
  
    wrapper.innerHTML = `
      <h3>🔸 Мем-хвилі друзів:</h3>
      <div class="user-grid">
        <a href="/pages/kraveculya.html" class="user-tile">
          <span class="emoji">👩</span>
          <span class="name">Kraveculya</span>
        </a>
        <a href="/pages/oleg.html" class="user-tile">
          <span class="emoji">🧔</span>
          <span class="name">Олег</span>
        </a>
        <a href="/pages/viktor.html" class="user-tile">
          <span class="emoji">👽</span>
          <span class="name">Віктор</span>
        </a>
      </div>
    `;
  
    container.appendChild(wrapper);
  }
  