import { submitMemeToGitHub } from '/api/githubapi.js';
const form = document.getElementById('submitForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Відправляємо...';

  try {
    const formData = new FormData(form);
    const audioFile = formData.get('audio');

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
      sourceFile: 'memdata_kraveculya.js',
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

let githubToken = localStorage.getItem('github_token') || '';

document.getElementById('loginBtn').addEventListener('click', () => {
  document.getElementById('loginModal').style.display = 'flex';
});

document.getElementById('cancelLogin').addEventListener('click', () => {
  document.getElementById('loginModal').style.display = 'none';
});

document.getElementById('confirmLogin').addEventListener('click', () => {
  const token = document.getElementById('tokenInput').value.trim();
  if (token.startsWith('ghp_')) {
    githubToken = token;
    localStorage.setItem('github_token', token);
    document.getElementById('loginModal').style.display = 'none';
    alert('✅ Токен збережено!');
  } else {
    alert('❌ Невірний токен');
  }
});

// 👉 Export this for use in submitMemeToGitHub
export function getGitHubToken() {
  return githubToken;
}
