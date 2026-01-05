import { Link } from 'react-router-dom';
import { useCinema } from '../../../context/CinemaContext';
import type { HallSchedule as HallScheduleType } from '../../../types/client';
import './HallSchedule.css';

interface HallScheduleProps {
  hall: HallScheduleType;
  movieTitle: string;
}

export const HallSchedule: React.FC<HallScheduleProps> = ({
  hall,
  movieTitle
}) => {
  const { selectedDate } = useCinema();
  const now = new Date();

  const formatDate = (date: Date) =>
    date
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      .replace(/\./g, '-');

  return (
    <div className="movie-seances__hall">
      <h3 className="movie-seances__hall-title">{hall.name}</h3>

      <ul className="movie-seances__list">
        {hall.times.map((time, index) => {
          const screeningId = hall.screeningIds[index];

          // Дата + время сеанса
          const [hours, minutes] = time.split(':').map(Number);
          const screeningDateTime = new Date(selectedDate);
          screeningDateTime.setHours(hours, minutes, 0, 0);

          const isPastScreening = screeningDateTime < now;

          const linkState = {
            movieTitle,
            startTime: time,
            hallName: hall.name,
            screeningId,
            date: formatDate(selectedDate),
            hallId: hall.id
          };

          return (
            <li
              key={screeningId}
              className="movie-seances__time-block"
            >
              {isPastScreening ? (
                <span
                  className="movie-seances__time movie-seances__time--past"
                  title="Сеанс уже начался"
                >
                  {time}
                </span>
              ) : (
                <Link
                  className="movie-seances__time"
                  to={`/hall/${screeningId}`}
                  state={linkState}
                >
                  {time}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};