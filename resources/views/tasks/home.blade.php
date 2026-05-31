@extends('layouts.app')

@section('title', 'Görevlerim')

@section('content')
{{-- Üst menü --}}
<nav class="bg-indigo-600 text-white shadow">
    <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <span class="text-lg font-bold tracking-tight">Görev Yöneticisi</span>
        <button id="logoutBtn"
            class="rounded-md border border-white/40 px-3 py-1 text-sm transition hover:bg-white/10">
            Çıkış Yap
        </button>
    </div>
</nav>

<div class="mx-auto max-w-2xl px-4 py-6">

    {{-- Yeni görev ekleme formu --}}
    <div class="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <form id="taskForm" class="space-y-3">
            <input type="text" id="title" placeholder="Görev başlığı" required
                class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <input type="text" id="description" placeholder="Açıklama (opsiyonel)"
                class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <button type="submit"
                class="w-full rounded-md bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-700">
                Görev Ekle
            </button>
        </form>
    </div>

    {{-- Hata mesajı --}}
    <div id="alert" class="mb-4 hidden rounded-md p-3 text-sm"></div>

    {{-- Görev listesi buraya JS ile basılır --}}
    <div id="taskList" class="space-y-2"></div>
    <p id="emptyState" class="mt-6 hidden text-center text-slate-400">
        Henüz görevin yok. Yukarıdan ekleyebilirsin.
    </p>

</div>
@endsection

@section('scripts')
<script src="{{ asset('js/home.js') }}"></script>
@endsection
