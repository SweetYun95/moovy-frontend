import React, { useState, useEffect } from 'react';
import './ContentCard.scss';
import { Icon } from '@iconify/react';
import { getContentCards, type ContentCard as ContentCardType } from '../../../services/api/contentApi';

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

// Demo wrapper
export function ContentCardComponent() {
  const [contentCards, setContentCards] = useState<ContentCardType[]>([]);

  useEffect(() => {
    // TODO: 백엔드 API 연동 시 주석 해제
    // getContentCards().then(setContentCards);
    
    // 임시 하드코딩 데이터
    const tempData: ContentCardType[] = [
      {
        id: 1,
        title: '토르: 천둥의 신',
        year: '2004',
        country: '영화/미국',
        rating: 4.1,
        imageUrl: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
      },
      {
        id: 2,
        title: '인터스텔라',
        year: '2014',
        country: '영화/미국',
        rating: 4.5,
        imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      },
      {
        id: 3,
        title: '다크 나이트',
        year: '2008',
        country: '영화/미국',
        rating: 4.8,
        imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      },
      {
        id: 4,
        title: '인셉션',
        year: '2010',
        country: '영화/미국',
        rating: 4.7,
      },
      {
        id: 5,
        title: '어벤져스',
        year: '2012',
        country: '영화/미국',
        rating: 4.6,
        imageUrl: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
      },
      {
        id: 6,
        title: '기생충',
        year: '2019',
        country: '영화/한국',
        rating: 4.9,
      },
      {
        id: 7,
        title: '타이타닉',
        year: '1997',
        country: '영화/미국',
        rating: 4.4,
      },
      {
        id: 8,
        title: '겨울왕국',
        year: '2013',
        country: '애니메이션/미국',
        rating: 4.3,
      },
    ];
    setContentCards(tempData);
  }, []);

  return (
    <div className="component-demo">
      <h4>Content Card Components</h4>
      <div className="row g-4">
        {contentCards.map((content) => (
          <div key={content.id} className="col-xl-3 col-md-4 col-sm-6 mb-4">
            <ContentCard
              title={content.title}
              year={content.year}
              country={content.country}
              rating={content.rating}
              imageUrl={content.imageUrl}
              onClick={() => alert(`${content.title} 클릭!`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

