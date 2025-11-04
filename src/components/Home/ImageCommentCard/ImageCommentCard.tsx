import React from 'react';

import './ImageCommentCard.scss';
import { Icon } from '@iconify/react';

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
  onLikeClick?: () => void;
  onReplyClick?: () => void;
  onClick?: () => void; // 카드 전체 클릭 핸들러 (CommentCard와 통일)
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
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    // 댓글 액션 버튼 클릭 시 모달 열기
    if (onClick) {
      onClick();
    }
    // 기존 onReplyClick도 호출 (필요한 경우)
    if (onReplyClick) {
      onReplyClick();
    }
  };

  // 댓글 아이콘 클릭 핸들러 (모달 열기)
  const handleReplyIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    // 댓글 아이콘 클릭 시 모달 열기
    if (onClick) {
      onClick();
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 클릭된 요소가 버튼 또는 버튼의 자식 요소인지 확인
    const target = e.target as HTMLElement;
    
    // 버튼 영역 내부를 클릭한 경우만 무시
    const clickedButton = target.closest('button');
    const isInsideActions = target.closest('.comment-card__actions');
    const isInsideIconActions = target.closest('.comment-card__icon-actions');
    
    // 액션 버튼이나 아이콘 액션 영역 내부의 버튼이 아닌 경우에만 클릭 처리
    if (clickedButton || (isInsideActions && target.closest('button')) || (isInsideIconActions && target.closest('button'))) {
      // 버튼 클릭은 기존 핸들러가 처리하도록 stopPropagation만 호출
      return;
    }
    
    // 카드의 다른 영역(텍스트, 헤더 등)을 클릭한 경우
    if (onClick) {
      onClick();
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
