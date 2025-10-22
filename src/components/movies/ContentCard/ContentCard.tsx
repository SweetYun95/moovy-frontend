import React from 'react';
import './ContentCard.scss';
import { Icon } from '@iconify/react';

/**
 * ContentCard Props:
 * - title: string (영화 제목)
 * - year: string (개봉 연도)
 * - country: string (제작 국가)
 * - rating: number (평균 평점)
 * - imageUrl?: string (포스터 이미지 URL)
 * - imageAlt?: string (이미지 alt 텍스트)
 * - className?: string (추가 CSS 클래스)
 * - onClick?: () => void (카드 클릭 핸들러)
 */

export interface ContentCardProps {
  title: string;
  year: string;
  country: string;
  rating: number;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  year,
  country,
  rating,
  imageUrl,
  imageAlt,
  className = '',
  onClick,
}) => {
  return (
    <div className={`content-card ${className}`} onClick={onClick}>
      <div className="content-card__image-wrapper">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={imageAlt || title}
            className="content-card__image"
          />
        ) : (
          <div className="content-card__image-placeholder">
            <Icon icon="mdi:image" width="48" height="48" />
          </div>
        )}
      </div>
      
      <div className="content-card__content">
        <h3 className="content-card__title">{title}</h3>
        
        <div className="content-card__info">
          <span className="content-card__year-country">
            {year}년 · {country}
          </span>
        </div>
        
        <div className="content-card__footer">
          <div className="content-card__rating">
            <Icon icon="mdi:star" className="content-card__star-icon" />
            <span className="content-card__rating-text">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;

