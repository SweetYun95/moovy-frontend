import React from 'react';
import { WideButton } from '../../common/Button/Button';
import './MovieCard.scss';

export interface MovieCardProps {
  title: string;
  synopsis?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  rating?: number;
  onCommentClick?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  title,
  synopsis,
  imageUrl,
  imageAlt,
  className = '',
  rating,
  onCommentClick,
}) => {
  return (
    <div 
      className={`movie-card ${className} ${!imageUrl ? 'movie-card--no-image' : ''}`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
    >
      <div className="movie-card__overlay"></div>
      
      <div className="movie-card__content">
        <div className="movie-card__title-section">
          <h3 className="movie-card__title">{title}</h3>
          {rating && (
            <div className="movie-card__rating">
              <span className="movie-card__rating-text">평균 {rating}점</span>
            </div>
          )}
        </div>
        {synopsis && <p className="movie-card__synopsis">{synopsis}</p>}
        
        <div className="movie-card__action">
          <WideButton
            buttonType="comment"
            onClick={onCommentClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
