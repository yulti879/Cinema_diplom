import { useBodyClass } from '../../../hooks/useBodyClass';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useBodyClass('admin-body');

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};