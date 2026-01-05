import { useState, useEffect } from 'react';
import axios from 'axios';
import { ConfigSection } from '../ConfigSection/ConfigSection';
import { ConfigButton } from '../ConfigButton/ConfigButton';
import { Popup } from '../Popup/Popup';
import { DeleteForm } from '../DeleteForm/DeleteForm';

interface SalesControlProps {
  isOpen: boolean;
  onToggle: () => void;
  onSalesToggle: (salesOpen: boolean) => void;
}

export const SalesControl: React.FC<SalesControlProps> = ({
  isOpen,
  onToggle,
  onSalesToggle
}) => {
  const [salesOpen, setSalesOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Получаем текущее состояние продаж с сервера
  useEffect(() => {
    const fetchSalesState = async () => {
      setError(null);
      try {
        const res = await axios.get('/api/sales');
        setSalesOpen(res.data.open);
        onSalesToggle(res.data.open); // синхронизация с родителем
      } catch (err: any) {
        console.error('Ошибка загрузки состояния продаж', err);
        setError('Не удалось загрузить состояние продаж');
      }
    };
    fetchSalesState();
  }, [onSalesToggle]);

  const handleToggleSales = async () => {
    if (!salesOpen) {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.post('/api/sales', { open: true });
        setSalesOpen(res.data.open);
        onSalesToggle(res.data.open);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (err: any) {
        console.error('Ошибка при открытии продаж', err);
        setError('Не удалось открыть продажу билетов');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsConfirmPopupOpen(true);
    }
  };

  const confirmStopSales = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/sales', { open: false });
      setSalesOpen(res.data.open);
      onSalesToggle(res.data.open);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error('Ошибка при приостановке продаж', err);
      setError('Не удалось приостановить продажу билетов');
    } finally {
      setIsConfirmPopupOpen(false);
      setIsLoading(false);
    }
  };

  const cancelStopSales = () => setIsConfirmPopupOpen(false);

  return (
    <ConfigSection
      title="Управление продажами"
      isOpen={isOpen}
      onToggle={onToggle}
      wrapperClassName={isSaved ? 'conf-step__wrapper__save-status' : ''}
    >
      {error && (
        <div className="error-message" style={{ color: '#ff0000' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>×</button>
        </div>
      )}

      <div className="conf-step__wrapper text-center">
        <p className="conf-step__paragraph">Всё готово, теперь можно:</p>

        <ConfigButton
          variant={salesOpen ? 'regular' : 'accent'}
          onClick={handleToggleSales}
          disabled={isLoading}
          className={salesOpen ? 'conf-step__button-warning' : ''}
        >
          {isLoading ? 'Обработка...' : salesOpen ? 'Приостановить продажу билетов' : 'Открыть продажу билетов'}
        </ConfigButton>

        {salesOpen && (
          <div className="conf-step__status conf-step__status--active">
            Продажа билетов активна
          </div>
        )}
      </div>

      <Popup isOpen={isConfirmPopupOpen} onClose={cancelStopSales} title="Приостановка продаж">
        <DeleteForm
          message="Вы действительно хотите приостановить продажу билетов"
          itemName=""
          onSubmit={confirmStopSales}
          onCancel={cancelStopSales}
          submitText="Приостановить"
        />
      </Popup>
    </ConfigSection>
  );
};