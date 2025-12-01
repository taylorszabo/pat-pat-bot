<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PetService;

class PetDecayCommand extends Command
{
    protected $signature = 'pet:decay';
    protected $description = 'Apply happiness decay if the pet has not been patted recently';

    public function handle(): int
    {
        $petBefore = PetService::getState();
        $pointsBefore = $petBefore->points;

        $petAfter = PetService::applyDecay();
        $mood = PetService::getMood($petAfter);

        if ($petAfter->points !== $pointsBefore) {
            $this->info("Decay applied. Points: {$petAfter->points} Mood: {$mood}");
        } else {
            $this->info("No decay applied. Points: {$petAfter->points} Mood: {$mood}");
        }

        return self::SUCCESS;
    }
}
