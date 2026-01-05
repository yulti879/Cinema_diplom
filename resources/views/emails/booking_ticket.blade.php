<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ваш билет</title>
</head>
<body>
    <h2>Ваш билет на фильм: {{ $booking->screening->movie->title }}</h2>
    <p>Дата: {{ $booking->screening->date }}</p>
    <p>Начало сеанса: {{ $booking->screening->start_time }}</p>
    <p>Зал: {{ $booking->screening->hall->name }}</p>
    <p>Места: 
        @foreach($booking->seats as $seat)
            Ряд {{ $seat['row'] }}, Место {{ $seat['seat'] }}@if(!$loop->last), @endif
        @endforeach
    </p>
    <p>Код бронирования: {{ $booking->booking_code }}</p>
    <p>Стоимость: {{ $booking->total_price }} рублей</p>

    <div>
        <p>QR-код для контроля:</p>
        <img src="{{ $qrCodeUrl }}" alt="QR код билета">
    </div>

    <p>Приятного просмотра!</p>
</body>
</html>