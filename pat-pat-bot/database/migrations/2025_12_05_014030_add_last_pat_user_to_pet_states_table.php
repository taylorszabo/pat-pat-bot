<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pet_states', function (Blueprint $table) {
            $table->string('last_pat_user')->nullable()->after('last_pat_at');
        });
    }

    public function down(): void
    {
        Schema::table('pet_states', function (Blueprint $table) {
            $table->dropColumn('last_pat_user');
        });
    }
};
