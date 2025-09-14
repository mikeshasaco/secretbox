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
        Schema::table('projects', function (Blueprint $table) {
            // Add missing columns
            $table->text('description')->nullable()->after('name');
            $table->string('website_url')->nullable()->after('description');
            $table->string('secret_key')->after('public_key');
            
            // Drop old columns that are being replaced
            $table->dropColumn(['secret_prefix', 'secret_last4', 'secret_hash']);
        });

        // Add indexes for project_id columns
        Schema::table('events', function (Blueprint $table) {
            $table->index('project_id', 'idx_events_project_id');
        });

        Schema::table('tracking_sessions', function (Blueprint $table) {
            $table->index('project_id', 'idx_sessions_project_id');
        });

        Schema::table('visitors', function (Blueprint $table) {
            $table->index('project_id', 'idx_visitors_project_id');
        });

        // Add project_id to ads tables if they don't have it
        if (!Schema::hasColumn('ads_dim', 'project_id')) {
            Schema::table('ads_dim', function (Blueprint $table) {
                $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('cascade');
                $table->index('project_id', 'idx_ads_dim_project_id');
            });
        }

        if (!Schema::hasColumn('ad_spend_fact', 'project_id')) {
            Schema::table('ad_spend_fact', function (Blueprint $table) {
                $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('cascade');
                $table->index('project_id', 'idx_ad_spend_fact_project_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Restore old columns
            $table->string('secret_prefix', 8)->after('public_key');
            $table->string('secret_last4', 4)->after('secret_prefix');
            $table->string('secret_hash')->after('secret_last4');
            
            // Drop new columns
            $table->dropColumn(['description', 'website_url', 'secret_key']);
        });

        // Drop indexes
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('idx_events_project_id');
        });

        Schema::table('tracking_sessions', function (Blueprint $table) {
            $table->dropIndex('idx_sessions_project_id');
        });

        Schema::table('visitors', function (Blueprint $table) {
            $table->dropIndex('idx_visitors_project_id');
        });

        // Drop project_id from ads tables if they exist
        if (Schema::hasColumn('ads_dim', 'project_id')) {
            Schema::table('ads_dim', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
                $table->dropIndex('idx_ads_dim_project_id');
                $table->dropColumn('project_id');
            });
        }

        if (Schema::hasColumn('ad_spend_fact', 'project_id')) {
            Schema::table('ad_spend_fact', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
                $table->dropIndex('idx_ad_spend_fact_project_id');
                $table->dropColumn('project_id');
            });
        }
    }
};