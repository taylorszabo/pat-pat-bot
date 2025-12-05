<?php


namespace App\Services;

use App\Models\PetState;
use Carbon\Carbon;

class PetService
{
    public const MAX_POINTS = 500;
    public const MIN_POINTS = 0;

    public const PAT_DELTA = 5;      // +5 per command
    public const DECAY_DELTA = 1;    // -1 when decaying
    public const DECAY_AFTER_SECONDS = 60; // if no pat for 1 minute, start decay

    public static function getState(): PetState
    {
        return PetState::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'stream_pet',
                'points' => 100,
                'last_pat_at' => now(),
            ]
        );
    }

// app/Services/PetService.php

    public static function pat(?string $user = null): PetState
    {
        $pet = self::getState();

        $pet->points = min(self::MAX_POINTS, $pet->points + self::PAT_DELTA);
        $pet->last_pat_at = now();
        $pet->last_pat_user = $user;
        $pet->save();

        return $pet;
    }


    public static function applyDecay(): PetState
    {
        $pet = self::getState();

        if (!$pet->last_pat_at instanceof Carbon) {
            return $pet;
        }

        if ($pet->last_pat_at->diffInSeconds(now()) < self::DECAY_AFTER_SECONDS) {
            return $pet;
        }

        $pet->points = max(self::MIN_POINTS, $pet->points - self::DECAY_DELTA);
        $pet->save();

        return $pet;
    }

    public static function getMood(PetState $pet): string
    {
        $points = $pet->points;

        if ($points <= 25) {
            return 'very_sad';
        }

        if ($points <= 50) {
            return 'sad';
        }

        if ($points < 150) {
            return 'neutral';
        }

        if ($points < 300) {
            return 'happy';
        }

        return 'very_happy';
    }
}
