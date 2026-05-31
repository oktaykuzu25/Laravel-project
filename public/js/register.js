/**
 * register.js — Kayıt formunu /api/register ucuna bağlar.
 */

// Zaten girişliyse doğrudan home'a al.
if (Api.getToken()) {
    window.location.href = '/home';
}

const form = document.getElementById('registerForm');
const alertBox = document.getElementById('alert');
const submitBtn = document.getElementById('submitBtn');

function showAlert(message) {
    alertBox.className = 'mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700';
    alertBox.textContent = message;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Sayfanın yenilenmesini engelle.

    submitBtn.disabled = true;
    submitBtn.textContent = 'Kaydediliyor...';

    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password_confirmation').value,
    };

    const { ok, data } = await Api.post('/api/register', payload);

    if (ok) {
        Api.setToken(data.token);          // Token'ı sakla
        window.location.href = '/home';    // Home'a yönlendir
        return;
    }

    // Hata: Türkçe validation mesajını göster.
    showAlert(Api.firstError(data));
    submitBtn.disabled = false;
    submitBtn.textContent = 'Kayıt Ol';
});
