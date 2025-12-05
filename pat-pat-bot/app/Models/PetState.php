<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PetState extends Model
{
    /**
     * @var mixed|string|null
     */
    protected $fillable = [
        'name',
        'points',
        'last_pat_at',
        'last_pat_user',
    ];

    protected $casts = [
        'last_pat_at' => 'datetime',
    ];
}

