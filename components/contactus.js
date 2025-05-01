
import { renderHeader } from './Header.js';

export function renderContactUs() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch('https://script.google.com/macros/s/AKfycbwvxqpNO3UR3w5GUPaGBCcs7j0eF5Bx7grD2hRJkoE51DF62k1x6595RwF547ts8x8/exec', {
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