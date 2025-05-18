import { renderHeader } from '/components/Header.js';
import { renderFooter } from '/components/Footer.js';
import { renderAuthBefore } from '/components/auth.js';
import { FileExists, addNewDataFile, getBranch, createBranch, createNewUserPullRequest, copyIndexPage, addToFriendPages } from '/api/githubapi.js';


function renderNewPage() {

  document.addEventListener('DOMContentLoaded', () => {

    const app = document.getElementById('app');
    const mainContent = document.getElementById('mainContent');
    const submitForm = document.getElementById('newPageForm');

    renderHeader(app, { smallLogo: false, displayToggle: false, tile: '🆕 Створити нову сторінку мемів' });
    renderAuthBefore(mainContent, submitForm);
    renderFooter(app);
  });


  const form = document.getElementById('newPageForm');
  const input = document.getElementById('newPageName');
  const status = document.getElementById('status');
  const emoji = document.getElementById('emoji');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawName = input.value.trim().toLowerCase().replace(/\s+/g, '_');
    if (!/^[a-z0-9_-]+$/.test(rawName)) {
      alert('❌ Назва має містити лише латинські літери, цифри, тире або підкреслення.');
      return;
    }

    const filename = `memdata_${rawName}.js`;
    const filePath = `data/${filename}`;

    try {
      // 🔎 Перевірка чи файл вже існує
      const checkRes = await FileExists(filePath);

      if (checkRes.ok) {
        alert(`⚠️ Файл "${filename}" вже існує. Оберіть іншу назву.`);
        return;
      } else if (checkRes.status !== 404) {
        throw new Error('GitHub перевірка не вдалася');
      }

      const branchName = `dataFile-${Date.now()}`;

      const { commit: baseCommit, sha: baseSha } = await getBranch();

      await createBranch(branchName, baseSha);

      // ✅ Якщо не існує — створюємо
      await addNewDataFile(filename, filePath, branchName)

      await copyIndexPage(rawName, branchName);
      await addToFriendPages(rawName, emoji.value, branchName);
      await createNewUserPullRequest(branchName, filename);

      status.style.display = 'block';
      status.textContent = `✅ Сторінку ${filename} створено! Тепер ви можете додавати меми.`;
      form.reset();

    } catch (err) {
      debugger
      console.error(err);
      alert('❌ Помилка. Спробуйте ще раз або перевірте зʼєднання.');
    }
  });


  const emojiBtn = document.getElementById('emojiBtn');
  const emojiInput = document.getElementById('emoji');
  const emojiPicker = document.getElementById('emojiPicker');

  emojiBtn.addEventListener('click', () => {
    const isVisible = emojiPicker.style.display === 'block';
    emojiPicker.style.display = isVisible ? 'none' : 'block';
  });

  emojiPicker.addEventListener('emoji-click', event => {
    const emoji = event.detail.unicode;
    emojiInput.value = emoji;
    emojiBtn.textContent = emoji;
    emojiPicker.style.display = 'none';
  });

  document.addEventListener('click', (e) => {
    if (!document.querySelector('.emoji-picker-wrapper').contains(e.target)) {
      emojiPicker.style.display = 'none';
    }
  });

}


renderNewPage();
