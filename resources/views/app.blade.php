<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Micro Tracker') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />

        <link rel="preload" as="style" href="{{ asset('build/assets/app-Df7T8Jf-.css') }}" />
        <link rel="modulepreload" href="{{ asset('build/assets/app-BIwG-w4u.js') }}" />
        <link rel="stylesheet" href="{{ asset('build/assets/app-Df7T8Jf-.css') }}" />
        <script type="module" src="{{ asset('build/assets/app-BIwG-w4u.js') }}"></script>
    </head>
    <body class="font-sans antialiased">
        <div id="app"></div>
    </body>
</html>
