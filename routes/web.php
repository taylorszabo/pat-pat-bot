<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TwitchAuthController;
use App\Http\Controllers\TwitchConnectionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return inertia('VirtualPetPage', [
        'twitchChannelName' => session('twitch_channel_name'),
    ]);
});

Route::get('/auth/twitch/redirect', [TwitchAuthController::class, 'redirect'])->name('twitch.redirect');
Route::get('/auth/twitch/callback', [TwitchAuthController::class, 'callback'])->name('twitch.callback');
Route::post('/twitch/disconnect', [TwitchConnectionController::class, 'disconnect'])
    ->name('twitch.disconnect');


require __DIR__.'/auth.php';
