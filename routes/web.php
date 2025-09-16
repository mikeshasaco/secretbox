<?php

use Illuminate\Support\Facades\Route;

// Include authentication routes
require __DIR__.'/auth.php';

// Protected app route
Route::middleware('auth')->get('/app', function () {
    return view('app');
});

// SPA routes - all other routes should return the main app view
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
