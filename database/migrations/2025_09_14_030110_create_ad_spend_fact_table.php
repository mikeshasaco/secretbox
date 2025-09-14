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
        Schema::create('ad_spend_fact', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->date('date');
            $table->string('campaign_id');
            $table->string('adset_id');
            $table->string('ad_id');
            $table->integer('impressions')->default(0);
            $table->integer('clicks')->default(0);
            $table->decimal('spend', 12, 2)->default(0);
            $table->timestamps();
            
            $table->index(['date', 'platform']);
            $table->index(['campaign_id', 'adset_id', 'ad_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_spend_fact');
    }
};
