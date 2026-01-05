import './MovieDescription.css';

interface MovieDescriptionProps {
    title: string;
    synopsis: string;
    duration: string;
    origin: string;
}

export const MovieDescription: React.FC<MovieDescriptionProps> = ({
    title,
    synopsis,
    duration,
    origin
}) => (
    <div className="movie__description">
        <h2 className="movie__title">{title}</h2>
        <p className="movie__synopsis">{synopsis}</p>
        <p className="movie__data">
            <span className="movie__data-duration">{duration}</span>
            <span className="movie__data-origin">{origin}</span>
        </p>
    </div>
);