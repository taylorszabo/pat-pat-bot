<?php

namespace App\Events;

use App\Models\PetState;
use App\Services\PetService;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;

class PetUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public PetState $pet)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('pet-state');
    }

    public function broadcastAs(): string
    {
        return 'PetUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'points'      => $this->pet->points,
            'mood'        => app(PetService::class)::getMood($this->pet),
            'maxPoints'   => PetService::MAX_POINTS,
            'lastPatUser' => $this->pet->last_pat_user,
        ];
    }
}
