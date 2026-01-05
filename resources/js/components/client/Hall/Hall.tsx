import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Seat, Screening } from '../../../types/client';
import { formatApiDate, formatApiTime } from '../../../utils/dateHelpers';
import './Hall.css';

export const Hall: React.FC = () => {
  const { screeningId } = useParams<{ screeningId: string }>();
  const navigate = useNavigate();

  const [hallLayout, setHallLayout] = useState<Seat[][]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [seatPrices, setSeatPrices] = useState<{ standard: number; vip: number }>({ standard: 0, vip: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!screeningId) {
        setError('ID сеанса не указан');
        return;
      }

      try {
        setIsLoading(true);

        // получаем сеанс
        const screeningRes = await fetch(`/api/screenings/${screeningId}`);
        if (!screeningRes.ok) throw new Error('Сеанс не найден');
        const screeningData: Screening = await screeningRes.json();
        setScreening(screeningData);
        setBookedSeats(screeningData.bookedSeats || []);

        // получаем зал
        const hallRes = await fetch(`/api/halls/${screeningData.hallId}`);
        if (!hallRes.ok) throw new Error('Зал не найден');
        const hallData = await hallRes.json();

        setHallLayout(hallData.layout);
        setSeatPrices({
          standard: hallData.standardPrice ?? 0,
          vip: hallData.vipPrice ?? 0
        });

        // сохраняем имя зала в screening для удобства (не обязательно)
        setScreening(prev => prev ? { ...prev, hall: { ...hallData } } : prev);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [screeningId]);

  // Клик по месту
  const handleSeatClick = (rowIndex: number, seatIndex: number, seatType: Seat['type']) => {
    if (seatType === 'taken') return;

    const seat: Seat = {
      type: seatType,
      row: rowIndex + 1,
      seat: seatIndex + 1
    };

    const seatId = `${seat.row}-${seat.seat}`;
    const isAlreadySelected = selectedSeats.some(s => `${s.row}-${s.seat}` === seatId);

    if (isAlreadySelected) {
      setSelectedSeats(prev => prev.filter(s => `${s.row}-${s.seat}` !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        alert('Можно выбрать не более 6 мест');
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const getSeatDisplayType = (rowIndex: number, seatIndex: number, baseType: Seat['type']): Seat['type'] => {
    const seatId = `${rowIndex + 1}-${seatIndex + 1}`;
    if (bookedSeats.includes(seatId) || baseType === 'taken') return 'taken';
    if (selectedSeats.some(s => `${s.row}-${s.seat}` === seatId)) return 'selected';
    return baseType;
  };

  const handleBooking = () => {
    if (!screening) {
      alert('Данные сеанса не загружены');
      return;
    }
    if (selectedSeats.length === 0) {
      alert('Выберите хотя бы одно место');
      return;
    }
   
    const hallName = screening.hall?.name ?? 'Зал';

    navigate('/payment', {
      state: {
        screeningId: screening.id,
        hallId: screening.hallId,
        hallName,
        movieTitle: screening.movie?.title,
        date: screening.date,
        startTime: screening.startTime,
        seats: selectedSeats,
        totalSeats: selectedSeats.length,
      }
    });
  };

  if (error) {
    return (
      <main>
        <section className="buying">
          <div className="error-message">{error}</div>
        </section>
      </main>
    );
  }

  if (isLoading || !screening) {
    return (
      <main>
        <section className="buying">
          <div className="loading">Загрузка...</div>
        </section>
      </main>
    );
  }

  const formattedDate = formatApiDate(screening.date);
  const formattedStartTime = formatApiTime(screening.startTime);

  return (
    <main>
      <section className="buying">
        <div className="buying__info">
          <div className="buying__info-description">
            <h2 className="buying__info-title">{screening.movie?.title || 'Фильм'}</h2>
            <p className="buying__info-start">Начало сеанса: {formattedStartTime}</p>
            <p className="buying__info-hall">{screening.hall?.name || 'Зал'}</p>
            <p className="buying__info-date">Дата: {formattedDate}</p>
          </div>
          <div className="buying__info-hint">
            <p>Тапните дважды,<br />чтобы увеличить</p>
          </div>
        </div>

        <div className="buying-scheme">
          <div className="buying-scheme__wrapper">
            {hallLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="buying-scheme__row">
                {row.map((seat, seatIndex) => {
                  const displayType = getSeatDisplayType(rowIndex, seatIndex, seat.type);
                  return (
                    <span
                      key={seatIndex}
                      className={`buying-scheme__chair buying-scheme__chair_${displayType}`}
                      onClick={() => handleSeatClick(rowIndex, seatIndex, seat.type)}
                      title={`Ряд ${rowIndex + 1}, Место ${seatIndex + 1}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="buying-scheme__legend">
            <div className="col">
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_standard"></span>
                Свободно (<span className="buying-scheme__legend-value">{seatPrices.standard}</span>руб)
              </p>
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_vip"></span>
                Свободно VIP (<span className="buying-scheme__legend-value">{seatPrices.vip}</span>руб)
              </p>
            </div>
            <div className="col">
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято
              </p>
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано
              </p>
            </div>
          </div>
        </div>

        <button
          className="accept-button"
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}
        >
          {`Забронировать (${selectedSeats.length})`}
        </button>
      </section>
    </main>
  );
};