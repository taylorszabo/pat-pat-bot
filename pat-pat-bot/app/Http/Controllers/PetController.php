<?php

namespace App\Http\Controllers;

use App\Services\PetService;

class PetController extends Controller
{
    public function show()
    {
        $pet = PetService::getState();

        return response()->json([
            'points'      => $pet->points,
            'mood'        => PetService::getMood($pet),
            'maxPoints'   => PetService::MAX_POINTS,
            'lastPatUser' => $pet->last_pat_user,
        ]);
    }

}

