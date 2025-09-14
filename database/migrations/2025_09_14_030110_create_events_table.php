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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('session_id')->constrained('tracking_sessions')->onDelete('cascade');
            $table->foreignId('visitor_id')->constrained('visitors')->onDelete('cascade');
            $table->string('event_type');
            $table->string('name');
            $table->text('url')->nullable();
            $table->string('path')->nullable();
            $table->string('selector')->nullable();
            $table->decimal('scroll_pct', 5, 2)->nullable();
            $table->integer('x')->nullable();
            $table->integer('y')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->index();
            
            $table->index(['project_id', 'session_id', 'event_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
