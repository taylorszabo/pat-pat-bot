<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TwitchAuthController;
use App\Http\Controllers\TwitchConnectionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/', function () {
    return inertia('VirtualPetPage', [
        'twitchChannelName' => session('twitch_channel_name'),
    ]);
});

Route::get('/auth/twitch/redirect', [TwitchAuthController::class, 'redirect'])->name('twitch.redirect');
Route::get('/auth/twitch/callback', [TwitchAuthController::class, 'callback'])->name('twitch.callback');
Route::post('/twitch/disconnect', [TwitchConnectionController::class, 'disconnect'])
    ->name('twitch.disconnect');

Route::get('/debug-twitch', function () {
    return [
        'services_twitch_client_id' => config('services.twitch.client_id'),
        'services_twitch_redirect'  => config('services.twitch.redirect'),
        'env_twitch_redirect'       => env('TWITCH_REDIRECT_URI'),
    ];
});

require __DIR__.'/auth.php';
