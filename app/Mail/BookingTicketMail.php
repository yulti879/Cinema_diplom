<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;
    public string $qrCodeUrl;

    public function __construct(Booking $booking, string $qrCodeUrl)
    {
        $this->booking = $booking;
        $this->qrCodeUrl = $qrCodeUrl;
    }

    public function build()
    {
        return $this->subject('Ваш билет на кино')
            ->view('emails.booking_ticket')
            ->with([
                'booking' => $this->booking,
                'qrCodeUrl' => $this->qrCodeUrl,
            ]);
    }
}