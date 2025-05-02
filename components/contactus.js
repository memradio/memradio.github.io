
import { renderHeader } from './Header.js';

export function renderContactUs() {
    const form = document.getElementById('contact-form');
    const emailField = document.getElementById('emailField');
    const wantReply = document.getElementById('wantReply');

    wantReply.addEventListener('change', () => {
        emailField.style.display = wantReply.checked ? 'block' : 'none';
    });

    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email')?.trim();
        const wantsReply = document.getElementById('wantReply').checked;

        // 💡 Валідуємо тільки якщо вибрано "Хочу відповідь"
        if (wantsReply && (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))) {
            alert('Будь ласка, введіть коректну email-адресу, щоб ми могли відповісти');
            return;
        }

        fetch('https://script.google.com/macros/s/AKfycbyTdVJO3qWPNmNmwSa2S0fDaBZDvs8C6vwjViHleCHxaEBpP7i_t5o1H3fAKDUf9UH_/exec', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(text => {
                if (text === 'OK') {
                    successMessage.style.display = 'block';
                    form.reset();
                } else {
                    alert('Сталася помилка. Спробуйте ще раз.');
                }
            })
            .catch(error => {
                console.error('Помилка:', error);
                alert('Сталася помилка. Спробуйте ще раз.');
            });
    });




    document.addEventListener('DOMContentLoaded', () => {

        const app = document.getElementById('mainContent');
        renderHeader(app, { smallLogo: false });
    });
}
renderContactUs();