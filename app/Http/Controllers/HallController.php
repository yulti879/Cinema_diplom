<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Http\Resources\HallResource;
use Illuminate\Http\Request;

class HallController extends Controller
{
    // Список всех залов
    public function index()
    {
        $halls = Hall::orderBy('name')->get();
        return HallResource::collection($halls);
    }

    // Конкретный зал
    public function show($id)
    {
        $hall = Hall::findOrFail($id);
        return new HallResource($hall);
    }

    // Создание нового зала
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:halls,name'],
            'rows' => ['required', 'integer', 'min:1', 'max:20'],
            'seats_per_row' => ['required', 'integer', 'min:1', 'max:20'],
            'standard_price' => ['required', 'integer', 'min:0'],
            'vip_price' => ['required', 'integer', 'min:0'],
        ]);

        $hall = Hall::create([
            'name' => $data['name'],
            'rows' => $data['rows'],
            'seats_per_row' => $data['seats_per_row'],
            'standard_price' => $data['standard_price'],
            'vip_price' => $data['vip_price'],
            'layout' => $this->generateDefaultLayout($data['rows'], $data['seats_per_row']),
        ]);

        return new HallResource($hall);
    }

    // Обновление зала
    public function update(Request $request, $id)
    {
        $hall = Hall::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', "unique:halls,name,{$id}"],
            'rows' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'seats_per_row' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'layout' => ['nullable', 'array'],
            'standard_price' => ['sometimes', 'integer', 'min:0'],
            'vip_price' => ['sometimes', 'integer', 'min:0'],
        ]);

        $hall->update([
            'name' => $data['name'] ?? $hall->name,
            'rows' => $data['rows'] ?? $hall->rows,
            'seats_per_row' => $data['seats_per_row'] ?? $hall->seats_per_row,
            'layout' => $data['layout'] ?? $hall->layout,
            'standard_price' => $data['standard_price'] ?? $hall->standard_price,
            'vip_price' => $data['vip_price'] ?? $hall->vip_price,
        ]);

        return response()->json([
            'message' => 'Зал успешно обновлен',
            'data' => new HallResource($hall)
        ]);
    }

    // Удаление зала
    public function destroy($id)
    {
        $hall = Hall::findOrFail($id);
        $hall->delete();
    }

    // Генерация схемы по умолчанию - все места обычные
    private function generateDefaultLayout(int $rows, int $seatsPerRow): array
    {
        $layout = [];

        for ($row = 1; $row <= $rows; $row++) {
            $rowSeats = [];
            for ($seat = 1; $seat <= $seatsPerRow; $seat++) {
                $rowSeats[] = [
                    'row' => $row,
                    'seat' => $seat,
                    'type' => 'standard', // 'standard', 'vip', 'disabled'
                ];
            }
            $layout[] = $rowSeats;
        }

        return $layout;
    }
}
