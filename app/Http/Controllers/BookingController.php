<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Mail\BookingTicketMail;
use App\Models\Booking;
use App\Models\Screening;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request)
    {
        $data = $request->validated();
        $screening = Screening::with('hall', 'movie')->findOrFail($data['screening_id']);

        $screeningDateOnly = Carbon::parse($screening->date)->format('Y-m-d');
        $screeningDateTime = Carbon::parse($screeningDateOnly . ' ' . $screening->start_time);

        if ($screeningDateTime->isPast()) {
            return response()->json(['message' => 'Сеанс уже завершён'], 422);
        }

        // Проверяем, что места свободны
        $bookedSeats = $screening->booked_seats ?? [];
        foreach ($data['seats'] as $seat) {
            $seatKey = "{$seat['row']}-{$seat['seat']}";
            if (in_array($seatKey, $bookedSeats, true)) {
                return response()->json(['error' => "Место {$seatKey} уже забронировано"], 422);
            }
        }

        // Считаем стоимость
        $totalPrice = 0;
        foreach ($data['seats'] as $seat) {
            $totalPrice += $seat['type'] === 'vip'
                ? $screening->hall->vip_price
                : $screening->hall->standard_price;
        }

        // Создаём бронирование
        $bookingCode = 'BK' . strtoupper(Str::random(6));
        $booking = Booking::create([
            'screening_id' => $screening->id,
            'seats'        => $data['seats'],
            'total_price'  => $totalPrice,
            'booking_code' => $bookingCode,
            'email'        => $data['email'] ?? null,
        ]);

        // Обновляем список занятых мест
        $newBookedSeats = array_map(fn($s) => "{$s['row']}-{$s['seat']}", $data['seats']);
        $screening->booked_seats = array_merge($bookedSeats, $newBookedSeats);
        $screening->save();

        $qrCodeUrl = route('bookings.qr', $bookingCode);

        // Отправка email при наличии
        if (!empty($data['email'])) {
            Mail::to($data['email'])->send(new BookingTicketMail($booking, $qrCodeUrl));
        }

        return response()->json([
            'booking_code' => $bookingCode,
            'qr_code_url'  => $qrCodeUrl,
        ], 201);
    }

    /**
     * Генерация QR-кода для бронирования
     */
    public function qr($bookingCode)
    {
        $booking = Booking::with(['screening.movie', 'screening.hall'])
            ->where('booking_code', $bookingCode)
            ->firstOrFail();

        $qrData = [
            'booking_code' => $booking->booking_code,
            'screening_id' => $booking->screening_id,
            'movie' => $booking->screening->movie->title,
            'hall' => $booking->screening->hall->name,
            'date' => $booking->screening->date,
            'start_time' => $booking->screening->start_time,
            'seats' => $booking->seats,
            'total_price' => $booking->total_price,
            'timestamp' => now()->toISOString(),
        ];

        $qrCodeSvg = QrCode::size(250)
            ->style('square')
            ->eye('square')
            ->color(0, 0, 0)
            ->backgroundColor(255, 255, 255)
            ->generate(json_encode($qrData));

        return response($qrCodeSvg)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}