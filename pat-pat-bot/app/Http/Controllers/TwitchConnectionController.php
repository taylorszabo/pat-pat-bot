<?php

namespace App\Http\Controllers;

use App\Models\TwitchChannel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TwitchConnectionController extends Controller
{
    public function disconnect(Request $request): RedirectResponse
    {
        // ✅ correct session key (no semicolon)
        $channel = $request->session()->get('twitch_channel_name');

        if ($channel) {
            TwitchChannel::where('twitch_channel_name', $channel)
                ->update(['connected' => false]);
        }

        $request->session()->forget('twitch_channel_name');

        return redirect('/')->with('status', 'Disconnected PatPat bot from your channel.');
    }
}
