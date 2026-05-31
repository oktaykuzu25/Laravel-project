<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * Sayfa (Blade view) döndüren controller.
 * Bu sayfalarda koruma yapılmaz; token kontrolü tarayıcıda JavaScript ile olur.
 */
class PageController extends Controller
{
    public function login(): View
    {
        return view('auth.login');
    }

    public function register(): View
    {
        return view('auth.register');
    }

    public function home(): View
    {
        return view('tasks.home');
    }
}
