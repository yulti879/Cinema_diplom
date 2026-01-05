import './ConfigSection.css';

interface ConfigSectionProps {
  title: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  wrapperClassName?: string;
}

export const ConfigSection: React.FC<ConfigSectionProps> = ({ 
  title, 
  isOpen = true,
  onToggle,
  children,
  wrapperClassName
}) => {
  return (
    <section className="conf-step">
      <header 
        className={`conf-step__header ${isOpen ? 'conf-step__header_opened' : 'conf-step__header_closed'}`}
        onClick={onToggle ? () => onToggle() : undefined}
      >
        <h2 className="conf-step__title">{title}</h2>
      </header>
      {isOpen && (
        <div className={`conf-step__wrapper ${wrapperClassName || ''}`}>
          {children}
        </div>
      )}
    </section>
  );
};