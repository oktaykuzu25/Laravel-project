@extends('layouts.app')

@section('title', 'Kayıt Ol')

@section('content')
<div class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 class="text-center text-2xl font-bold tracking-tight">Görev Yöneticisi</h1>
        <p class="mb-6 text-center text-slate-500">Yeni hesap oluştur</p>

        <div id="alert" class="mb-4 hidden rounded-md p-3 text-sm"></div>

        <form id="registerForm" novalidate class="space-y-4">
            <div>
                <label for="name" class="mb-1 block text-sm font-medium text-slate-700">Ad Soyad</label>
                <input type="text" id="name" required
                    class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
                <label for="email" class="mb-1 block text-sm font-medium text-slate-700">E-posta</label>
                <input type="email" id="email" required
                    class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
                <label for="password" class="mb-1 block text-sm font-medium text-slate-700">Şifre</label>
                <input type="password" id="password" required
                    class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
                <label for="password_confirmation" class="mb-1 block text-sm font-medium text-slate-700">Şifre (Tekrar)</label>
                <input type="password" id="password_confirmation" required
                    class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>

            <button type="submit" id="submitBtn"
                class="w-full rounded-md bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60">
                Kayıt Ol
            </button>
        </form>

        <p class="mt-4 text-center text-sm text-slate-600">
            Zaten hesabın var mı? <a href="/login" class="font-medium text-indigo-600 hover:underline">Giriş yap</a>
        </p>
    </div>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/register.js') }}"></script>
@endsection
