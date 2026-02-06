import { useEffect, useState } from 'react';
import axios from 'axios';
import type { AdminHall, AdminSeat } from '../../../types/admin';
import { ConfigSection } from '../ConfigSection/ConfigSection';
import { ConfigButton } from '../ConfigButton/ConfigButton';
import { useDraftState } from '../../../hooks/useDraftState';
import './HallConfiguration.css';

type HallConfigDraft = {
  rows: number;
  seatsPerRow: number;
  layout: AdminSeat[][];
};

type SeatType = 'standard' | 'vip' | 'disabled';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  halls: AdminHall[];
  onConfigurationSaved: (hallId: string) => void;
}

export const HallConfiguration: React.FC<Props> = ({
  isOpen,
  onToggle,
  halls,
  onConfigurationSaved,
}) => {
  const [selectedHallId, setSelectedHallId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const {
    draft,
    setDraft,
    reset,
    commit,
    isDirty,
  } = useDraftState<HallConfigDraft>();

  // выбор первого зала
  useEffect(() => {
    if (!selectedHallId && halls.length > 0) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls, selectedHallId]);

  // загрузка конфига зала → baseline + draft
  useEffect(() => {
    const hall = halls.find(h => h.id === selectedHallId);
    if (!hall) return;

    const config: HallConfigDraft = {
      rows: hall.rows || 0,
      seatsPerRow: hall.seatsPerRow || 0,
      layout: hall.layout || [],
    };

    commit(config);
  }, [selectedHallId, halls]);

  // пересчёт сетки
  useEffect(() => {
    if (!draft) return;
    const { rows, seatsPerRow, layout } = draft;

    if (rows < 1 || seatsPerRow < 1) {
      setDraft({ ...draft, layout: [] });
      return;
    }

    const newLayout: AdminSeat[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: AdminSeat[] = [];
      for (let s = 0; s < seatsPerRow; s++) {
        row.push(
          layout[r]?.[s] ?? {
            row: r + 1,
            seat: s + 1,
            type: 'standard',
          }
        );
      }
      newLayout.push(row);
    }

    setDraft({ ...draft, layout: newLayout });
  }, [draft?.rows, draft?.seatsPerRow]);

  const nextType = (t: SeatType): SeatType =>
    t === 'standard' ? 'vip' : t === 'vip' ? 'disabled' : 'standard';

  const handleSeatClick = (r: number, s: number) => {
    if (!draft) return;
    const copy = draft.layout.map(row => row.map(seat => ({ ...seat })));
    copy[r][s].type = nextType(copy[r][s].type);
    setDraft({ ...draft, layout: copy });
  };

  const handleSave = async () => {
    if (!draft || !selectedHallId) return;

    setIsLoading(true);
    setError(null);

    try {
      await axios.put(`/api/halls/${selectedHallId}`, {
        rows: draft.rows,
        seats_per_row: draft.seatsPerRow,
        layout: draft.layout,
      });

      commit();
      onConfigurationSaved(selectedHallId);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setError('Ошибка сохранения конфигурации');
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
        <div style={{ color: 'red', marginBottom: 10 }}>
          {error}
        </div>
      )}

      <p className="conf-step__paragraph">
        Выберите зал для конфигурации:
      </p>

      <ul className="conf-step__selectors-box">
        {halls.map(h => (
          <li key={h.id}>
            <input
              type="radio"
              className="conf-step__radio"
              name="chairs-hall"
              checked={selectedHallId === h.id}
              onChange={() => setSelectedHallId(h.id)}
            />
            <span
              className="conf-step__selector"
              onClick={() => setSelectedHallId(h.id)}
            >
              {h.name}
            </span>
          </li>
        ))}
      </ul>

      {draft && (
        <>
          <p className="conf-step__paragraph">
            Укажите количество рядов и максимальное количество кресел в ряду:
          </p>

          <div className="conf-step__legend">
            <label className="conf-step__label">
              Рядов, шт
              <input
                type="number"
                className="conf-step__input"
                value={draft.rows}
                onChange={e =>
                  setDraft({ ...draft, rows: Number(e.target.value) })
                }
              />
            </label>

            <span className="multiplier">x</span>

            <label className="conf-step__label">
              Мест, шт
              <input
                type="number"
                className="conf-step__input"
                value={draft.seatsPerRow}
                onChange={e =>
                  setDraft({
                    ...draft,
                    seatsPerRow: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>

          <p className="conf-step__paragraph">
            Теперь вы можете указать типы кресел на схеме зала:
          </p>

          <div className="conf-step__legend">
            <div className="conf-step__legend-items">
              <div className="conf-step__legend-item">
                <span className="conf-step__chair conf-step__chair_standard"></span>
                — обычные кресла
              </div>
              <div className="conf-step__legend-item">
                <span className="conf-step__chair conf-step__chair_vip"></span>
                — VIP кресла
              </div>
              <div className="conf-step__legend-item">
                <span className="conf-step__chair conf-step__chair_disabled"></span>
                — заблокированные (нет кресла)
              </div>
            </div>
            <p className="conf-step__hint">
              Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
            </p>
          </div>

          <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
              {draft.layout.map((row, r) => (
                <div key={r} className="conf-step__row">
                  {row.map((seat, s) => (
                    <span
                      key={s}
                      className={`conf-step__chair conf-step__chair_${seat.type}`}
                      onClick={() => handleSeatClick(r, s)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <fieldset className="conf-step__buttons text-center">
            <ConfigButton
              variant="regular"
              disabled={!isDirty || isLoading}
              onClick={reset}
            >
              Отмена
            </ConfigButton>

            <ConfigButton
              variant="accent"
              disabled={!isDirty || isLoading}
              onClick={handleSave}
            >
              Сохранить
            </ConfigButton>
          </fieldset>
        </>
      )}

    </ConfigSection>
  );
};