import './MoviePoster.css';
import { usePoster } from '../../../hooks/usePoster';

interface MoviePosterProps {
  title: string;
  poster?: string;
  className?: string;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({ 
  title, 
  poster 
}) => {  
  const { handlePosterError, getPosterSrc } = usePoster('/storage/posters/defaultPoster.png');
  
  return (
    <div className="movie__poster">
      <img
        className="movie__poster-image"
        alt={title}
        src={getPosterSrc(poster)}
        onError={handlePosterError}
      />
    </div>
  );
};