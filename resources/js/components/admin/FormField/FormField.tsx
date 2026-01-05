import './FormField.css';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 
         'textarea' | 'select' | 'time' | 'date' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  options?: { value: string; label: string }[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  min?: number | string;
  max?: number | string;
  step?: number;
  rows?: number;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  options = [],
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  rows = 3,
  error
}) => {
  const renderInput = () => {
    const commonProps = {
      className: `conf-step__input ${error ? 'conf-step__input--error' : ''}`,
      name,
      required,
      disabled,
      readOnly,
      autoFocus,
      value: value ?? '',
      onChange,
      onBlur,
      placeholder
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea 
            {...commonProps}
            rows={rows}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || 'Выберите...'}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'time':
        return (
    <input 
      {...commonProps}
      type="time"
      value={value || ""}
    />
  );
      
      case 'date':
      case 'datetime-local':
        return (
          <input 
            {...commonProps}
            type={type}
          />
        );
      
      case 'number':
        return (
          <input 
            {...commonProps}
            type="number"
            min={min}
            max={max}
            step={step}
          />
        );
      
      default:
        return (
          <input 
            {...commonProps}
            type={type}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label className="conf-step__label conf-step__label-fullsize" htmlFor={name}>
        {label}
        {required && <span className="form-field__required">*</span>}
        {renderInput()}
        {error && <span className="form-field__error">{error}</span>}
      </label>
    </div>
  );
};