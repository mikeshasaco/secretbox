<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ApiKey extends Model
{
    protected $fillable = [
        'project_id',
        'name',
        'scope',
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
        
        static::creating(function ($apiKey) {
            if (empty($apiKey->secret_prefix)) {
                $apiKey->secret_prefix = Str::random(8);
            }
            if (empty($apiKey->secret_last4)) {
                $apiKey->secret_last4 = Str::random(4);
            }
            if (empty($apiKey->secret_hash)) {
                $apiKey->secret_hash = hash('sha256', Str::random(32));
            }
        });
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
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
