<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TwitchChannel extends Model
{
    protected $fillable = [
        'twitch_user_id',
        'twitch_channel_name',
        'display_name',
        'connected',
    ];

    protected $casts = [
        'connected' => 'boolean',
    ];
}
