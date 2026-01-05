import { useState } from 'react';
import axios from 'axios';
import { AdminHall } from '../../../types/admin';
import { ConfigSection } from '../ConfigSection/ConfigSection';
import { ConfigButton } from '../ConfigButton/ConfigButton';
import { Popup } from '../Popup/Popup';
import { DeleteForm } from '../DeleteForm/DeleteForm';

interface HallManagementProps {
  isOpen: boolean;
  onToggle: () => void;
  halls: AdminHall[];
  onHallCreated: (hall: AdminHall) => void;
  onHallDeleted: (hallId: string) => void;
}

export const HallManagement: React.FC<HallManagementProps> = ({
  isOpen,
  onToggle,
  halls,
  onHallCreated,
  onHallDeleted,
}) => {
  const [isAddHallPopupOpen, setIsAddHallPopupOpen] = useState(false);
  const [newHallName, setNewHallName] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [hallToDelete, setHallToDelete] = useState<AdminHall | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Добавление зала
  const handleAddHall = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = newHallName.trim();
    if (!name) {
      setError('Вы не ввели название зала');
      return;
    }

    const existingHall = halls.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (existingHall) {
      setError(`Зал с названием "${name}" уже существует`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/halls', {
        name,
        rows: 10,
        seats_per_row: 8,
        standard_price: 0,
        vip_price: 0,
        layout: null,
      });

      if (response.data) {
        const newHall = response.data;
        onHallCreated(newHall);
        setIsAddHallPopupOpen(false);
        setNewHallName('');
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // сброс статуса через 3 сек
      } else {
        setError('Сервер вернул некорректные данные');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании зала');
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление зала
  const confirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallToDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/halls/${hallToDelete.id}`);
      // обновляем локальное состояние
      onHallDeleted(hallToDelete.id);
      setIsDeletePopupOpen(false);
      setHallToDelete(null);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError('Не удалось удалить зал');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigSection
      title="Управление залами"
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

      {halls.length > 0 ? (
        <ul className="conf-step__list">
          {halls.map(hall => (
            <li key={hall.id}>
              {hall.name}
              <ConfigButton
                variant="trash"
                title="Удалить зал"
                onClick={() => {
                  setHallToDelete(hall);
                  setIsDeletePopupOpen(true);
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="conf-step__paragraph" style={{ color: '#848484' }}>
          Нет созданных залов
        </p>
      )}

      <ConfigButton
        variant="accent"
        onClick={() => setIsAddHallPopupOpen(true)}
        disabled={isLoading}
      >
        Создать зал
      </ConfigButton>

      {/* Попап добавления */}
      <Popup
        isOpen={isAddHallPopupOpen}
        onClose={() => {
          setIsAddHallPopupOpen(false);
          setNewHallName('');
        }}
        title="Добавление зала"
      >
        <form onSubmit={handleAddHall}>
          <label className="conf-step__label conf-step__label-fullsize">
            Название зала
            <input
              className="conf-step__input"
              type="text"
              placeholder="Например, «Зал 1»"
              value={newHallName}
              onChange={e => setNewHallName(e.target.value)}
              required
              autoFocus
            />
          </label>

          <div className="conf-step__buttons text-center">
            <ConfigButton variant="accent" type="submit" disabled={isLoading}>
              {isLoading ? 'Обработка...' : 'Добавить зал'}
            </ConfigButton>
            <ConfigButton
              variant="regular"
              type="button"
              onClick={() => {
                setIsAddHallPopupOpen(false);
                setNewHallName('');
              }}
            >
              Отменить
            </ConfigButton>
          </div>
        </form>
      </Popup>

      {/* Попап удаления */}
      <Popup
        isOpen={isDeletePopupOpen}
        onClose={() => {
          setIsDeletePopupOpen(false);
          setHallToDelete(null);
        }}
        title="Удаление зала"
      >
        <DeleteForm
          message="Вы действительно хотите удалить зал"
          itemName={hallToDelete?.name || ''}
          onSubmit={confirmDelete}
          onCancel={() => {
            setIsDeletePopupOpen(false);
            setHallToDelete(null);
          }}
          submitText={isLoading ? 'Удаление...' : 'Удалить'}
        />
      </Popup>
    </ConfigSection>
  );
};