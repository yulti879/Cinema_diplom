import React, { useEffect, useState } from 'react';
import './Popup.css';

interface PopupProps {
  title?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ 
  isOpen = false, 
  onClose, 
  title, 
  children 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Анимация открытия/закрытия
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsActive(true), 10);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      setIsActive(false);
      const timer = setTimeout(() => setIsVisible(false), 500);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Закрытие по ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`popup ${isActive ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="popup__container">
        <div className="popup__content">
          <div className="popup__header">
            <h2 className="popup__title">
              {title}
              <a
                className="popup__dismiss"
                href="#"
                onClick={handleClose}
              >
                <img src="/img/admin/close.png" alt="Закрыть" />
              </a>
            </h2>
          </div>
          <div className="popup__wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};