<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hall extends Model
{
    protected $fillable = [
        'name',
        'rows',
        'seats_per_row',
        'standard_price',
        'vip_price', 
        'layout',
    ];

    protected $casts = [
        'layout' => 'array',
    ];

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class, 'hall_id');
    }    
}