import { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminHall } from '../../../types/admin';
import { ConfigSection } from '../ConfigSection/ConfigSection';
import { ConfigButton } from '../ConfigButton/ConfigButton';
import { useDraftState } from '../../../hooks/useDraftState';

type PriceDraft = {
  standard: number;
  vip: number;
};

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  halls: AdminHall[];
  onPricesSaved: () => void;
}

export const PriceConfiguration: React.FC<Props> = ({
  isOpen,
  onToggle,
  halls,
  onPricesSaved,
}) => {
  const [selectedHall, setSelectedHall] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { draft, setDraft, reset, commit, isDirty } =
    useDraftState<PriceDraft>();

  useEffect(() => {
    if (!selectedHall && halls.length) {
      setSelectedHall(halls[0].id);
    }
  }, [halls, selectedHall]);

  useEffect(() => {
    if (!selectedHall) return;

    axios.get(`/api/halls/${selectedHall}`).then(res => {
      commit({
        standard: res.data.standardPrice ?? 0,
        vip: res.data.vipPrice ?? 0,
      });
    });
  }, [selectedHall]);

  const handleSave = async () => {
    if (!draft) return;

    setIsLoading(true);
    await axios.put(`/api/halls/${selectedHall}`, {
      standard_price: draft.standard,
      vip_price: draft.vip,
    });

    commit();
    onPricesSaved();
    setIsLoading(false);
  };

  return (
    <ConfigSection
      title="Конфигурация цен"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      
        <p className="conf-step__paragraph">
          Выберите зал для конфигурации:
        </p>

        <ul className="conf-step__selectors-box">
          {halls.map(hall => (
            <li key={hall.id}>
              <input
                type="radio"
                className="conf-step__radio"
                name="prices-hall"
                checked={selectedHall === hall.id}
                onChange={() => setSelectedHall(hall.id)}
              />
              <span
                className="conf-step__selector"
                onClick={() => setSelectedHall(hall.id)}
              >
                {hall.name}
              </span>
            </li>
          ))}
        </ul>

        {draft && (
          <>
            <p className="conf-step__paragraph">
              Установите цены для типов кресел:
            </p>

            <div className="conf-step__legend">
              <label className="conf-step__label">
                Цена, рублей
                <input
                  type="number"
                  className="conf-step__input"
                  value={draft.standard}
                  onChange={e =>
                    setDraft({
                      ...draft,
                      standard: Number(e.target.value),
                    })
                  }
                  min={0}
                />
              </label>
              за{' '}
              <span className="conf-step__chair conf-step__chair_standard" />{' '}
              обычные кресла
            </div>

            <div className="conf-step__legend">
              <label className="conf-step__label">
                Цена, рублей
                <input
                  type="number"
                  className="conf-step__input"
                  value={draft.vip}
                  onChange={e =>
                    setDraft({
                      ...draft,
                      vip: Number(e.target.value),
                    })
                  }
                  min={0}
                />
              </label>
              за <span className="conf-step__chair conf-step__chair_vip" /> VIP кресла
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