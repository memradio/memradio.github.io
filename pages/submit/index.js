import { submitMemeToGitHub } from '/api/githubapi.js';
import { renderHeader } from '/components/Header.js';

// --- DOM Elements ---
const form = document.getElementById('submitForm');
const submitBtn = form.querySelector('button[type="submit"]');
const successMessage = document.getElementById('successMessage');

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginStatus = document.getElementById('loginStatus');
const loginModal = document.getElementById('loginModal');
const tokenInput = document.getElementById('tokenInput');
const confirmLoginBtn = document.getElementById('confirmLogin');
const cancelLoginBtn = document.getElementById('cancelLogin');



document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  renderHeader(app, { smallLogo: false, displayToggle: false });
});

// --- Token Helpers ---
export function getGitHubToken() {
  return localStorage.getItem('github_token') || '';
}

function isLoggedIn() {
  return getGitHubToken().startsWith('ghp_');
}

// --- UI Updates ---
function updateLoginStatus() {
  if (isLoggedIn()) {
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

  disableForm(!isLoggedIn());
}

// --- Auth Events ---
loginBtn.addEventListener('click', () => {
  loginModal.style.display = 'flex';
  tokenInput.value = '';
});

cancelLoginBtn.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

confirmLoginBtn.addEventListener('click', () => {
  const token = tokenInput.value.trim();
  if (token.startsWith('ghp_')) {
    localStorage.setItem('github_token', token);
    loginModal.style.display = 'none';
    updateLoginStatus();
    alert('✅ Токен збережено!');
  } else {
    alert('❌ Невірний токен');
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('github_token');
  updateLoginStatus();
  alert('🚪 Ви вийшли з GitHub');
});

// --- Form Submit ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Відправляємо...';

  try {
    const formData = new FormData(form);
    const audioFile = formData.get('audio');
    const sourceFile = formData.get('sourceFile')?.trim();
    if (!sourceFile) throw new Error('Файл для збереження не вибрано');

    const newMemeObject = {
      name: formData.get('name')?.trim(),
      links: {
        youtube: formData.get('youtube')?.trim() || '',
        tiktok: formData.get('tiktok')?.trim() || '',
        instagram: formData.get('instagram')?.trim() || '',
      },
      audio: audioFile?.name || ''
    };

    await submitMemeToGitHub({
      sourceFile,
      newMemeObject,
      audioFile
    });

    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    submitBtn.textContent = 'Надіслано! ✅';

    form.reset();
    successMessage.style.display = 'block';

  } catch (err) {
    console.error(err);
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('error');
    submitBtn.textContent = 'Помилка 😢';

    setTimeout(() => {
      submitBtn.classList.remove('error');
      submitBtn.textContent = 'НАДІСЛАТИ';
    }, 3000);
  }
});

// --- On Load ---
updateLoginStatus();

fetchDataFileList();

function disableForm(disabled) {
  if (disabled) {
    form.classList.add('form-disabled');
  } else {
    form.classList.remove('form-disabled');
  }

  // Щоб також заблокувати елементи input/button
  [...form.elements].forEach(el => {
    el.disabled = disabled;
  });
}



async function fetchDataFileList() {
  const GITHUB_USERNAME = 'memradio';
  const REPO = 'memradio.github.io';
  const API_BASE = 'https://api.github.com';

  const select = document.getElementById('sourceFile');
  select.innerHTML = '<option value="">Завантаження...</option>';

  try {
    const res = await fetch(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/data`, {});

    if (!res.ok) throw new Error('Не вдалося завантажити список файлів');

    const files = await res.json();

    // Фільтруємо memdata_*.js
    const memdataFiles = files.filter(f =>
      f.name.startsWith('memdata_') && f.name.endsWith('.js')
    );

    if (!memdataFiles.length) {
      select.innerHTML = '<option value="">Немає доступних файлів</option>';
      return;
    }

    // Заповнюємо select
    select.innerHTML = '<option value="">-- Оберіть файл --</option>';
    memdataFiles.forEach(file => {
      const opt = document.createElement('option');
      opt.value = file.name;
      opt.textContent = file.name;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error('GitHub fetch error:', err);
    select.innerHTML = '<option value="">⚠️ Помилка завантаження</option>';
  }
}
