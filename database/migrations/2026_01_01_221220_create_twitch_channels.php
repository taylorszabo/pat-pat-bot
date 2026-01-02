<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('twitch_channels', function (Blueprint $table) {
            $table->id();
            $table->string('twitch_user_id');
            $table->string('twitch_channel_name');
            $table->string('display_name');
            $table->boolean('connected')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('twitch_channels');
    }
};
