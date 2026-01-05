import { useCinema } from '../../../context/CinemaContext';
import { getMondayOfWeek, generateWeekDays, isSameDay } from '../../../utils/dateHelpers';
import type { Day } from '../../../types/client';

import './Navigation.css';

export const Navigation: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCinema();

  const days: Day[] = generateWeekDays(selectedDate);

  // Проверяем, можем ли идти назад (не раньше сегодняшней недели)
  const canGoBack = () => {
    const today = new Date();
    const currentMonday = getMondayOfWeek(today);
    const selectedMonday = getMondayOfWeek(selectedDate);
    
    return selectedMonday.getTime() > currentMonday.getTime();
  };

  const handleChangeWeek = (offset: number) => {
    const monday = getMondayOfWeek(selectedDate);
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + offset * 7);
    
    // Устанавливаем на понедельник новой недели
    setSelectedDate(nextMonday);
  };

  return (
    <nav className="page-nav">
      {canGoBack() && (
        <button
          className="page-nav__day page-nav__day_prev"
          onClick={() => handleChangeWeek(-1)}
          aria-label="Предыдущая неделя"
          title="Предыдущая неделя"
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
        onClick={() => handleChangeWeek(1)}
        aria-label="Следующая неделя"
        title="Следующая неделя"
      />
    </nav>
  );
};