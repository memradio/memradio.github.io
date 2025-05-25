
export function renderFooter(container) {
  const footer = document.createElement('footer');

  footer.innerHTML = `
      <div class="footer-content">
        <p>Створено з любов'ю до мемів у проєкті <strong>Мєм Рація</strong></p>
        <p>🛋 <a href="/pages/contactus">Зв'язатись з нами</a></p>
         <p><a href="/pages/submit" class="submit-link">📤 Надіслати мем</a> <p>
           <a href="/pages/store" target="_blank" class="buy-button" role="button">
    <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l1.5 7h7l1.5-7M9 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
    Придбати рацію
  </a>
      </div>
    `;

  container.appendChild(footer);
}
