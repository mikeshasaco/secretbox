<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'project_id',
        'session_id',
        'visitor_id',
        'event_type',
        'name',
        'url',
        'path',
        'selector',
        'scroll_pct',
        'x',
        'y',
        'meta',
        'created_at',
    ];

    protected $casts = [
        'scroll_pct' => 'decimal:2',
        'x' => 'integer',
        'y' => 'integer',
        'meta' => 'array',
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }
}
