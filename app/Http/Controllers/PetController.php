<?php

namespace App\Http\Controllers;

use App\Services\PetService;
use Illuminate\Http\Request;

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

    public function reset(Request $request)
    {
        $key = $request->header('X-BOT-KEY');
        if (!$key || !hash_equals(config('services.bot.key'), $key)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $pet = PetService::resetToNeutral();

        return response()->json([
            'points' => (int) $pet->points,
            'mood' => PetService::getMood($pet),
            'maxPoints' => (int) $pet->max_points,
            'lastPatUser' => null,
        ]);
    }

}

