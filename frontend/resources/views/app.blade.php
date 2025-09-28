<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @routes
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
