
export function renderFooter(container) {
  const footer = document.createElement('footer');

  debugger;
  footer.innerHTML = `
      <div class="footer-content">
        <p>Створено з любов'ю до мемів у проєкті <strong>Мєм Рація</strong></p>
        <p>🛋 <a href="/pages/contactus.html">Зв'язатись з нами</a></p>
      </div>
    `;

  container.appendChild(footer);
}
