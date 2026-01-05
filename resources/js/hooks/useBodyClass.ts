import { useEffect } from 'react';

export const useBodyClass = (className: string) => {
  useEffect(() => {
    if (!className || typeof document === 'undefined') return;

    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
};