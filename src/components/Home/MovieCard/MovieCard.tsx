import React from 'react';
import { Button } from '../../common/Button/Button';
import './MovieCard.scss';

/**
 * MovieCard Props:
 * - title: string (영화 제목)
 * - synopsis: string (영화 시놉시스)
 * - imageUrl?: string (영화 포스터 이미지 URL)
 * - imageAlt?: string (이미지 alt 텍스트)
 * - className?: string (추가 CSS 클래스)
 * - rating?: number (평균 평점)
 * - onCommentClick?: () => void (코멘트 작성 버튼 클릭 핸들러)
 */

export interface MovieCardProps {
  title: string;
  synopsis: string;
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
        <p className="movie-card__synopsis">{synopsis}</p>
        
        <div className="movie-card__action">
          <Button
            variant="secondary"
            size="md"
            onClick={onCommentClick}
            className="btn-comment-wide"
          >
            코멘트 작성하러 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
