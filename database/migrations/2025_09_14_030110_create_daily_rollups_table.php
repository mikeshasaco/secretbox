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
        Schema::create('daily_rollups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->date('day');
            $table->integer('visitors')->default(0);
            $table->integer('sessions')->default(0);
            $table->integer('bounces')->default(0);
            $table->integer('pageviews')->default(0);
            $table->integer('form_starts')->default(0);
            $table->integer('form_submits')->default(0);
            $table->decimal('avg_session_duration_secs', 10, 2)->nullable();
            $table->integer('exits')->default(0);
            $table->json('metrics')->nullable();
            $table->json('top_paths')->nullable();
            $table->json('top_ctas')->nullable();
            $table->json('top_sources')->nullable();
            $table->timestamps();
            
            $table->unique(['project_id', 'day']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_rollups');
    }
};
