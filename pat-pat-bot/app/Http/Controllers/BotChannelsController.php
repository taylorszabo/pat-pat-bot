<?php

namespace App\Http\Controllers;

use App\Models\TwitchChannel;
use Illuminate\Http\Request;

class BotChannelsController extends Controller
{
    public function index(Request $request)
    {
        $key = $request->header('X-BOT-KEY');
        if (!$key || $key !== config('services.bot.key')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $channels = TwitchChannel::query()
            ->where('connected', true)
            ->pluck('twitch_channel_name')
            ->values();

        return response()->json(['channels' => $channels]);
    }
}
