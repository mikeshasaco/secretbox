<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visitor extends Model
{
    protected $fillable = [
        'project_id',
        'visitor_key',
        'first_seen_at',
        'last_seen_at',
        'sessions_count',
        'is_bot',
        'timezone',
        'viewport_w',
        'viewport_h',
        'user_agent',
        'first_utm',
        'last_utm',
    ];

    protected $casts = [
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'sessions_count' => 'integer',
        'is_bot' => 'boolean',
        'viewport_w' => 'integer',
        'viewport_h' => 'integer',
        'first_utm' => 'array',
        'last_utm' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
