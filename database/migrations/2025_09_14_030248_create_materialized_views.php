<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create materialized view for creative daily engagement
        DB::statement('
            CREATE MATERIALIZED VIEW creative_daily_engagement AS
            SELECT 
                utm_ad_id as ad_id,
                DATE(started_at) as day,
                COUNT(*) as sessions,
                AVG(duration_seconds) as avg_time,
                AVG(scroll_pct) as avg_scroll,
                AVG(pcqs) as avg_pcqs
            FROM tracking_sessions 
            WHERE utm_ad_id IS NOT NULL
            GROUP BY utm_ad_id, DATE(started_at)
        ');
        
        // Create index on the materialized view
        DB::statement('CREATE INDEX creative_daily_engagement_ad_id_day ON creative_daily_engagement (ad_id, day)');
        
        // Create view for CPEV by day
        DB::statement('
            CREATE VIEW cpev_by_day AS
            SELECT 
                cde.ad_id,
                cde.day,
                cde.sessions as engaged_sessions,
                COALESCE(asp.spend, 0) as spend,
                CASE 
                    WHEN cde.sessions > 0 THEN COALESCE(asp.spend, 0) / cde.sessions 
                    ELSE 0 
                END as cpev
            FROM creative_daily_engagement cde
            LEFT JOIN ad_spend_fact asp ON cde.ad_id = asp.ad_id AND cde.day = asp.date
            WHERE cde.sessions >= 1
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS cpev_by_day');
        DB::statement('DROP MATERIALIZED VIEW IF EXISTS creative_daily_engagement');
    }
};
