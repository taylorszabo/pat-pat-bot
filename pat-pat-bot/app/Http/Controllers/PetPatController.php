<?php

// app/Http/Controllers/PetPatController.php

namespace App\Http\Controllers;

use App\Services\PetService;
use Illuminate\Http\Request;

class PetPatController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->input('user');

        $pet = PetService::pat($user);

        return response()->json(['status' => 'ok']);
    }
}
