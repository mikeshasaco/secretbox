<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ApiKeyController;
use App\Http\Controllers\Api\VisitorController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\RollupController;
use App\Http\Controllers\Api\AdsController;
use App\Http\Controllers\Api\SpendController;
use App\Http\Controllers\Api\AnalyticsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// CSRF token route
Route::middleware('web')->get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// User route for session-based auth
Route::middleware('web')->get('/user', function (Request $request) {
    return $request->user();
});

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected auth routes
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
});

// Protected app routes (session-based auth via web guard)
Route::middleware(['web', 'auth'])->prefix('v1')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/rotate-keys', [ProjectController::class, 'rotateKeys']);
    
    // API Keys
    Route::apiResource('api-keys', ApiKeyController::class);
    
    // Visitors
    Route::get('projects/{project}/visitors', [VisitorController::class, 'index']);
    Route::get('visitors/{visitor}', [VisitorController::class, 'show']);
    
    // Sessions
    Route::get('projects/{project}/sessions', [SessionController::class, 'index']);
    Route::get('sessions/{session}', [SessionController::class, 'show']);
    
    // Events
    Route::get('projects/{project}/events', [EventController::class, 'index']);
    
    // Daily Rollups
    Route::get('projects/{project}/rollups', [RollupController::class, 'indexByRange']);
    
    // Ads
    Route::get('ads/dim', [AdsController::class, 'dimIndex']);
    Route::get('ads/engagement', [AdsController::class, 'engagementByRange']);
    
    // Analytics
    Route::get('analytics/cpev', [AnalyticsController::class, 'cpevByRange']);
    Route::get('analytics/top-creatives', [AnalyticsController::class, 'topCreativesByCPEV']);
    Route::get('analytics/placement', [AnalyticsController::class, 'placementBreakdown']);
    
    // Spend
    Route::post('spend/upload', [SpendController::class, 'uploadCsv']);
});

// Ingest endpoint with project validation
Route::middleware(['validate.ingest.project', 'throttle:60,1'])->prefix('v1')->group(function () {
    Route::post('ingest/event', [EventController::class, 'storeIngest']);
});

// API Key protected routes for spend data
Route::middleware(['api.key', 'throttle:10,1'])->prefix('v1')->group(function () {
    Route::post('spend/upload', [SpendController::class, 'uploadCsv']);
});
