import { ClientLayout } from '../../components/client/ClientLayout';
import { ClientHeader } from '../../components/client/ClientHeader/ClientHeader';
import { Hall } from '../../components/client/Hall/Hall';

export const HallPage: React.FC = () => {
  return (
    <ClientLayout>
      <ClientHeader />
      <Hall />
    </ClientLayout>
  );
};