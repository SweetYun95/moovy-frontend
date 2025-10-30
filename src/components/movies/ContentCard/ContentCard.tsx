import React from 'react';
import './ContentCard.scss';
import { Icon } from '@iconify/react';

export interface ContentCardProps {
  title: string;
  year: string;
  category?: string;
  country?: string;
  rating: number;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  year,
  category,
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
            {year}년 · {category}{country ? ` · ${country}` : ''}
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
