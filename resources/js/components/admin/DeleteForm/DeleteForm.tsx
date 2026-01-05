import { ConfigButton } from '../ConfigButton/ConfigButton';

interface DeleteFormProps {
  message: string;
  itemName?: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText?: string;
}

export const DeleteForm: React.FC<DeleteFormProps> = ({
  message,
  itemName,
  onSubmit,
  onCancel,
  submitText = "Удалить"
}) => {
  return (
    <form onSubmit={onSubmit}>
      <p className="conf-step__paragraph">
        {message}{itemName ? <span> «{itemName}»</span> : ''}?
      </p>
      <div className="conf-step__buttons text-center">
        <ConfigButton variant="accent" type="submit">{submitText}</ConfigButton>
        <ConfigButton variant="regular" type="button" onClick={onCancel}>Отменить</ConfigButton>
      </div>
    </form>
  );
};