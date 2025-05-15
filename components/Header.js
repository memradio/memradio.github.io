import { renderScrollBtn } from '/components/scrollToTopBtn.js'
import { createMaterialToggle } from '/components/toggle.js';

export function renderHeader(container, options = {}) {
  const header = document.createElement('div');
  header.className = 'header';

  // Визначаємо який логотип вставляти
  const logoSrc = options.smallLogo
    ? '/image/favicon.ico'
    : '/image/logo-full.png';

  header.innerHTML = `
      <a href="/" class="logo">
      
        <img src="${logoSrc}" alt="Logo" class="${options.smallLogo ? 'small-logo' : 'full-logo'}">
      </a>
      <h1 class="title">${options.title ? options.title: 'Мєм Рація'}</h1>
    `;

  container.appendChild(header);
  renderScrollBtn(header);


  if (options.displayToggle) {

    const toggle = createMaterialToggle({
      id: 'textModeToggle',
      label: 'Режим тексту',
      emojiOn: '📃',
      emojiOff: '🎵',
      defaultState: false
    });

    header.appendChild(toggle);
  }
}
