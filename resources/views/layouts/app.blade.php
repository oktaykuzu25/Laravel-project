<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Görev Yöneticisi')</title>

    {{-- Tailwind CSS (Play CDN — kurulum gerektirmez) --}}
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-100 text-slate-800 antialiased">

    @yield('content')

    {{-- Ortak API yardımcısı: token saklama + fetch sarmalayıcı --}}
    <script src="{{ asset('js/api.js') }}"></script>

    {{-- Her sayfa kendi script'ini buraya basar --}}
    @yield('scripts')
</body>
</html>
