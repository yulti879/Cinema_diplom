import { useCallback } from 'react';
import type { Seat } from '../types/client';

interface UseSeatCalculationsReturn {
  calculateTotalPrice: (seats: Seat[][], selectedSeats: string[]) => number;
  getSelectedSeatsInfo: (seats: Seat[][], selectedSeats: string[]) => string[];
}

export const useSeatCalculations = (): UseSeatCalculationsReturn => {
  // Суммируем стоимость выбранных мест
  const calculateTotalPrice = useCallback((seats: Seat[][], selectedSeats: string[]): number => {
    return selectedSeats.reduce((total, seatId) => {
      const [rowStr, seatStr] = seatId.split('-');
      const row = parseInt(rowStr, 10) - 1;
      const seat = parseInt(seatStr, 10) - 1;

      const seatObj = seats[row]?.[seat];
      return seatObj ? total + (seatObj.price || 0) : total;
    }, 0);
  }, []);

  // Форматируем выбранные места для отображения
  const getSelectedSeatsInfo = useCallback((seats: Seat[][], selectedSeats: string[]): string[] => {
    return selectedSeats.map(seatId => {
      const [rowStr, seatStr] = seatId.split('-');
      const row = parseInt(rowStr, 10) - 1;
      const seat = parseInt(seatStr, 10) - 1;

      const seatObj = seats[row]?.[seat];
      const seatType = seatObj?.type === 'vip' ? 'VIP' : 'Стандарт';
      return `Ряд ${row + 1}, Место ${seat + 1} (${seatType})`;
    });
  }, []);

  return {
    calculateTotalPrice,
    getSelectedSeatsInfo
  };
};