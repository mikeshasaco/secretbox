<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Session extends Model
{
    protected $table = 'tracking_sessions';

    protected $fillable = [
        'project_id',
        'visitor_id',
        'session_key',
        'started_at',
        'last_activity_at',
        'landing_url',
        'landing_referrer',
        'duration_seconds',
        'scroll_pct',
        'pcqs',
        'utm_source',
        'utm_medium',
        'utm_campaign_id',
        'utm_campaign_name',
        'utm_adset_id',
        'utm_adset_name',
        'utm_ad_id',
        'utm_ad_name',
        'utm_placement',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'duration_seconds' => 'integer',
        'scroll_pct' => 'decimal:2',
        'pcqs' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
