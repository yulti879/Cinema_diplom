import React from 'react';
import { useCinema } from '../../../context/CinemaContext';
import { DAYS_SHORT } from '../../../utils/dateHelpers';
import type { Day } from '../../../types/client';
import './Navigation.css';


export const Navigation: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCinema();

  // Левый край окна (показываемых 7 дней)
  const today = new Date();
  const [windowStartDate, setWindowStartDate] = React.useState<Date>(today);

  // Генерация массива дней для окна
  const days: Day[] = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(windowStartDate);
      d.setDate(windowStartDate.getDate() + i);
      const dayOfWeek = d.getDay();
      return {
        date: d,
        day: DAYS_SHORT[dayOfWeek],
        number: d.getDate(),
        today: d.toDateString() === today.toDateString(),
        chosen: d.toDateString() === selectedDate.toDateString(),
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
      };
    });
  }, [windowStartDate, selectedDate]);

  // Проверяем, можем ли двигать окно назад
  const canGoBack = windowStartDate > today;

  // Сдвиг окна на offset недель
  const handleShiftWindow = (weeks: number) => {
    const newStart = new Date(windowStartDate);
    newStart.setDate(windowStartDate.getDate() + weeks * 7);

    // Не уходить за today
    if (newStart < today) {
      setWindowStartDate(today);
    } else {
      setWindowStartDate(newStart);
    }

    // Если выбранный день не в новом окне, сдвигаем выбор на первый день окна
    const windowEnd = new Date(newStart);
    windowEnd.setDate(newStart.getDate() + 6);
    if (selectedDate < newStart || selectedDate > windowEnd) {
      setSelectedDate(newStart);
    }
  };

  return (
    <nav className="page-nav">
      {canGoBack && (
        <button
          className="page-nav__day page-nav__day_prev"
          onClick={() => handleShiftWindow(-1)}
          aria-label="Предыдущие 7 дней"
          title="Предыдущие 7 дней"
        />
      )}

      {days.map(day => (
        <button
          key={day.date.toISOString()}
          className={[
            'page-nav__day',
            day.today && 'page-nav__day_today',
            day.chosen && 'page-nav__day_chosen',
            day.weekend && 'page-nav__day_weekend'
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setSelectedDate(day.date)}
          aria-current={day.chosen ? 'date' : undefined}
          aria-label={`${day.day} ${day.number}`}
          title={day.today ? 'Сегодня' : undefined}
        >
          <span className="page-nav__day-week">{day.day}</span>
          <span className="page-nav__day-number">{day.number}</span>
        </button>
      ))}

      <button
        className="page-nav__day page-nav__day_next"
        onClick={() => handleShiftWindow(1)}
        aria-label="Следующие 7 дней"
        title="Следующие 7 дней"
      />
    </nav>
  );
};