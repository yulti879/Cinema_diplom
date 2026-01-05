import { useState, useCallback } from 'react';
import type { Seat } from '../types/client';

interface UseSeatSelectionReturn {
  selectedSeats: string[];
  handleSeatClick: (rowIndex: number, seatIndex: number, seatType: Seat['type']) => void;
  clearSelection: () => void;
  getSelectedCount: () => number;
  isSeatSelected: (rowIndex: number, seatIndex: number) => boolean;
}

export const useSeatSelection = (maxSeats: number = 6): UseSeatSelectionReturn => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = useCallback((rowIndex: number, seatIndex: number, seatType: Seat['type']) => {
    // Игнорируем недоступные места
    if (seatType === 'taken') return;

    const seatId = `${rowIndex + 1}-${seatIndex + 1}`;

    setSelectedSeats(prev => {
      const isSelected = prev.includes(seatId);

      if (isSelected) {
        // Убираем из выбранных
        return prev.filter(id => id !== seatId);
      } else {
        // Проверка лимита
        if (prev.length >= maxSeats) {
          alert(`Можно выбрать не более ${maxSeats} мест`);
          return prev;
        }
        return [...prev, seatId];
      }
    });
  }, [maxSeats]);

  const clearSelection = useCallback(() => setSelectedSeats([]), []);

  const getSelectedCount = useCallback(() => selectedSeats.length, [selectedSeats]);

  const isSeatSelected = useCallback(
    (rowIndex: number, seatIndex: number) => selectedSeats.includes(`${rowIndex + 1}-${seatIndex + 1}`),
    [selectedSeats]
  );

  return {
    selectedSeats,
    handleSeatClick,
    clearSelection,
    getSelectedCount,
    isSeatSelected
  };
};