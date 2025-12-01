<?php

namespace App\Http\Controllers;

use App\Services\PetService;

class PetController extends Controller
{
    public function show()
    {
        // Just read the current state — NO DECAY HERE.
        $pet = PetService::getState();

        return response()->json([
            'points'    => $pet->points,
            'mood'      => PetService::getMood($pet),
            'maxPoints' => PetService::MAX_POINTS,
        ]);
    }
}
