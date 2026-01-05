<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeController extends Controller
{
    public function generateBookingQr($bookingCode)
    {
        $booking = Booking::with(['screening.movie', 'screening.hall'])
            ->where('booking_code', $bookingCode)
            ->first();

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

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