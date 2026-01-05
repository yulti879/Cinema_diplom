import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ClientMovie, HallSchedule, ApiMovie, ApiScreening } from '../types/client';

interface CinemaContextType {
  movies: ClientMovie[];
  selectedDate: Date;
  loading: boolean;
  error: string | null;
  setSelectedDate: (date: Date) => void;
}

const CinemaContext = createContext<CinemaContextType | null>(null);

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<ClientMovie[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Форматируем выбранную дату в YYYY-MM-DD
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        // Запрос к API
        const [moviesRes, screeningsRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/screenings'),
        ]);

        if (!moviesRes.ok || !screeningsRes.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const moviesData: ApiMovie[] = await moviesRes.json();
        const screeningsData: ApiScreening[] = await screeningsRes.json();

        // Фильтруем сеансы на выбранную дату (YYYY-MM-DD)
        const screeningsForDate = screeningsData.filter(
          s => s.date === dateString
        );


        // Создаём карту фильмов
        const moviesMap = new Map<string, ClientMovie>();
        const hallsMap = new Map<string, Map<string, HallSchedule>>();

        moviesData.forEach(movie => {
          moviesMap.set(movie.id.toString(), {
            id: movie.id.toString(),
            title: movie.title,
            posterUrl: movie.posterUrl,
            synopsis: movie.synopsis,
            duration: movie.duration,
            origin: movie.origin,
            halls: [],
          });
        });

        // Обрабатываем сеансы
        screeningsForDate.forEach(screening => {
          const movieId = screening.movieId.toString();
          const hallId = screening.hallId.toString();

          const movie = moviesMap.get(movieId);
          if (!movie) return;

          let movieHalls = hallsMap.get(movieId);
          if (!movieHalls) {
            movieHalls = new Map();
            hallsMap.set(movieId, movieHalls);
          }

          let hallSchedule = movieHalls.get(hallId);
          if (!hallSchedule) {
            hallSchedule = {
              id: hallId,
              name: screening.hall?.name || `Зал ${hallId}`,
              times: [],
              screeningIds: [],
            };
            movieHalls.set(hallId, hallSchedule);
          }

          hallSchedule.times.push(screening.startTime);
          hallSchedule.screeningIds.push(screening.id.toString());
        });

        // Формируем ClientMovie[]
        const resultMovies: ClientMovie[] = Array.from(moviesMap.values())
          .map(movie => {
            const movieHalls = hallsMap.get(movie.id);
            if (movieHalls) {
              movie.halls = Array.from(movieHalls.values())
                .map(hall => ({
                  ...hall,
                  times: hall.times.sort((a, b) => a.localeCompare(b)),
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
            }
            return movie;
          })
          .filter(movie => movie.halls.length > 0);

        setMovies(resultMovies);

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки расписания';
        console.error('Error loading cinema data:', err);
        setError(message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const contextValue: CinemaContextType = {
    movies,
    selectedDate,
    loading,
    error,
    setSelectedDate,
  };

  return (
    <CinemaContext.Provider value={contextValue}>
      {children}
    </CinemaContext.Provider>
  );
};

export const useCinema = () => {
  const ctx = useContext(CinemaContext);
  if (!ctx) throw new Error('useCinema must be used within CinemaProvider');
  return ctx;
};