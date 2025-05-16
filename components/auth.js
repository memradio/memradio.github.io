// --- Token Helpers ---
export function getGitHubToken() {
  return localStorage.getItem('github_token') || '';
}

export function saveToken(token) {
  localStorage.setItem('github_token', token);
}

export function isLoggedIn() {
  return getGitHubToken().startsWith('ghp_');
}


export function renderAuthBefore(container, before) {

  const div = document.createElement('div');
  div.innerHTML = `
    <p id="loginStatus" class="login-status">🔐 Неавторизовано</p>
    <button id="loginBtn" class="material-btn">🔐 Увійти з GitHub токеном</button>
    <button id="logoutBtn" class="material-btn" style="display: none;">🚪 Вийти</button>
    <div id="loginModal" class="material-modal" style="display: none;">
      <div class="modal-content">
        <h2>🔐 Авторизація GitHub</h2>
        <p>Встав свій <code>GitHub Token</code>:</p>
        <input type="password" id="tokenInput" placeholder="ghp_..." />
        <div class="modal-actions">
          <button id="confirmLogin" class="material-btn">Зберегти</button>
          <button id="cancelLogin" class="material-btn"
            style="background-color: #e0e0e0; color: #000;">Скасувати</button>
        </div>
      </div>
    </div>`;
  container.insertBefore(div, before);


  const tokenInput = div.querySelector('#tokenInput');
  const confirmLoginBtn = div.querySelector('#confirmLogin');
  const logoutBtn = div.querySelector('#logoutBtn');
  const loginModal = div.querySelector('#loginModal');
  const loginBtn = div.querySelector('#loginBtn');
  const cancelLoginBtn = div.querySelector('#cancelLogin');
  const loginStatus = div.querySelector('#loginStatus');

  confirmLoginBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (token.startsWith('ghp_')) {
      saveToken(token);
      loginModal.style.display = 'none';
      updateLoginStatus(loginStatus, loginBtn);
      alert('✅ Токен збережено!');
    } else {
      alert('❌ Невірний токен');
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('github_token');
    updateLoginStatus(loginStatus, loginBtn);
    alert('🚪 Ви вийшли з GitHub');
  });

  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    tokenInput.value = '';
  });


  cancelLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  updateLoginStatus(loginStatus, loginBtn);

}

// --- UI Updates ---
function updateLoginStatus(loginStatus, loginBtn) {
  const loggedIn = isLoggedIn();
  if (loggedIn) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loginStatus.textContent = '🔓 Авторизовано';
    loginStatus.classList.add('logged-in');
    loginStatus.classList.remove('logged-out');
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    loginStatus.textContent = '🔐 Неавторизовано';
    loginStatus.classList.remove('logged-in');
    loginStatus.classList.add('logged-out');
  }

  const event = new CustomEvent('updateLoginStatus', {
    detail: { isLoggedIn },
  });
  window.dispatchEvent(event);
}