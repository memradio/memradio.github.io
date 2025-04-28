export function renderHeader(container, options = {}) {
    const header = document.createElement('div');
    header.className = 'header';
  
    // Визначаємо який логотип вставляти
    const logoSrc = options.smallLogo
      ? 'image/favicon.ico'
      : 'image/logo-full.png';
  
    header.innerHTML = `
      <div class="logo">
        <img src="${logoSrc}" alt="Logo" class="${options.smallLogo ? 'small-logo' : 'full-logo'}">
      </div>
      <h1 class="title">Мєм Рація</h1>
    `;
  
    container.appendChild(header);
  }
  