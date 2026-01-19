// 외부 라이브러리
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 내부 유틸/전역/서비스
import { createContentDetailHandler } from '@/utils/navigationUtils'

// 컴포넌트
import { WideButton } from '../../common/Button/Button';
import './MovieCard.scss';

export interface MovieCardProps {
  id?: string | number;
  title: string;
  synopsis?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  rating?: number;
  onCommentClick?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  synopsis,
  imageUrl,
  className = '',
  rating,
  onCommentClick,
}) => {
  const navigate = useNavigate();
  const handleCommentClick = createContentDetailHandler(navigate, id, onCommentClick);

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
            onClick={handleCommentClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
