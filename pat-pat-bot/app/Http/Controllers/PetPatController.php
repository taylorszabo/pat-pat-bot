<?php

// app/Http/Controllers/PetPatController.php

namespace App\Http\Controllers;

use App\Services\PetService;
use Illuminate\Http\Request;

class PetPatController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->string('user')->toString(); // Twitch username

        $pet = PetService::pat($user);

        return response()->json([
            'points'      => $pet->points,
            'mood'        => PetService::getMood($pet),
            'maxPoints'   => PetService::MAX_POINTS,
            'lastPatUser' => $pet->last_pat_user,
        ]);
    }
}
