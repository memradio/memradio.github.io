const apiKey = '5fda3ac6c1299b7f132bcfb69b45fc0a'; // Замінити на свій ключ

export async function fetchCities(query) {
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKey,
            modelName: 'Address',
            calledMethod: 'getCities',
            methodProperties: { FindByString: query }
        })
    });
    const data = await response.json();
    return data.data;
}

export async function fetchWarehouses(cityRef) {
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKey,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
                CityRef: cityRef
            }
        })
    });
    const data = await response.json();
    return data.data;
}