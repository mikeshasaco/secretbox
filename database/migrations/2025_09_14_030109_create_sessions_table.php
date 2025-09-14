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
        Schema::create('tracking_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('visitor_id')->constrained('visitors')->onDelete('cascade');
            $table->string('session_key')->index();
            $table->timestamp('started_at')->index();
            $table->timestamp('last_activity_at')->index();
            $table->text('landing_url')->nullable();
            $table->text('landing_referrer')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->decimal('scroll_pct', 5, 2)->nullable();
            $table->decimal('pcqs', 5, 2)->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign_id')->nullable();
            $table->string('utm_campaign_name')->nullable();
            $table->string('utm_adset_id')->nullable();
            $table->string('utm_adset_name')->nullable();
            $table->string('utm_ad_id')->index();
            $table->string('utm_ad_name')->nullable();
            $table->string('utm_placement')->nullable();
            $table->timestamps();
            
            $table->index(['utm_source', 'utm_campaign_id', 'utm_adset_id', 'utm_ad_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_sessions');
    }
};
