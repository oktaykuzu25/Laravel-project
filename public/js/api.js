/**
 * api.js — Tüm sayfaların ortak kullandığı küçük API yardımcısı.
 *
 * Amaç: token saklama ve fetch çağrılarındaki tekrarı tek yerde toplamak (DRY).
 * Her sayfa bu fonksiyonları kullanır; fetch detaylarını tekrar yazmaz.
 */
const Api = {
    // --- Token yönetimi (localStorage) ---
    getToken() {
        return localStorage.getItem('token');
    },
    setToken(token) {
        localStorage.setItem('token', token);
    },
    clearToken() {
        localStorage.removeItem('token');
    },

    /**
     * Tüm isteklerde kullanılacak ortak başlıklar.
     * Accept: application/json -> Laravel hata olunca HTML değil JSON döner.
     * Token varsa Authorization: Bearer ... eklenir.
     */
    headers() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        return headers;
    },

    /**
     * Merkezi fetch sarmalayıcı.
     * Dönüş: { ok, status, data } -> sayfalar buna göre davranır.
     * 401 gelirse (token geçersiz/yok) otomatik login'e atar.
     */
    async request(method, url, body = null) {
        const options = { method, headers: this.headers() };
        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        // 204 (No Content) gibi gövdesiz cevaplarda json() patlamasın.
        let data = null;
        if (response.status !== 204) {
            data = await response.json().catch(() => null);
        }

        // Token geçersizse korumalı sayfada tutmanın anlamı yok.
        if (response.status === 401 && !url.includes('/login') && !url.includes('/register')) {
            this.clearToken();
            window.location.href = '/login';
        }

        return { ok: response.ok, status: response.status, data };
    },

    // Kısayollar
    get(url)        { return this.request('GET', url); },
    post(url, body) { return this.request('POST', url, body); },
    put(url, body)  { return this.request('PUT', url, body); },
    delete(url)     { return this.request('DELETE', url); },

    /**
     * Laravel'in 422 doğrulama hatalarını tek bir okunabilir metne çevirir.
     * data.errors = { email: ["...mesaj..."], password: [...] }
     */
    firstError(data, fallback = 'Bir hata oluştu.') {
        if (data && data.errors) {
            const first = Object.values(data.errors)[0];
            if (Array.isArray(first) && first.length) return first[0];
        }
        if (data && data.message) return data.message;
        return fallback;
    },
};
