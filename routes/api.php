<?php

use App\Http\Controllers\BotChannelsController;
use App\Http\Controllers\PetController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetPatController;

Route::post('/pet/pat', [PetPatController::class, 'store']);
Route::get('/pet', [PetController::class, 'show'])->name('pet.show');
Route::post('/pet/reset', [PetController::class, 'reset']);

Route::get('/bot/channels', [BotChannelsController::class, 'index']);
