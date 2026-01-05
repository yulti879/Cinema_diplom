import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminHall, PriceData, UpdateHallPricesDTO } from '../../../types/admin';
import { ConfigSection } from '../ConfigSection/ConfigSection';
import { ConfigButton } from '../ConfigButton/ConfigButton';
import { FormField } from '../FormField/FormField';
import './PriceConfiguration.css';

interface PriceConfigurationProps {
  isOpen: boolean;
  onToggle: () => void;
  halls: AdminHall[];
  onPricesSaved: (prices: PriceData) => void;
}

export const PriceConfiguration: React.FC<PriceConfigurationProps> = ({
  isOpen,
  onToggle,
  halls,
  onPricesSaved
}) => {
  const [selectedHall, setSelectedHall] = useState<string>('');
  const [standardPrice, setStandardPrice] = useState<number>(0);
  const [vipPrice, setVipPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const isHallSelected = Boolean(selectedHall);

  // ПО дефолту выбран первый зал
  useEffect(() => {
    if (!selectedHall && halls.length > 0) {
      setSelectedHall(halls[0].id);
    }
  }, [halls, selectedHall]);

  // Загружаем цены при выборе зала
  useEffect(() => {
    if (!selectedHall) {
      setStandardPrice(0);
      setVipPrice(0);
      return;
    }

    const fetchPrices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/halls/${selectedHall}`);
        setStandardPrice(res.data.standardPrice ?? 0);
        setVipPrice(res.data.vipPrice ?? 0);
      } catch (err: any) {
        console.error('Ошибка загрузки цен:', err);
        setError('Не удалось загрузить цены для зала');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, [selectedHall]);

  // Разрешаем ввод только чисел >= 0
  const handlePriceChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const num = Number(value.replace(/\D/g, ''));
    if (!isNaN(num)) setter(num);
  };

  // Сохранение цен
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHall) return;

    setIsLoading(true);
    setError(null);

    const payload: UpdateHallPricesDTO = {
      standard_price: standardPrice,
      vip_price: vipPrice,
    };

    try {
      await axios.put(`/api/halls/${selectedHall}`, payload);

      const hallName = halls.find(h => h.id === selectedHall)?.name || '';

      onPricesSaved({
        hallId: selectedHall,
        hallName,
        standardPrice,
        vipPrice,
        timestamp: new Date().toISOString()
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Ошибка сохранения цен:', err);
      setError('Не удалось сохранить цены');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigSection
      title="Конфигурация цен"
      isOpen={isOpen}
      onToggle={onToggle}
      wrapperClassName={isSaved ? 'conf-step__wrapper__save-status' : ''}
    >
      {error && (
        <div className="error-message" style={{ color: '#ff0000' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px'}}>×</button>
        </div>
      )}

      <p className="conf-step__paragraph">
        Выберите зал для конфигурации:
      </p>

      <ul className="conf-step__selectors-box">
        {halls.map((hall) => (
          <li key={hall.id}>
            <input
              type="radio"
              className="conf-step__radio"
              name="prices-hall"
              value={hall.id}
              checked={selectedHall === hall.id}
              onChange={() => setSelectedHall(hall.id)}
              disabled={isLoading}
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

      <form onSubmit={handleSave}>
        <p className="conf-step__paragraph">
          Установите цены для типов кресел:
        </p>

        <div className="conf-step__legend">
          <FormField
            label="Цена, рублей"
            name="standardPrice"
            type="text"
            value={standardPrice}
            onChange={e => handlePriceChange(setStandardPrice, e.target.value)}
            disabled={!isHallSelected || isLoading}
          />
          за <span className="conf-step__chair conf-step__chair_standard"></span>{' '}
          обычные кресла
        </div>

        <div className="conf-step__legend">
          <FormField
            label="Цена, рублей"
            name="vipPrice"
            type="text"
            value={vipPrice}
            onChange={e => handlePriceChange(setVipPrice, e.target.value)}
            disabled={!isHallSelected || isLoading}
          />
          за <span className="conf-step__chair conf-step__chair_vip"></span>{' '}
          VIP кресла
        </div>

        <fieldset className="conf-step__buttons text-center">
          <ConfigButton
            variant="regular"
            type="button"
            disabled={isLoading}
            onClick={() => {
              setSelectedHall(halls[0]?.id || '');
              setStandardPrice(0);
              setVipPrice(0);
            }}
          >
            Отмена
          </ConfigButton>

          <ConfigButton
            variant="accent"
            type="submit"
            disabled={!isHallSelected || isLoading}
          >
            {isLoading ? 'Сохраняем...' : 'Сохранить'}
          </ConfigButton>
        </fieldset>
      </form>
    </ConfigSection>
  );
};