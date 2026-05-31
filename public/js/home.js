/**
 * home.js — Korumalı görev (Task) sayfasının tüm mantığı.
 *
 * Bu dosya ne yapar?
 *  - Sayfaya giren kişinin token'ı var mı diye bakar (yoksa login'e atar).
 *  - API'den görevleri çekip ekrana basar.
 *  - Yeni görev ekleme, tamamlandı işaretleme ve silme işlemlerini yönetir.
 *  - Çıkış (logout) yapar.
 *
 * Önemli: Bu sayfa "akılsız" bir arayüzdür. Tüm gerçek işi (DB, yetki, doğrulama)
 * API yapar. Burası sadece API'ye istek atıp dönen veriyi gösterir.
 */

// ============================================================
// 1) BEKÇİ (GUARD): Token yoksa bu sayfada işin yok
// ============================================================
// Api.getToken() localStorage'daki token'ı okur. Token yoksa kullanıcı
// giriş yapmamış demektir; onu hemen login sayfasına yönlendiriyoruz.
// Bu, frontend tarafındaki koruma. (Asıl koruma yine de API'de auth:sanctum ile var.)
if (!Api.getToken()) {
    window.location.href = '/login';
}

// ============================================================
// 2) HTML ELEMANLARINI YAKALA
// ============================================================
// Blade sayfasındaki id'li elemanları bir kez yakalayıp değişkene koyuyoruz.
// Böylece aşağıda her seferinde document.getElementById yazmak yerine
// kısa isimle (titleInput gibi) ulaşıyoruz. Temiz ve okunabilir.
const taskForm   = document.getElementById('taskForm');   // Görev ekleme formu
const titleInput = document.getElementById('title');      // Başlık kutusu
const descInput  = document.getElementById('description'); // Açıklama kutusu
const taskList   = document.getElementById('taskList');   // Görevlerin basılacağı kutu
const emptyState = document.getElementById('emptyState'); // "Görevin yok" yazısı
const alertBox   = document.getElementById('alert');      // Hata mesajı kutusu

// ============================================================
// 3) YARDIMCI FONKSİYONLAR
// ============================================================

/**
 * Ekrana kırmızı bir hata mesajı basar.
 * className ile Tailwind sınıflarını set ediyoruz; 'hidden' kalktığı için görünür olur.
 */
function showAlert(message) {
    alertBox.className = 'mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700';
    alertBox.textContent = message; // textContent kullanıyoruz (innerHTML değil) -> güvenli
}

/**
 * Güvenlik için: kullanıcının yazdığı metni ekrana basmadan önce "kaçırır".
 * Örn. biri başlığa <script> yazarsa, bu onu zararsız metne çevirir (XSS koruması).
 * Mantık: metni bir div'in textContent'ine koy, sonra innerHTML'ini al ->
 * tarayıcı özel karakterleri (< > & gibi) otomatik kaçışlı hale getirir.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? ''; // text null/undefined ise boş string kullan
    return div.innerHTML;
}

// ============================================================
// 4) GÖREVLERİ ÇEK VE EKRANA BAS (READ)
// ============================================================
/**
 * API'den giriş yapan kullanıcının görevlerini çeker ve listeler.
 * async/await kullanıyoruz çünkü API isteği zaman alır; cevabı beklememiz gerekir.
 */
async function loadTasks() {
    // Api.get token'ı otomatik ekler. Dönüş: { ok, status, data }
    const { ok, data } = await Api.get('/api/tasks');

    // İstek başarısızsa (ör. sunucu hatası) kullanıcıyı bilgilendir ve çık.
    if (!ok) {
        showAlert('Görevler yüklenemedi.');
        return;
    }

    // Laravel API Resource, görevleri data.data içinde döner.
    // (|| [] -> hiç veri yoksa boş diziye düş, döngü patlamasın.)
    const tasks = data.data || [];

    // Listeyi her yüklemede sıfırlıyoruz, sonra baştan dolduruyoruz.
    taskList.innerHTML = '';

    // Görev varsa "boş" yazısını gizle, yoksa göster.
    // toggle('hidden', koşul): koşul true ise hidden ekler (gizler), false ise kaldırır.
    emptyState.classList.toggle('hidden', tasks.length > 0);

    // Her görev için renderTask çalıştır -> tek tek ekrana basar.
    tasks.forEach(renderTask);
}

/**
 * Tek bir görevi alıp ekrana bir satır (kart) olarak basar.
 * Hem görünümü oluşturur hem de o satırın butonlarına olay dinleyici bağlar.
 */
function renderTask(task) {
    // Görevi içine koyacağımız kutuyu (div) oluştur.
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between rounded-lg bg-white p-3 shadow-sm';

    // Görev tamamlandıysa başlığın üstünü çiz ve soluklaştır.
    const titleClass = task.is_completed ? 'line-through text-slate-400' : 'text-slate-800';

    // Kartın iç HTML'i: solda checkbox + başlık, sağda Sil butonu.
    // task.is_completed true ise checkbox işaretli gelsin.
    // escapeHtml ile başlığı güvenli basıyoruz.
    item.innerHTML = `
        <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                ${task.is_completed ? 'checked' : ''}>
            <span class="${titleClass}">${escapeHtml(task.title)}</span>
        </label>
        <button class="rounded-md border border-red-300 px-2 py-1 text-sm text-red-600 transition hover:bg-red-50">
            Sil
        </button>
    `;

    // Checkbox değişince (işaretle/kaldır) -> tamamlandı durumunu API'de güncelle.
    // e.target.checked: kutunun yeni durumu (true/false).
    item.querySelector('input').addEventListener('change', (e) => {
        toggleComplete(task.id, e.target.checked);
    });

    // Sil butonuna tıklanınca -> o görevi API'den sil.
    item.querySelector('button').addEventListener('click', () => {
        deleteTask(task.id);
    });

    // Hazır kartı listeye ekle.
    taskList.appendChild(item);
}

// ============================================================
// 5) YENİ GÖREV EKLE (CREATE)
// ============================================================
// Form gönderilince çalışır.
taskForm.addEventListener('submit', async (event) => {
    // Formun varsayılan davranışı sayfayı yenilemektir; bunu engelliyoruz ki
    // fetch çalışabilsin (yoksa sayfa gider, JS yarıda kalır).
    event.preventDefault();

    // Kutulardaki değerleri API'nin beklediği şekle sokuyoruz.
    const payload = {
        title: titleInput.value,
        description: descInput.value,
    };

    // API'ye POST at. Token otomatik eklenir.
    const { ok, data } = await Api.post('/api/tasks', payload);

    // Doğrulama hatası vb. olursa (ör. başlık boş) Türkçe mesajı göster ve çık.
    if (!ok) {
        showAlert(Api.firstError(data));
        return;
    }

    // Başarılı: formu temizle, varsa hata kutusunu gizle, listeyi tazele.
    taskForm.reset();
    alertBox.classList.add('hidden');
    loadTasks(); // En basit yol: tüm listeyi yeniden çek. (Tek kartı eklemek de mümkündü.)
});

// ============================================================
// 6) TAMAMLANDI DURUMUNU GÜNCELLE (UPDATE)
// ============================================================
/**
 * Bir görevin is_completed alanını API'de günceller.
 * @param id          Görev id'si
 * @param isCompleted Yeni durum (true/false)
 */
async function toggleComplete(id, isCompleted) {
    // PUT /api/tasks/{id} -> sadece is_completed alanını gönderiyoruz.
    const { ok } = await Api.put('/api/tasks/' + id, { is_completed: isCompleted });

    if (!ok) {
        showAlert('Görev güncellenemedi.');
        return;
    }

    // Başarılı: listeyi tazele ki üstü çizili görünüm güncellensin.
    loadTasks();
}

// ============================================================
// 7) GÖREVİ SİL (DELETE)
// ============================================================
async function deleteTask(id) {
    // DELETE /api/tasks/{id}
    const { ok } = await Api.delete('/api/tasks/' + id);

    if (!ok) {
        showAlert('Görev silinemedi.');
        return;
    }

    // Başarılı: listeyi tazele, silinen kart ekrandan kalksın.
    loadTasks();
}

// ============================================================
// 8) ÇIKIŞ YAP (LOGOUT)
// ============================================================
// Çıkış butonuna tıklanınca token'ı sil ve login'e dön.
// Not: Bu sadece tarayıcıdaki token'ı siler; sunucudaki token hâlâ geçerli kalır.
// (Daha güvenlisi: API'ye /logout ucu ekleyip token'ı orada da iptal etmek.)
document.getElementById('logoutBtn').addEventListener('click', () => {
    Api.clearToken();
    window.location.href = '/login';
});

// ============================================================
// 9) SAYFA AÇILIŞI
// ============================================================
// Yukarıdaki tanımlar sadece "ne yapılacağını" belirliyor. Asıl başlangıç burası:
// sayfa yüklenir yüklenmez görevleri çekip ekrana basıyoruz.
loadTasks();
