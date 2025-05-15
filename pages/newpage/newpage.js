import { renderHeader } from '/components/Header.js';
import { renderFooter } from '/components/Footer.js';
import { FileExists, addNewDataFile, getBranch, createBranch, createNewUserPullRequest } from '/api/githubapi.js';


function renderNewPage() {

  document.addEventListener('DOMContentLoaded', () => {

    const app = document.getElementById('app');

    renderHeader(app, { smallLogo: false, displayToggle: false, tile: '🆕 Створити нову сторінку мемів' });
    renderFooter(app);
  });


  const form = document.getElementById('newPageForm');
  const input = document.getElementById('newPageName');
  const status = document.getElementById('status');

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
      const createRes = await addNewDataFile(filename, filePath, branchName)

      if (!createRes.ok) throw new Error('Помилка створення');


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
}


renderNewPage();
