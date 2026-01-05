import './AdminHeader.css';

interface AdminHeaderProps {
    onLogout?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="page-header">
      <div className="page-header__content">
        <div className="page-header__titles">
          <h1 className="page-header__title">Идём<span>в</span>кино</h1>
          <span className="page-header__subtitle">Администраторррская</span>
        </div>
        {onLogout && (
          <button 
            className="page-header__logout"
            onClick={onLogout}
            title="Выйти из админки"
          >
            Выйти
          </button>
        )}
      </div>
    </header>
  );
};