<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdSpendFact extends Model
{
    protected $table = 'ad_spend_fact';

    protected $fillable = [
        'platform',
        'date',
        'campaign_id',
        'adset_id',
        'ad_id',
        'impressions',
        'clicks',
        'spend',
    ];

    protected $casts = [
        'date' => 'date',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'spend' => 'decimal:2',
    ];

    public function adsDim(): BelongsTo
    {
        return $this->belongsTo(AdsDim::class, 'ad_id', 'ad_id');
    }
}
