export function renderHeader(container) {
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
      <div class="logo">
        <img src="image/favicon.ico" alt="Logo">
      </div>
      <h1 class="title">Мєм Рація</h1>
    `;
    container.appendChild(header);
  }
  