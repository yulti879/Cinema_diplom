<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'rows' => $this->rows,
            'seatsPerRow' => $this->seats_per_row,
            'standardPrice' => $this->standard_price,
            'vipPrice' => $this->vip_price,
            'layout' => $this->layout ?? [],
            'totalSeats' => $this->rows * $this->seats_per_row,                                 
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}