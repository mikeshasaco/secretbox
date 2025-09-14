<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdsDim extends Model
{
    protected $table = 'ads_dim';
    protected $primaryKey = 'ad_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ad_id',
        'platform',
        'campaign_id',
        'campaign_name',
        'adset_id',
        'adset_name',
        'ad_name',
        'placement',
        'first_seen_at',
        'last_seen_at',
    ];

    protected $casts = [
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
    ];

    public function adSpendFacts(): HasMany
    {
        return $this->hasMany(AdSpendFact::class, 'ad_id', 'ad_id');
    }
}
