<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Bu rotalar sadece HTML (Blade) sayfaları döndürür. Asıl koruma ve veri
| işlemleri API uçlarında (routes/api.php) yapılır; sayfalar token'ı
| tarayıcıdaki localStorage üzerinden JavaScript ile kullanır.
|
*/

// Ana sayfa: token varsa home'a, yoksa login'e yönlendirme işini JS yapar.
Route::get('/', [PageController::class, 'login']);

Route::get('/login', [PageController::class, 'login'])->name('login');
Route::get('/register', [PageController::class, 'register'])->name('register');
Route::get('/home', [PageController::class, 'home'])->name('home');
