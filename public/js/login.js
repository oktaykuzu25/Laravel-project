/**
 * login.js — Giriş formunu /api/login ucuna bağlar.
 */

if (Api.getToken()) {
    window.location.href = '/home';
}

const form = document.getElementById('loginForm');
const alertBox = document.getElementById('alert');
const submitBtn = document.getElementById('submitBtn');

function showAlert(message) {
    alertBox.className = 'mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700';
    alertBox.textContent = message;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Giriş yapılıyor...';

    const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    const { ok, data } = await Api.post('/api/login', payload);

    if (ok) {
        Api.setToken(data.token);
        window.location.href = '/home';
        return;
    }

    showAlert(Api.firstError(data, 'E-posta veya şifre hatalı.'));
    submitBtn.disabled = false;
    submitBtn.textContent = 'Giriş Yap';
});
