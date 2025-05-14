// ⚠️ TODO: заміни ці значення перед використанням
const GITHUB_USERNAME = 'memradio'; // твій GitHub логін або організація
const REPO = 'memradio.github.io';
const MAIN_BRANCH = 'main';
const GITHUB_TOKEN = ''; // 🔐 вставиш пізніше

const API_BASE = 'https://api.github.com';

export async function submitMemeToGitHub({
  sourceFile, // напр. memdata_nastia.js
  newMemeObject, // об'єкт типу { number, name, audio, ... }
  audioFile // File з форми
}) {
  const branchName = `meme-${Date.now()}`;
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  };

  // 1. Отримуємо SHA основної гілки
  const { commit: baseCommit, sha: baseSha } = await fetchJSON(
    `${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/git/refs/heads/${MAIN_BRANCH}`,
    {},
    undefined,
    'GET'
  ).then(r => r.object);

  // 2. Створюємо нову гілку
  await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/git/refs`, headers, {
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  // 3. Отримуємо файл memdata_*.js
  const dataPath = `data/${sourceFile}`;
  const dataFile = await fetchJSON(
    `${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/${dataPath}?ref=${MAIN_BRANCH}`,
    {},
    undefined,
    'GET'
  );
  debugger;
  const decodedContent = atob(dataFile.content.replace(/\n/g, ''));
  const modifiedContent = injectMemeIntoData(decodedContent, newMemeObject);

  // 4. Кодуємо оновлений файл
  const updatedContentBase64 = btoa(unescape(encodeURIComponent(modifiedContent)));

  // 5. Додаємо memdata файл у нову гілку
  await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/${dataPath}`, headers, {
    message: `додано новий мем: ${newMemeObject.name}`,
    content: updatedContentBase64,
    branch: branchName,
    sha: dataFile.sha,
  }, 'PUT');

  // 6. Завантажуємо аудіофайл
  const audioContent = await fileToBase64(audioFile);
  const audioPath = `audio/${newMemeObject.audio}`;
  await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/${audioPath}`, headers, {
    message: `додано аудіо до мема: ${newMemeObject.name}`,
    content: audioContent,
    branch: branchName,
  }, 'PUT');

  debugger;

  // 7. Створюємо pull request
  await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/pulls`, headers, {
    title: `🆕 Мем: ${newMemeObject.name}`,
    head: branchName,
    base: MAIN_BRANCH,
    body: `Автоматично згенерований PR для нового мема.`,
  });

  return true;
}

// 🧠 Додає об'єкт до кінця масиву у memdata.js
function injectMemeIntoData(original, newMeme) {
  const trimmed = original.trim();
  const insertBefore = trimmed.lastIndexOf(']');
  const prefix = trimmed.slice(0, insertBefore).trim().replace(/,?$/, ',\n');
  return `${prefix}${JSON.stringify(newMeme, null, 2)}\n]`;
}

async function fetchJSON(url, headers, body, method = 'POST') {

  const res = await fetch(url, {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await res.json();
    console.error('GitHub API error:', err);
    throw new Error(err.message || 'GitHub request failed');
  }
  return res.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
