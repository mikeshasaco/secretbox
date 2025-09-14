<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_user_id',
        'name',
        'description',
        'website_url',
        'public_key',
        'secret_key',
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
                $project->public_key = $project->generateKey('pk_');
            }
            if (empty($project->secret_key)) {
                $project->secret_key = $project->generateKey('sk_');
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

    /**
     * Generate a new API key with the given prefix
     */
    public function generateKey(string $prefix): string
    {
        return $prefix . bin2hex(random_bytes(16));
    }

    /**
     * Rotate the API keys for this project
     */
    public function rotateKeys(): void
    {
        $this->update([
            'public_key' => $this->generateKey('pk_'),
            'secret_key' => $this->generateKey('sk_'),
            'last_rotated_at' => now(),
        ]);
    }

    /**
     * Get the masked secret key for display
     */
    public function getMaskedSecretKeyAttribute(): string
    {
        if (!$this->secret_key) {
            return 'Not set';
        }
        
        return substr($this->secret_key, 0, 8) . '...' . substr($this->secret_key, -4);
    }
}
