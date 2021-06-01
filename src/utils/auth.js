class Auth {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkData (res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }

    register(email, password) {
        return fetch(`${this._baseUrl}/signup`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then(this._checkData);
    }

    authorize(email, password) {
        return fetch(`${this._baseUrl}/signin`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then(this._checkData);
    }

    getContent(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${token}`,
            },
        }).then(this._checkData);
    }
}

const auth = new Auth({
    baseUrl: "https://auth.nomoreparties.co",
    headers: {
        "Content-Type": "application/json",
    },
});

export default auth;