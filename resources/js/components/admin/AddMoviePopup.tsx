import React, { useRef, useState } from 'react';
import { Popup } from './Popup/Popup';
import { ConfigButton } from './ConfigButton/ConfigButton';
import { FormField } from './FormField/FormField';
import type { CreateMovieDTO } from '../../types';

interface AddMoviePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (movie: CreateMovieDTO) => Promise<void>;
}

export const AddMoviePopup: React.FC<AddMoviePopupProps> = ({
  isOpen,
  onClose,
  onAddMovie,
}) => {
  const [form, setForm] = useState({
    title: '',
    duration: '',
    synopsis: '',
    origin: '',
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =======================
     Handlers
     ======================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      if (file.type !== 'image/png') {
        setError('Постер должен быть в формате PNG');
        resetFile();
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Размер постера не должен превышать 2 МБ');
        resetFile();
        return;
      }
    }

    setPoster(file);
    if (error) setError(null);
  };

  const resetFile = () => {
    setPoster(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      duration: '',
      synopsis: '',
      origin: '',
    });
    resetFile();
    setError(null);
  };

  /* =======================
     Submit
     ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError('Введите название фильма');
      return;
    }

    const duration = Number(form.duration);
    if (!duration || duration <= 0) {
      setError('Введите корректную продолжительность');
      return;
    }

    if (!form.synopsis.trim()) {
      setError('Введите описание фильма');
      return;
    }

    if (!form.origin.trim()) {
      setError('Введите страну производства');
      return;
    }

    const dto: CreateMovieDTO = {
      title: form.title.trim(),
      duration,
      synopsis: form.synopsis.trim(),
      origin: form.origin.trim(),
      poster,
    };

    try {
      setIsSubmitting(true);
      await onAddMovie(dto);
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ошибка при добавлении фильма'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  /* =======================
     Render
     ======================= */
  return (
    <Popup
      isOpen={isOpen}
      onClose={handleCancel}
      title="Добавление фильма"
    >
      <form onSubmit={handleSubmit} className="popup__form">
        {error && (
          <div
            className="conf-step__wrapper__save-status"
            style={{ color: '#ff0000' }}
          >
            {error}
          </div>
        )}

        <FormField
          label="Название фильма"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <FormField
          label="Продолжительность (мин.)"
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          min="1"
          required
        />

        <FormField
          label="Описание"
          name="synopsis"
          type="textarea"
          value={form.synopsis}
          onChange={handleChange}
          rows={4}
          required
        />

        <FormField
          label="Страна производства"
          name="origin"
          value={form.origin}
          onChange={handleChange}
          required
        />

        <div className="form-field">
          <label className="conf-step__label conf-step__label-fullsize">
            Постер (PNG, до 2 МБ)
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isSubmitting}
            />
          </label>

          {poster && (
            <div className="conf-step__legend">
              {poster.name} ({(poster.size / 1024 / 1024).toFixed(2)} МБ)
            </div>
          )}
        </div>

        <div className="conf-step__buttons text-center">
          <ConfigButton
            variant="accent"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Добавление…' : 'Добавить фильм'}
          </ConfigButton>

          <ConfigButton
            variant="regular"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Отменить
          </ConfigButton>
        </div>
      </form>
    </Popup>
  );
};