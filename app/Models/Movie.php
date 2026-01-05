<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'poster_url',
        'synopsis',
        'duration',
        'origin'
    ];
    
    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}