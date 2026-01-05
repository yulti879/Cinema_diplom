import './Poster.css';
import { usePoster } from '../../../hooks/usePoster';

interface PosterProps {
  src?: string;
  alt: string;
  className?: string;
}

export const Poster: React.FC<PosterProps> = ({
  src,
  alt,
  className = ''
}) => {
  const { handlePosterError, getPosterSrc } = usePoster('/storage/posters/defaultPoster.png');

  return (
    <img
      className={`conf-step__movie-poster`}
      src={getPosterSrc(src)}
      alt={alt}
      onError={handlePosterError}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
};