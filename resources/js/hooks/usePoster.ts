import { useCallback } from 'react';

export const usePoster = (defaultPoster: string = '/img/admin/defaultPoster.png') => {

  const handlePosterError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const el = e.currentTarget;

      // Предотвращение циклического onError из-за абсолютных путей браузера
      if (!el.src.endsWith(defaultPoster)) {
        el.src = defaultPoster;
      }
    },
    [defaultPoster]
  );

  const getPosterSrc = useCallback(
    (src?: string) => {
      return src && src.trim() ? src : defaultPoster;
    },
    [defaultPoster]
  );

  return { handlePosterError, getPosterSrc };
};