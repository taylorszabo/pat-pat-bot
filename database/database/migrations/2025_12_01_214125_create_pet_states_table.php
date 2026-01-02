<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pet_states', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('stream_pet');
            $table->unsignedInteger('points')->default(100); // neutral baseline
            $table->timestamp('last_pat_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_states');
    }
};
