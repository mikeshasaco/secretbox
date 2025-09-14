<?php

use Illuminate\Support\Facades\Route;

// SPA routes - all routes should return the main app view
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
