import { useState, useEffect } from 'react';
import axios from 'axios';
import type { AdminHall, AdminSeat } from '../../../types/admin';
import { ConfigSection } from '../ConfigSection/ConfigSection';
import { ConfigButton } from '../ConfigButton/ConfigButton';
import './HallConfiguration.css';

interface HallConfigurationProps {
  isOpen: boolean;
  onToggle: () => void;
  halls: AdminHall[];
  onConfigurationSaved: (hallId: string) => void;
}

type AdminSeatType = 'standard' | 'vip' | 'disabled';

export const HallConfiguration: React.FC<HallConfigurationProps> = ({
  isOpen,
  onToggle,
  halls,
  onConfigurationSaved,
}) => {
  const [selectedHallId, setSelectedHallId] = useState<string>('');
  const [rows, setRows] = useState<number>(0);
  const [seatsPerRow, setSeatsPerRow] = useState<number>(0);
  const [layout, setLayout] = useState<AdminSeat[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Выбор первого зала по умолчанию
  useEffect(() => {
    if (!selectedHallId && halls.length > 0) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls, selectedHallId]);

  // Загрузка конфигурации выбранного зала
  useEffect(() => {
    if (!selectedHallId) {
      setRows(0);
      setSeatsPerRow(0);
      setLayout([]);
      return;
    }

    const hall = halls.find(h => h.id === selectedHallId);
    if (!hall) return;

    setRows(hall.rows || 0);
    setSeatsPerRow(hall.seatsPerRow || 0);
    setLayout(hall.layout || []);
  }, [selectedHallId, halls]);

  // Пересчёт сетки при изменении размеров
  useEffect(() => {
    if (rows < 1 || seatsPerRow < 1) {
      setLayout([]);
      return;
    }

    setLayout(prev => {
      const newLayout: AdminSeat[][] = [];

      for (let r = 0; r < rows; r++) {
        const row: AdminSeat[] = [];

        for (let s = 0; s < seatsPerRow; s++) {
          const oldSeat = prev[r]?.[s];

          row.push({
            row: r + 1,
            seat: s + 1,
            type: oldSeat?.type || 'standard',
          });
        }

        newLayout.push(row);
      }

      return newLayout;
    });
  }, [rows, seatsPerRow]);

  // Работа с креслами
  const nextSeatType = (type: AdminSeatType): AdminSeatType => {
    if (type === 'standard') return 'vip';
    if (type === 'vip') return 'disabled';
    return 'standard';
  };

  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    setLayout(prev => {
      const copy = prev.map(row => row.map(seat => ({ ...seat })));
      copy[rowIndex][seatIndex].type = nextSeatType(copy[rowIndex][seatIndex].type);
      return copy;
    });
  };

  // Сохранение
  const handleSave = async () => {
    if (!selectedHallId) return;

    if (rows < 1 || seatsPerRow < 1) {
      setError('Укажите количество рядов и мест (минимум 1)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.put(`/api/halls/${selectedHallId}`, {
        rows,
        seats_per_row: seatsPerRow,
        layout,
      });

      onConfigurationSaved(selectedHallId);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Ошибка сохранения конфигурации'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigSection
      title="Конфигурация залов"
      isOpen={isOpen}
      onToggle={onToggle}
      wrapperClassName={isSaved ? 'conf-step__wrapper__save-status' : ''}
    >
      {error && (
        <div className="error-message" style={{ color: '#ff0000' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 10 }}>×</button>
        </div>
      )}

      <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>

      <ul className="conf-step__selectors-box">
        {halls.map(hall => (
          <li key={hall.id}>
            <input
              type="radio"
              className="conf-step__radio"
              name="chairs-hall"
              checked={selectedHallId === hall.id}
              onChange={() => setSelectedHallId(hall.id)}
            />
            <span
              className="conf-step__selector"
              onClick={() => setSelectedHallId(hall.id)}
            >
              {hall.name}
            </span>
          </li>
        ))}
      </ul>

      {selectedHallId && (
        <>
          <p className="conf-step__paragraph">
            Укажите количество рядов и мест в ряду:
          </p>

          <div className="conf-step__legend">
            <label className="conf-step__label">
              Рядов
              <input
                type="number"
                className="conf-step__input"
                min={1}
                max={20}
                value={rows}
                onChange={e => setRows(Number(e.target.value))}
              />
            </label>

            <span className="multiplier">×</span>

            <label className="conf-step__label">
              Мест в ряду
              <input
                type="number"
                className="conf-step__input"
                min={1}
                max={20}
                value={seatsPerRow}
                onChange={e => setSeatsPerRow(Number(e.target.value))}
              />
            </label>
          </div>

          <p className="conf-step__paragraph">
            Нажмите на кресло, чтобы изменить его тип:
          </p>

          <div className="conf-step__legend">
            <span className="conf-step__chair conf-step__chair_standard"></span> — обычные
            <span className="conf-step__chair conf-step__chair_vip"></span> — VIP
            <span className="conf-step__chair conf-step__chair_disabled"></span> — заблокированные
          </div>

          <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
              {layout.map((row, rowIndex) => (
                <div key={rowIndex} className="conf-step__row">
                  {row.map((seat, seatIndex) => (
                    <span
                      key={seatIndex}
                      className={`conf-step__chair conf-step__chair_${seat.type}`}
                      onClick={() => handleSeatClick(rowIndex, seatIndex)}
                      title={`Ряд ${seat.row}, Место ${seat.seat}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="conf-step__buttons text-center">
            <ConfigButton
              variant="regular"
              disabled={isLoading}
              onClick={() => setSelectedHallId(halls[0]?.id || '')}
            >
              Отмена
            </ConfigButton>

            <ConfigButton
              variant="accent"
              disabled={isLoading || rows < 1 || seatsPerRow < 1}
              onClick={handleSave}
            >
              {isLoading ? 'Сохранение…' : 'Сохранить'}
            </ConfigButton>
          </div>
        </>
      )}
    </ConfigSection>
  );
};