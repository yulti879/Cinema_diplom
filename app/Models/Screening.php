<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Screening extends Model
{
    protected $fillable = [
        'movie_id',
        'hall_id',
        'date',
        'start_time',        
        'booked_seats',
    ];

    // Автоматическая конвертация booked_seats между JSON и массивом
    protected $casts = [
        'booked_seats' => 'array',
        'date'         => 'date:Y-m-d',
        'start_time'   => 'string',
    ];
    
    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
    
    public function hall()
    {
        return $this->belongsTo(Hall::class, 'hall_id');
    }
}
