<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Screening;
use App\Http\Resources\ScreeningResource;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ScreeningController extends Controller
{
    // Список сеансов
    public function index(Request $request)
    {
        $query = Screening::with(['movie', 'hall']);

        if ($request->has('date')) {
            $query->where('date', $request->date);
        } else {
            $query->whereBetween(
                'date',
                [
                    now()->toDateString(),
                    now()->addDays(7)->toDateString(),
                ]
            );
        }

        $screenings = $query
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return ScreeningResource::collection($screenings);
    }

    // Один сеанс
    public function show($id)
    {
        $screening = Screening::with(['movie', 'hall'])->findOrFail($id);

        return new ScreeningResource($screening);
    }

    // Создание сеанса
    public function store(Request $request)
    {
        $data = $request->validate([
            'movie_id'   => ['required', 'exists:movies,id'],
            'hall_id'    => ['required', 'exists:halls,id'],
            'date'       => ['required', 'date_format:Y-m-d'],
            'start_time' => ['required', 'date_format:H:i'],
        ]);

        $movie = Movie::findOrFail($data['movie_id']);

        /**
         * Новый сеанс:
         * сначала дата, затем аккуратно выставляем время
         */
        $newStart = Carbon::parse($data['date'])
            ->setTimeFromTimeString($data['start_time']);

        $newEnd = (clone $newStart)
            ->addMinutes($movie->duration);

        /**
         * Нельзя создавать сеанс в прошлом
         */
        if ($newStart->lt(now())) {
            return response()->json([
                'message' => 'Нельзя создавать сеанс в прошлом',
            ], 422);
        }

        /**
         * Существующие сеансы в зале на эту дату
         */
        $existingScreenings = Screening::where('hall_id', $data['hall_id'])
            ->where('date', $data['date'])
            ->with('movie')
            ->get();

        foreach ($existingScreenings as $screening) {
            $existingStart = Carbon::parse($screening->date)
                ->setTimeFromTimeString($screening->start_time);

            $existingEnd = (clone $existingStart)
                ->addMinutes($screening->movie->duration);

            // Проверка пересечения
            if ($newStart < $existingEnd && $newEnd > $existingStart) {
                return response()->json([
                    'message' => 'В этом зале уже есть сеанс, пересекающийся по времени',
                ], 422);
            }
        }

        $screening = Screening::create([
            'movie_id'     => $data['movie_id'],
            'hall_id'      => $data['hall_id'],
            'date'         => $data['date'],       // Y-m-d
            'start_time'   => $data['start_time'], // HH:mm
            'booked_seats' => [],
        ]);

        return new ScreeningResource(
            $screening->load(['movie', 'hall'])
        );
    }

    // Удаление сеанса
    public function destroy($id)
    {
        $screening = Screening::findOrFail($id);
        $screening->delete();

        return response()->noContent();
    }
}