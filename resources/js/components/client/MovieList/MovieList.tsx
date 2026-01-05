import { useCinema } from '../../../context/CinemaContext';
import { MovieCard } from '../MovieCard/MovieCard';
import './MovieList.css';

export const MovieList: React.FC = () => {
  const { movies, selectedDate, loading, error } = useCinema();

  if (loading) {
    return (
      <div className="movie-list-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка расписания...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-list-error">
        <h3>Не удалось загрузить фильмы</h3>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    return (
      <div className="movie-list-empty">
        <h3>На {formattedDate} сеансов нет</h3>
        <p>Выберите другую дату или проверьте расписание позже</p>
      </div>
    );
  }

  return (
    <main className="movie-list">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </main>
  );
};