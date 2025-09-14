<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'owner_user_id',
        'name',
        'public_key',
        'secret_prefix',
        'secret_last4',
        'secret_hash',
        'is_active',
        'last_used_at',
        'last_rotated_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
        'last_rotated_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($project) {
            if (empty($project->public_key)) {
                $project->public_key = 'pk_' . Str::random(32);
            }
            if (empty($project->secret_prefix)) {
                $project->secret_prefix = Str::random(8);
            }
            if (empty($project->secret_last4)) {
                $project->secret_last4 = Str::random(4);
            }
            if (empty($project->secret_hash)) {
                $project->secret_hash = hash('sha256', Str::random(32));
            }
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function apiKeys(): HasMany
    {
        return $this->hasMany(ApiKey::class);
    }

    public function visitors(): HasMany
    {
        return $this->hasMany(Visitor::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function dailyRollups(): HasMany
    {
        return $this->hasMany(DailyRollup::class);
    }

    public function rotateKeys(): void
    {
        $this->update([
            'secret_prefix' => Str::random(8),
            'secret_last4' => Str::random(4),
            'secret_hash' => hash('sha256', Str::random(32)),
            'last_rotated_at' => now(),
        ]);
    }
}
