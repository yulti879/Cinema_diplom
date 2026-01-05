import { MoviePoster } from '../MoviePoster/MoviePoster';
import { MovieDescription } from '../MovieDescription/MovieDescription';
import { HallSchedule } from '../HallSchedule/HallSchedule';
import type { ClientMovie } from '../../../types/client';
import './MovieCard.css';

interface MovieCardProps {
  movie: ClientMovie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ч ${mins} мин`;
    }
    return `${mins} мин`;
  };

  return (
    <section className="movie">
      <div className="movie__info">
        <MoviePoster
          title={movie.title}
          poster={movie.posterUrl}
        />

        <MovieDescription
          title={movie.title}
          synopsis={movie.synopsis}
          duration={formatDuration(movie.duration)}
          origin={movie.origin}
        />
      </div>
      
      {/* Рендерим залы с расписанием */}
      {movie.halls.length > 0 ? (
        movie.halls.map((hall) => (
          <HallSchedule
            key={hall.id}
            hall={hall}
            movieTitle={movie.title}
          />
        ))
      ) : (
        <div className="movie-seances__hall">
          <h3 className="movie-seances__hall-title">Нет сеансов</h3>
          <p className="no-screenings">На выбранную дату сеансов нет</p>
        </div>
      )}
    </section>
  );
};