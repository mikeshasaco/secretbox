<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('visitor_key')->index();
            $table->timestamp('first_seen_at');
            $table->timestamp('last_seen_at');
            $table->integer('sessions_count')->default(0);
            $table->boolean('is_bot')->default(false);
            $table->string('timezone')->nullable();
            $table->integer('viewport_w')->nullable();
            $table->integer('viewport_h')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('first_utm')->nullable();
            $table->json('last_utm')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'is_bot']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
