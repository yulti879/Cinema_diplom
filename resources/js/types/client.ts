// ========== БАЗОВЫЕ ТИПЫ ==========
export type SeatType = 'standard' | 'vip' | 'taken' | 'selected';

// ========== ОСНОВНЫЕ СУЩНОСТИ ==========
export interface Seat {
  type: SeatType;
  row: number;
  seat: number;
  price?: number;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  layout: Seat[][];
  totalSeats: number;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  synopsis: string;
  duration: number; // в минутах
  origin: string;
}

export interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  bookedSeats?: string[];
  movie?: Movie;
  hall?: Hall;
}

export interface Booking {
  id: string;
  screeningId: string;
  code: string;
  customerEmail?: string;
  seats: Seat[];
  totalPrice: number;
  expiresAt: string;
  isConfirmed: boolean;
  createdAt: string;
}

// ========== ТИПЫ ДЛЯ КОМПОНЕНТОВ ==========
export interface HallSchedule {
  id: string;
  name: string;
  times: string[];
  screeningIds: string[];
}

export interface ClientMovie {
  id: string;
  title: string;
  posterUrl?: string;
  synopsis: string;
  duration: number;
  origin: string;
  halls: HallSchedule[];
}

export interface Day {
  date: Date;
  day: string;
  number: number;
  today: boolean;
  chosen: boolean;
  weekend: boolean;
}

// ========== ТИПЫ ДЛЯ СТРАНИЦ ==========
export interface Payment {  
  screeningId: string;
  movieTitle: string;
  startTime: string;
  hallId: string;
  hallName: string;
  date: string;
  seats: Seat[];
  totalSeats: number;
  totalPrice?: number;
}

export interface Ticket {
  bookingCode: string;
  movieTitle: string;
  startTime: string;
  hallName: string;
  date: string;
  seats: string[]; // ["Ряд 1, Место 3", "Ряд 1, Место 4"]
  totalPrice?: number;
  qrCodeUrl?: string;
}

// DTO для данных с API
export interface ApiMovie {
  id: string | number;
  title: string;
  posterUrl?: string;
  synopsis: string;
  duration: number;
  origin: string;
}

export interface ApiScreening {
  id: string | number;
  movieId: string | number;
  hallId: string | number;
  date: string;      // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  hall?: { id: string | number; name: string };
}

// ========== DTO: отправка бронирования ==========

export interface BookingSeatDTO {
  row: number;
  seat: number;
}

export interface CreateBookingDTO {
  screening_id: string;
  seats: BookingSeatDTO[];
  total_price: number;
}