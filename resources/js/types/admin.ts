// ========== БАЗОВЫЕ ТИПЫ ==========

export type AdminSeatType = 'disabled' | 'standard' | 'vip';

// ========== ОСНОВНЫЕ СУЩНОСТИ ==========

export interface AdminBooking {
  id: string;
  screeningId: string;
  code: string;
  customerEmail?: string;
  seats: AdminSeat[];
  totalPrice: number;
  expiresAt: string;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminHall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  standardPrice?: number;
  vipPrice?: number;
  layout: AdminSeat[][];      // Схема мест
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminMovie {
  id: string;
  title: string;
  posterUrl?: string;
  synopsis: string;
  duration: number;      // в минутах
  origin: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminScreening {
  id: string;
  movieId: string;
  hallId: string;
  date: string;         // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  bookedSeats?: string[]; // ["1-1", "1-2"]
  movie?: AdminMovie;
  hall?: AdminHall;
}

// нормализация фильма
export const mapMovieFromBackend = (data: any): AdminMovie => ({
  id: data.id.toString(),
  title: data.title,
  posterUrl: data.posterUrl,
  synopsis: data.synopsis,
  duration: data.duration,
  origin: data.origin,
});

// нормализация сеанса
export const mapScreeningFromBackend = (data: any): AdminScreening => ({
  id: data.id.toString(),
  movieId: data.movieId.toString(),
  hallId: data.hallId.toString(),
  date: data.date,
  startTime: data.startTime,
  movie: data.movie ? mapMovieFromBackend(data.movie) : undefined,
  hall: data.hall ? { ...data.hall, id: data.hall.id.toString() } : undefined,
});

// ========== DTO ДЛЯ ФОРМ ==========

export interface AdminSeat {
  row: number;           // Номер ряда (начинается с 1)
  seat: number;          // Номер места в ряду (начинается с 1)
  type: AdminSeatType;
  isActive?: boolean;
}

export interface CreateMovieDTO {
  title: string;
  synopsis: string;
  duration: number;
  origin: string;
  poster?: File | null;
}

export interface CreateScreeningDTO {
  movieId: string;
  hallId: string;
  date: string;
  startTime: string;
}

export interface PriceData {
  hallId: string;
  hallName: string;
  standardPrice: number;
  vipPrice: number;
  timestamp: string;
}

// ========== DTO для API-запроса ==========

export interface UpdateHallPricesDTO {
  standard_price: number;
  vip_price: number;
}