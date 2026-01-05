import { useState, useMemo } from 'react';
import { ConfigButton } from './ConfigButton/ConfigButton';
import { FormField } from './FormField/FormField';
import { Popup } from './Popup/Popup';

import type {
  AdminHall,
  AdminMovie,
  CreateScreeningDTO,
} from '../../types/admin';

interface AddScreeningPopupProps {
  isOpen: boolean;
  onClose: () => void;
  halls: AdminHall[];
  movies: AdminMovie[];
  hasConflict: (
    hallId: string,
    date: string,
    startTime: string,
    duration: number
  ) => boolean;
  onScreeningAdded: (screening: CreateScreeningDTO) => Promise<void>;
}

const todayISO = () => new Date().toISOString().split('T')[0];

// гарантируем HH:mm
const normalizeTime = (value: string): string => {
  if (!value) return value;
  return value.slice(0, 5);
};

export const AddScreeningPopup: React.FC<AddScreeningPopupProps> = ({
  isOpen,
  onClose,
  halls,
  movies,
  hasConflict,
  onScreeningAdded,
}) => {
  const [movieId, setMovieId] = useState('');
  const [hallId, setHallId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState('10:00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMovie = useMemo(
    () => movies.find(m => m.id === movieId),
    [movies, movieId]
  );

  /**
   * Проверка: выбран ли сеанс в прошлом
   */
  const isInPast = useMemo(() => {
    if (!date || !startTime) return false;

    const now = new Date();
    const selected = new Date(`${date}T${normalizeTime(startTime)}`);

    return selected < now;
  }, [date, startTime]);

  /**
   * Проверка пересечений
   */
  const conflict = useMemo(() => {
    if (!hallId || !selectedMovie) return false;

    return hasConflict(
      hallId,
      date,
      normalizeTime(startTime),
      selectedMovie.duration
    );
  }, [hallId, date, startTime, selectedMovie, hasConflict]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hallId || !movieId || !date || !startTime) {
      setError('Заполните все поля');
      return;
    }

    if (!selectedMovie) {
      setError('Фильм не найден');
      return;
    }

    if (isInPast) {
      setError('Нельзя создавать сеанс в прошлом');
      return;
    }

    if (conflict) {
      setError('В этом зале уже есть пересекающийся сеанс');
      return;
    }

    setIsLoading(true);

    try {
      const screening: CreateScreeningDTO = {
        movieId,
        hallId,
        date,
        startTime: normalizeTime(startTime), // строго HH:mm
      };

      await onScreeningAdded(screening);

      // сброс формы
      setMovieId('');
      setHallId('');
      setDate(todayISO());
      setStartTime('10:00');

      onClose();
    } catch (err: any) {
      // ожидаем 422 от бэкенда
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка при добавлении сеанса');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={handleCancel}
      title="Добавление сеанса"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              color: '#ff0000',
              marginBottom: '15px',
            }}
          >
            {error}
          </div>
        )}

        <FormField
          label="Зал"
          name="hall_id"
          type="select"
          value={hallId}
          onChange={e => setHallId(e.target.value)}
          options={halls.map(hall => ({
            value: hall.id,
            label: hall.name,
          }))}
          required
          disabled={isLoading}
        />

        <FormField
          label="Фильм"
          name="movie_id"
          type="select"
          value={movieId}
          onChange={e => setMovieId(e.target.value)}
          options={movies.map(movie => ({
            value: movie.id,
            label: movie.title,
          }))}
          required
          disabled={isLoading}
        />

        <FormField
          label="Дата"
          name="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          disabled={isLoading}
          min={todayISO()}
        />

        <FormField
          label="Время начала"
          name="start_time"
          type="time"
          value={startTime}
          onChange={e => setStartTime(normalizeTime(e.target.value))}
          required
          disabled={isLoading}
          step={60} // только минуты
        />

        {isInPast && (
          <div
            style={{
              marginTop: '10px',
              color: '#ff0000',
              fontSize: '14px',
            }}
          >
            Нельзя создавать сеанс в прошлом
          </div>
        )}

        {!isInPast && conflict && (
          <div
            style={{
              marginTop: '10px',
              color: '#ff9800',
              fontSize: '14px',
            }}
          >
            В этом зале уже есть пересекающийся сеанс
          </div>
        )}

        <div className="conf-step__buttons text-center">
          <ConfigButton
            variant="accent"
            type="submit"
            disabled={isLoading || conflict || isInPast}
            title={
              isInPast
                ? 'Нельзя создавать сеанс в прошлом'
                : conflict
                ? 'В этом зале уже есть пересекающийся сеанс'
                : ''
            }
          >
            {isLoading ? 'Добавление...' : 'Добавить сеанс'}
          </ConfigButton>

          <ConfigButton
            variant="regular"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отменить
          </ConfigButton>
        </div>
      </form>
    </Popup>
  );
};