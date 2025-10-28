import React, { useState, useEffect } from 'react';
import './ImageCommentCard.scss';
import { Icon } from '@iconify/react';
import { getImageCommentCards, type ImageCommentCard as ImageCommentCardType } from '../../../services/api/commentApi';

export interface ImageCommentCardProps {
  username: string;
  movieTitle: string;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
  profileImageUrl?: string;
  movieImageUrl?: string;
  className?: string;
  onLikeClick?: () => void;
  onReplyClick?: () => void;
}

export const ImageCommentCard: React.FC<ImageCommentCardProps> = ({
  username,
  movieTitle,
  comment,
  rating,
  likes,
  replies,
  profileImageUrl,
  movieImageUrl,
  className = '',
  onLikeClick,
  onReplyClick,
}) => {
  const renderStarIcon = () => {
    return <Icon icon="mdi:star" width="16" height="16" style={{ color: '#FFD60A' }} />;
  };

  return (
    <div className={`comment-card ${className}`}>
      <div className="comment-card__header">
        <div className="comment-card__profile">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={username}
              className="comment-card__profile-image"
            />
          ) : (
            <div className="comment-card__profile-placeholder">
              <Icon icon="mdi:account" width="20" height="20" />
            </div>
          )}
          <span className="comment-card__username">{username}</span>
        </div>
        <div className="comment-card__rating">
          {renderStarIcon()}
          <span className="comment-card__rating-text">{rating}</span>
        </div>
      </div>
      
      <div className="comment-card__main-content">
        <div className="comment-card__movie-image">
          {movieImageUrl ? (
            <img 
              src={movieImageUrl} 
              alt={movieTitle}
              className="comment-card__movie-poster"
            />
          ) : (
            <div className="comment-card__movie-placeholder">
              <Icon icon="mdi:image" width="40" height="40" />
            </div>
          )}
        </div>
        
        <div className="comment-card__content">
          <h4 className="comment-card__movie-title">{movieTitle}</h4>
          <p className="comment-card__text">{comment}</p>
        </div>
      </div>
      
      <div className="comment-card__actions">
        <button 
          className="comment-card__action-button comment-card__action-button--like"
          onClick={onLikeClick}
        >
          <span>좋아요 {likes}개</span>
        </button>
        
        <button 
          className="comment-card__action-button comment-card__action-button--reply"
          onClick={onReplyClick}
        >
          <span>댓글 {replies}</span>
        </button>
      </div>
      
      <div className="comment-card__icon-actions">
        <button 
          className="comment-card__icon-button comment-card__icon-button--like"
          onClick={onLikeClick}
        >
          <Icon icon="mdi:heart-outline" width="24" height="24" />
        </button>
        
        <button 
          className="comment-card__icon-button comment-card__icon-button--reply"
          onClick={onReplyClick}
        >
          <Icon icon="mdi:comment-outline" width="24" height="24" />
        </button>
      </div>
    </div>
  );
};

export default ImageCommentCard;

// Demo wrapper
export function ImageCommentCardComponent() {
  const [imageCommentCards, setImageCommentCards] = useState<ImageCommentCardType[]>([]);

  useEffect(() => {
    // TODO: 백엔드 API 연동 시 주석 해제
    // getImageCommentCards().then(setImageCommentCards);
    
    // 임시 하드코딩 데이터
    const tempData: ImageCommentCardType[] = [
      {
        id: 1,
        username: '유저닉네임1',
        movieTitle: '다 이루어질 지니',
        comment: '정말 재미있는 영화였어요! 케이팝 아이돌들이 액션 히어로로 나오는 설정이 신선하고, 스토리도 탄탄해서 끝까지 몰입해서 봤습니다. 특히 액션 씬들이 정말 잘 만들어진 것 같아요.',
        rating: 4.5,
        likes: 102,
        replies: 2,
      },
      {
        id: 2,
        username: '영화매니아',
        movieTitle: '사마귀',
        comment: '예상보다 훨씬 재미있었습니다! 스토리 전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었어요. 액션 시퀀스도 정말 잘 만들어진 것 같습니다.',
        rating: 4.0,
        likes: 89,
        replies: 5,
      },
      {
        id: 3,
        username: '드라마러버',
        movieTitle: '야당',
        comment: '정치 드라마치고는 정말 현실적이고 몰입도가 높았습니다. 배우들의 연기도 훌륭하고, 스토리도 정치적 상황을 잘 반영한 것 같아요. 추천합니다!',
        rating: 4.8,
        likes: 156,
        replies: 8,
      },
    ];
    setImageCommentCards(tempData);
  }, []);

  return (
    <div className="component-demo">
      <h4>Comment Card Components</h4>
      <div className="row">
        {imageCommentCards.map((imageCommentCard) => (
          <div key={imageCommentCard.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <ImageCommentCard
              username={imageCommentCard.username}
              movieTitle={imageCommentCard.movieTitle}
              comment={imageCommentCard.comment}
              rating={imageCommentCard.rating}
              likes={imageCommentCard.likes}
              replies={imageCommentCard.replies}
              onLikeClick={() => alert('좋아요 클릭!')}
              onReplyClick={() => alert('댓글 클릭!')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
