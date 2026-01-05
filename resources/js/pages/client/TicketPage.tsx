import { useLocation, useNavigate } from 'react-router-dom';
import type { Ticket } from '../../types/client';
import { ClientLayout } from '../../components/client/ClientLayout';
import { ClientHeader } from '../../components/client/ClientHeader/ClientHeader';
import { TicketLayout } from '../../components/client/TicketLayout/TicketLayout';
import { formatApiDate, formatApiTime } from '../../utils/dateHelpers';

export const TicketPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ticket = location.state as Ticket | null;

  if (!ticket || !Array.isArray(ticket.seats) || ticket.seats.length === 0) {
    return (
      <ClientLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Билет не найден</h2>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </ClientLayout>
    );
  }

  const displayDate = formatApiDate(ticket.date);
  const displayTime = formatApiTime(ticket.startTime);

  return (
    <ClientLayout>
      <ClientHeader />
      <TicketLayout
        type="ticket"
        movieTitle={ticket.movieTitle}
        seats={ticket.seats}
        hall={ticket.hallName}
        startTime={displayTime}
        date={displayDate}
        cost={ticket.totalPrice}
        qrCodeUrl={ticket.qrCodeUrl}
        bookingCode={ticket.bookingCode}
      />
    </ClientLayout>
  );
};