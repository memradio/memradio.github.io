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
