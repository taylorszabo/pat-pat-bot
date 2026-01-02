<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PetService;

class PatPetCommand extends Command
{
    protected $signature = 'pet:pat';
    protected $description = 'Simulate patting the virtual pet (+5 points)';

    public function handle(): int
    {
        $pet = PetService::pat();
        $mood = PetService::getMood($pet);

        $this->info("You patted the pet! Points: {$pet->points} Mood: {$mood}");

        return self::SUCCESS;
    }
}
