import { submitMemeToGitHub, getDataFilesList } from '/api/githubapi.js';
import { renderHeader } from '/components/Header.js';
import { renderFooter } from '/components/Footer.js';
import { renderAuthBefore } from '/components/auth.js';

// --- DOM Elements ---
const form = document.getElementById('submitForm');
const submitBtn = form.querySelector('button[type="submit"]');
const successMessage = document.getElementById('successMessage');
const mainContent = document.getElementById('mainContent');

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const mainContent = document.getElementById('mainContent');
  const submitForm = document.getElementById('submitForm');

  renderHeader(app, { smallLogo: false, displayToggle: false, title: '📤 Надішли свій мем' });
  renderAuthBefore(mainContent, submitForm);
  renderFooter(app);
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

window.addEventListener('updateLoginStatus', (e) => {
  disableForm(!e.detail.isLoggedIn)
});


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
  const select = document.getElementById('sourceFile');
  select.innerHTML = '<option value="">Завантаження...</option>';

  try {
    const files = await getDataFilesList();

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

      select.addEventListener('change', () => {
        const selectedFile = select.value;
        if (selectedFile) {
          suggestNextMemeNumber(selectedFile);
        } else {
          document.getElementById('numberInput').value = '';
        }
      });
    });

  } catch (err) {
    console.error('GitHub fetch error:', err);
    select.innerHTML = '<option value="">⚠️ Помилка завантаження</option>';
  }
}

async function suggestNextMemeNumber(sourceFile) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/memradio/memradio.github.io/main/data/${sourceFile}`);
    const text = await res.text();

    // Find all numbers in JSON-style object entries
    const matches = [...text.matchAll(/number:\s*["'](\d+)([A-ZА-Я]?)/gi)];
    if (!matches.length) return;

    const last = matches.map(m => ({ num: parseInt(m[1]), suffix: m[2] || '' }))
      .sort((a, b) => b.num - a.num)[0];

    const nextNumber = `${last.num + 1}${last.suffix}`;
    document.getElementById('numberInput').value = nextNumber;

  } catch (err) {
    console.error('❌ Failed to load source file for number suggestion:', err);
  }
}