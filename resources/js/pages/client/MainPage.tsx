import { ClientLayout } from '../../components/client/ClientLayout';
import { ClientHeader } from '../../components/client/ClientHeader/ClientHeader';
import { Navigation } from '../../components/client/Navigation/Navigation';
import { MovieList } from '../../components/client/MovieList/MovieList';

export const MainPage: React.FC = () => {
  return (
    <ClientLayout>
      <ClientHeader />
      <Navigation />
      <MovieList />
    </ClientLayout>
  );
};