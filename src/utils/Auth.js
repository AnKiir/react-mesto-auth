export const BASE_URL = "https://auth.nomoreparties.co"

function checkResponce(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, email }),
    })
    .then((res) => {
        return checkResponse(res);
    })
}


// Базовый URL: https://auth.nomoreparties.co.