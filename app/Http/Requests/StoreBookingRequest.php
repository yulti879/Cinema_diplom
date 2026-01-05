<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'screening_id' => 'required|integer|exists:screenings,id',
            
            // Массив выбранных мест
            'seats' => 'required|array|min:1',
            
            // Каждое место — объект с row, seat и type
            'seats.*.row'  => 'required|integer|min:1',
            'seats.*.seat' => 'required|integer|min:1',
            'seats.*.type' => 'required|in:standard,vip',
            
            // Email опционально
            'email' => 'nullable|email',
        ];
    }

    public function messages()
    {
        return [
            'seats.*.row.required'  => 'У каждого места должен быть указан ряд',
            'seats.*.seat.required' => 'У каждого места должен быть указан номер',
            'seats.*.type.required' => 'У каждого места должен быть указан тип (standard или vip)',
            'seats.*.type.in'       => 'Тип места должен быть либо "standard", либо "vip"',
            'email.email'            => 'Некорректный формат email',
        ];
    }
}