<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'poster_url',
        'synopsis',
        'duration', // МИНУТЫ
        'origin',
    ];

    /**
     * Длительность фильма в минутах
     */
    public function durationInMinutes(): int
    {
        return (int) $this->duration;
    }
}