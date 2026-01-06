import { useState } from 'react';
import { formatApiDate, formatApiTime } from '../../../utils/dateHelpers';
import './TicketLayout.css';

interface TicketLayoutProps {
  type: 'payment' | 'ticket';
  movieTitle: string;
  seats: string[];
  hall: string;
  startTime: string;
  date: string;
  cost?: number;
  qrCodeUrl?: string;
  bookingCode?: string;
  onGetTicket?: (email?: string) => void; // теперь можем передавать email
  isButtonDisabled?: boolean;
}

export const TicketLayout: React.FC<TicketLayoutProps> = ({
  type,
  movieTitle,
  seats,
  hall,
  startTime,
  date,
  cost,
  qrCodeUrl,
  bookingCode,
  onGetTicket,
  isButtonDisabled = false
}) => {
  const seatList = seats.join(', ');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGetTicket) onGetTicket(email || undefined);
  };

  return (
    <main>
      <section className="ticket">
        <header className="ticket__check">
          <h2 className="ticket__check-title">
            {type === 'payment' ? 'Вы выбрали билеты:' : 'Электронный билет'}
          </h2>
        </header>

        <div className="ticket__info-wrapper">
          <p className="ticket__info">
            На фильм: <span className="ticket__details ticket__title">{movieTitle}</span>
          </p>
          <p className="ticket__info">
            Дата: <span className="ticket__details ticket__date">{date}</span>
          </p>
          <p className="ticket__info">
            Начало сеанса:{' '}
            <span className="ticket__details ticket__start">{startTime}</span>
          </p>
          <p className="ticket__info">
            Зал: <span className="ticket__details ticket__hall">{hall}</span>
          </p>
          <p className="ticket__info">
            Места: <span className="ticket__details ticket__chairs">{seatList}</span>
          </p>

          {bookingCode && (
            <p className="ticket__info">
              Код брони: <span className="ticket__details ticket__code">{bookingCode}</span>
            </p>
          )}

          {type === 'payment' && cost !== undefined && (
            <p className="ticket__info">
              Стоимость: <span className="ticket__details ticket__cost">{cost}</span> рублей
            </p>
          )}

          {type === 'ticket' && qrCodeUrl && (
            <div className="ticket__info-qr-container">
              <img
                className="ticket__info-qr"
                src={qrCodeUrl}
                alt="QR код билета"
              />
            </div>
          )}

          {type === 'payment' && (
            <form onSubmit={handleSubmit} className="email-form">
              <label>
                <p className="ticket__hint">Введите адрес вашей электронной почты, если хотите, чтобы на неё пришёл билет:</p>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@mail.com"                  
                />
              </label>

              <button
                type="submit"
                className="accept-button"
                disabled={isButtonDisabled}                
              >
                {isButtonDisabled ? 'Обработка...' : 'Получить код бронирования'}
              </button>
              <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контролёру у входа в зал.</p>
            </form>
          )}

          {type === 'ticket' && (
            <p className="ticket__hint">
              Покажите QR-код нашему контролёру для подтверждения бронирования.
            </p>
          )}

          <p className="ticket__hint">Приятного просмотра!</p>
        </div>
      </section>
    </main>
  );
};