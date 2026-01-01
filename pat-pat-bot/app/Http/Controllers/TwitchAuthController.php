<?php

namespace App\Http\Controllers;

use App\Models\TwitchChannel;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;

class TwitchAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('twitch')
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        $twitchUser = Socialite::driver('twitch')->user();

        $channel = strtolower($twitchUser->getNickname() ?? '');
        $display = $twitchUser->getName();

        if ($channel === '') {
            return redirect('/')->with('error', 'Could not read Twitch channel login.');
        }

        TwitchChannel::updateOrCreate(
            ['twitch_channel_name' => $channel],
            [
                'twitch_user_id' => (string) $twitchUser->getId(),
                'display_name' => $display,
                'connected' => true,
            ]
        );

        return redirect('/')->with('status', "Connected PatPat bot for #{$channel}!");
    }
}
