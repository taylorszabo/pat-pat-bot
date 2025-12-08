<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetPatController;

Route::post('/pet/pat', [PetPatController::class, 'store']);
