import React, { useState, useEffect } from 'react';
import { WideButton } from '../../common/Button/Button';
import './MovieCard.scss';
import { getMovieCards, type MovieCard as MovieCardType } from '../../../services/api/contentApi';

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

// Demo wrapper
export function MovieCardComponent() {
  const [movieCards, setMovieCards] = useState<MovieCardType[]>([]);

  useEffect(() => {
    // TODO: 백엔드 API 연동 시 주석 해제
    // getMovieCards().then(setMovieCards);
    
    // 임시 하드코딩 데이터
    const tempData: MovieCardType[] = [
      {
        id: 1,
        title: '다 이루어질 지니',
        synopsis: '케이팝 슈퍼스타 루미, 미라, 조이. 매진을 기록하는 대형 스타디움 공연이 없을 때면 이들은 또 다른 활동에 나선다. 바로 비밀 능력을 이용해 팬들을 초자연적 위협으로부터 보호하는 것.',
        imageUrl: 'https://picsum.photos/300/400?random=1',
        rating: 4.5,
      },
      {
        id: 2,
        title: '사마귀',
        synopsis: '2025년 대한민국, 더 화끈하게! 액션과 스릴이 가득한 새로운 영화가 등장한다. 예측 불가능한 스토리와 강렬한 액션으로 관객들을 사로잡을 것이다.',
        imageUrl: 'https://picsum.photos/300/400?random=2',
        rating: 3.8,
      },
      {
        id: 3,
        title: '야당',
        synopsis: '정치적 갈등과 권력의 암투가 펼쳐지는 드라마. 현실적인 정치 상황을 그려내며 시청자들에게 깊은 여운을 남기는 작품이다.',
        imageUrl: 'https://picsum.photos/300/400?random=3',
        rating: 4.2,
      },
    ];
    setMovieCards(tempData);
  }, []);

  return (
    <div className="component-demo">
      <h4>Movie Card Components</h4>
      <div className="row">
        {movieCards.map((movie) => (
          <div key={movie.id} className="col-12 col-md-4 mb-4">
            <MovieCard
              title={movie.title}
              synopsis={movie.synopsis}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
              onCommentClick={() => alert(`${movie.title} 코멘트 작성`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
