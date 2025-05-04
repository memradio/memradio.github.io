import { fetchCities, fetchWarehouses } from "/api/novapostapi.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    let cityList = [];
    let selectedCityRef = null;

    const cityInput = document.querySelector('#cityInput');
    const warehouseSelect = document.querySelector('#warehouseSelect');
    cityInput.addEventListener('input', async () => {
        const value = cityInput.value.trim();
        if (value.length < 3) return;
        cityList = await fetchCities(value);

        const datalistId = 'city-suggestions';
        let datalist = document.getElementById(datalistId);
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = datalistId;
            document.body.appendChild(datalist);
            cityInput.setAttribute('list', datalistId);
        }
        datalist.innerHTML = '';

        cityList.forEach(city => {
            const option = document.createElement('option');
            option.value = city.Description;
            datalist.appendChild(option);
        });

        if (cityList.length > 0) {
            const firstCity = cityList[0];
            selectedCityRef = firstCity.Ref;
            const warehouses = await fetchWarehouses(selectedCityRef);
            warehouseSelect.innerHTML = '<option value="">Оберіть відділення</option>';
            warehouses.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.Description;
                opt.textContent = w.Description;
                warehouseSelect.appendChild(opt);
            });
        }
    });

    const hideOnlineVer = () => {
        const onlineVersion = document.querySelector('#online-version');
        onlineVersion.style.display = window.location.href.includes('#order') ? 'none' : 'flex';
    }

    hideOnlineVer();

    window.addEventListener('popstate', hideOnlineVer);

});
// Надсилання форми до Google Sheets і email
const orderForm = document.querySelector('form');
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = orderForm.querySelector('input[placeholder="Ваше ім’я"]').value;
    const phone = orderForm.querySelector('input[placeholder="Номер телефону"]').value;
    const city = orderForm.querySelector('input[placeholder^="Місто"]').value;
    const branch = orderForm.querySelector('select').value;

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        showMessage("Невірний формат номера телефону.", true);
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('city', city);
    formData.append('branch', branch);

    const response = await fetch("https://script.google.com/macros/s/AKfycbz9KTW9T0RRMpflU8-ZNf7_xblXhxyzQ6Ux_QsuanUAZ18dmaWLuvyBGNHOjBDsujxNPw/exec", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        alert("Дякуємо! Замовлення надіслано ✅");
        orderForm.reset();
    } else {
        alert("Помилка при надсиланні. Спробуйте ще раз.");
    }
});
