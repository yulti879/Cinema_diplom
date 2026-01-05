import { Link } from 'react-router-dom';
import { ClientLayout } from '../../components/client/ClientLayout';
import { ClientHeader } from '../../components/client/ClientHeader/ClientHeader';
import { ConfigButton } from '../../components/admin/ConfigButton/ConfigButton';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
  return (
    <ClientLayout>
      <ClientHeader />
      <main className="not-found">
        <div className="not-found__content">
          <div className="not-found__error-code">404</div>
          <h1 className="not-found__title">Страница не найдена</h1>
          <p className="not-found__message">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className="not-found__actions">
            <Link to="/">
              <ConfigButton variant="accent">
                Вернуться на главную
              </ConfigButton>
            </Link>
            <Link to="/admin" className="not-found__admin-link">
              Перейти в админку
            </Link>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
};