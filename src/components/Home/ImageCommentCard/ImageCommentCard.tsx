import React from 'react';

import './ImageCommentCard.scss';
import { Icon } from '@iconify/react';
import type { CommentItem } from '@/features/comments/commentSlice';

export interface ImageCommentCardProps {
  username: string;
  movieTitle?: string;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
  profileImageUrl?: string;
  movieImageUrl?: string;
  className?: string;
  commentItem?: CommentItem; // CommentItem 데이터 (onClick에 자동 전달)
  onLikeClick?: () => void;
  onReplyClick?: () => void;
  onClick?: (commentItem?: CommentItem) => void; // 카드 전체 클릭 핸들러 (commentItem 자동 전달)
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
  commentItem,
  onLikeClick,
  onReplyClick,
  onClick,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(likes);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLikeClick) {
      onLikeClick();
    }
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(commentItem);
    }
    if (onReplyClick) {
      onReplyClick();
    }
  };

  const handleReplyIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(commentItem);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // 좋아요 버튼 클릭 시에는 모달이 열리지 않도록
    const clickedLikeButton = target.closest('.comment-card__icon-button--like');
    if (clickedLikeButton) {
      return;
    }
    
    // 댓글 버튼이나 아이콘은 각각의 핸들러가 처리하므로 여기서는 무시
    const clickedButton = target.closest('button');
    if (clickedButton) {
      return;
    }
    
    // 카드의 다른 영역 클릭 시 모달 열기
    if (onClick) {
      onClick(commentItem);
    }
  };

  const renderStarIcon = () => {
    return <Icon icon="mdi:star" width="16" height="16" style={{ color: '#FFD60A' }} />;
  };

  // 이미지 표시 여부 결정 (movieImageUrl이 있으면 이미지 표시)
  const showImage = !!movieImageUrl;

  return (
    <div 
      className={`comment-card ${className}`}
      onClick={handleCardClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
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
      
      {showImage ? (
        // 이미지가 있는 경우: 영화 이미지와 제목 포함 레이아웃
        <div className="comment-card__main-content">
          <div className="comment-card__movie-image">
            <img 
              src={movieImageUrl} 
              alt={movieTitle}
              className="comment-card__movie-poster"
            />
          </div>
          
          <div className="comment-card__content">
            <h4 className="comment-card__movie-title">{movieTitle}</h4>
            <p className="comment-card__text">{comment}</p>
          </div>
        </div>
      ) : (
        // 이미지가 없는 경우: 텍스트만 표시 (CommentCard 스타일)
        <div className="comment-card__content">
          <p className="comment-card__text">{comment}</p>
        </div>
      )}
      
      <div className="comment-card__footer">
        <div className="comment-card__actions">
          <span 
            className="comment-card__action-button comment-card__action-button--like"
            aria-hidden="true"
          >
            <span>좋아요 {likeCount}</span>
          </span>
          
          <button 
            className="comment-card__action-button comment-card__action-button--reply"
            onClick={handleReplyClick}
          >
            <span>댓글 {replies}</span>
          </button>
        </div>
        
        <div className="comment-card__icon-actions">
          <button 
            className={`comment-card__icon-button comment-card__icon-button--like ${isLiked ? 'comment-card__icon-button--liked' : ''}`}
            onClick={handleLikeClick}
          >
            <Icon icon={isLiked ? "mdi:heart" : "mdi:heart-outline"} width="24" height="24" style={{ color: isLiked ? '#FF3040' : 'inherit' }} />
          </button>
          
          <button 
            className="comment-card__icon-button comment-card__icon-button--reply"
            onClick={handleReplyIconClick}
          >
            <Icon icon="mdi:comment-outline" width="24" height="24" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCommentCard;
