<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PetState extends Model
{
    protected $fillable = [
        'name',
        'points',
        'last_pat_at',
    ];

    protected $casts = [
        'last_pat_at' => 'datetime',
    ];
}
