
export function renderFooter(container) {
  const footer = document.createElement('footer');

  footer.innerHTML = `
      <div class="footer-content">
        <p>Створено з любов'ю до мемів у проєкті <strong>Мєм Рація</strong></p>
        <p>🛋 <a href="/pages/contactus.html">Зв'язатись з нами</a></p>
         <p><a href="/pages/submit" class="submit-link">📤 Надіслати мем</a> <p>
      </div>
    `;

  container.appendChild(footer);
}
