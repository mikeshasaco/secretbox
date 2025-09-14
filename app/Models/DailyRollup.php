<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyRollup extends Model
{
    protected $fillable = [
        'project_id',
        'day',
        'visitors',
        'sessions',
        'bounces',
        'pageviews',
        'form_starts',
        'form_submits',
        'avg_session_duration_secs',
        'exits',
        'metrics',
        'top_paths',
        'top_ctas',
        'top_sources',
    ];

    protected $casts = [
        'day' => 'date',
        'visitors' => 'integer',
        'sessions' => 'integer',
        'bounces' => 'integer',
        'pageviews' => 'integer',
        'form_starts' => 'integer',
        'form_submits' => 'integer',
        'avg_session_duration_secs' => 'decimal:2',
        'exits' => 'integer',
        'metrics' => 'array',
        'top_paths' => 'array',
        'top_ctas' => 'array',
        'top_sources' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
