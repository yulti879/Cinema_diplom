<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ScreeningResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $date = $this->date instanceof Carbon
            ? $this->date
            : Carbon::createFromFormat('Y-m-d', $this->date);

        $time = substr($this->start_time, 0, 5); // HH:MM

        $dateTime = Carbon::createFromFormat(
            'Y-m-d H:i',
            "{$date->format('Y-m-d')} {$time}"
        );

        return [
            'id' => $this->id,
            'movieId' => $this->movie_id,
            'hallId' => $this->hall_id,
            'date' => $date->format('Y-m-d'),
            'startTime' => $time,
            'isPast' => $dateTime->isPast(),
            'bookedSeats' => $this->booked_seats ?? [],
            'movie' => $this->whenLoaded('movie', fn () => [
                'id' => $this->movie->id,
                'title' => $this->movie->title,
                'duration' => $this->movie->duration,
            ]),
            'hall' => $this->whenLoaded('hall', fn () => [
                'id' => $this->hall->id,
                'name' => $this->hall->name,
            ]),
        ];
    }
}