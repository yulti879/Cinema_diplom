import { useBodyClass } from '../../hooks/useBodyClass';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useBodyClass('client-body');
  
  return (
    <div className="client-layout">
      {children}
    </div>
  );
};