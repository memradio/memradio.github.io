// ⚠️ TODO: заміни ці значення перед використанням
const GITHUB_USERNAME = 'memradio'; // твій GitHub логін або організація
const REPO = 'memradio.github.io';
const MAIN_BRANCH = 'main';
const API_BASE = 'https://api.github.com';

export async function submitMemeToGitHub({
  sourceFile, // напр. memdata_nastia.js
  newMemeObject, // об'єкт типу { number, name, audio, ... }
  audioFile // File з форми
}) {
  const branchName = `meme-${Date.now()}`;

  // 1. Отримуємо SHA основної гілки
  const { commit: baseCommit, sha: baseSha } = await getBranch();

  // 2. Створюємо нову гілку
  await createBranch(branchName, baseSha);

  // 3. Отримуємо файл memdata_*.js

  const dataPath = `data/${sourceFile}`;
  // 5. Отримуємо файл для заміщення
  const dataFile = await getFile(dataPath)


  const decodedContent = decodeBase64Unicode(dataFile.content.replace(/\n/g, ''));
  const modifiedContent = injectMemeIntoData(decodedContent, newMemeObject);
  const updatedContentBase64 = encodeBase64Unicode(modifiedContent);

  // 4. Додаємо оновлений memdata файл у нову гілку
  await updateFile(dataPath, newMemeObject.name, updatedContentBase64, dataFile.sha, branchName)

  if (audioFile && audioFile.size > 0) {
  // 6. Завантажуємо аудіофайл
    await uploadAudio(audioFile, newMemeObject.audio, newMemeObject.name, branchName);
  }

  // 7. Створюємо pull request
  await createPullRequest(branchName, newMemeObject.name);

  return true;
}

// 🧠 Додає об'єкт до кінця масиву у memdata.js
function injectMemeIntoData(original, newMeme) {
  const trimmed = original.trim();
  const insertBefore = trimmed.lastIndexOf(']');
  const prefix = trimmed.slice(0, insertBefore).trim().replace(/,?$/, ',\n');
  return `${prefix}${JSON.stringify(newMeme, null, 2)}\n]`;
}

// ✅ Unicode-safe base64
function encodeBase64Unicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode('0x' + p1)));
}

function decodeBase64Unicode(str) {
  return decodeURIComponent(atob(str).split('').map(c =>
    '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
}

// ✅ Token getter
function getGitHubToken() {
  const token = localStorage.getItem('github_token') || '';
  if (!token.startsWith('ghp_')) {
    throw new Error('❌ GitHub token is missing or invalid');
  }
  return token;
}

// ✅ API wrappers
async function getBranch() {
  return await fetchJSON(
    `${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/git/refs/heads/${MAIN_BRANCH}`,
    undefined,
    'GET'
  ).then(r => r.object);
}

async function createBranch(branchName, baseSha) {
  return await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });
}

async function getFile(dataPath) {
  return await fetchJSON(
    `${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/${dataPath}?ref=${MAIN_BRANCH}`,
    undefined,
    'GET'
  );
}

async function updateFile(dataPath, fileName, updatedContentBase64, sha, branchName) {
  return await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/${dataPath}`, {
    message: `додано новий мем: ${fileName}`,
    content: updatedContentBase64,
    branch: branchName,
    sha: sha,
  }, 'PUT');
}

async function uploadAudio(audioFile, audioFileName, memeName, branchName) {
  const audioContent = await fileToBase64(audioFile);
  const audioPath = `audio/${audioFileName}`;
  return await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/contents/${audioPath}`, {
    message: `додано аудіо до мема: ${memeName}`,
    content: audioContent,
    branch: branchName,
  }, 'PUT');
}

async function createPullRequest(branchName, memeName) {
  return await fetchJSON(`${API_BASE}/repos/${GITHUB_USERNAME}/${REPO}/pulls`, {
    title: `🆕 Мем: ${memeName}`,
    head: branchName,
    base: MAIN_BRANCH,
    body: `Автоматично згенерований PR для нового мема.`,
  });
}

// ✅ Dynamic token + method-aware fetch
async function fetchJSON(url, body = undefined, method = 'POST') {
  const headers = {
    Authorization: `token ${getGitHubToken()}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('GitHub API error:', err);
    throw new Error(err.message || `GitHub request failed with ${res.status}`);
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
