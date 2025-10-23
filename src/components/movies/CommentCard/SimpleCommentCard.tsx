import React from 'react';
import './SimpleCommentCard.scss';
import { Icon } from '@iconify/react';

/**
 * SimpleCommentCard Props:
 * - username: string (사용자 닉네임)
 * - comment: string (코멘트 내용)
 * - rating: number (평점)
 * - likes: number (좋아요 수)
 * - replies: number (댓글 수)
 * - profileImageUrl?: string (프로필 이미지 URL)
 * - className?: string (추가 CSS 클래스)
 * - onLikeClick?: () => void (좋아요 버튼 클릭 핸들러)
 * - onReplyClick?: () => void (댓글 버튼 클릭 핸들러)
 */

export interface SimpleCommentCardProps {
  username: string;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
  profileImageUrl?: string;
  className?: string;
  onLikeClick?: () => void;
  onReplyClick?: () => void;
}

export const SimpleCommentCard: React.FC<SimpleCommentCardProps> = ({
  username,
  comment,
  rating,
  likes,
  replies,
  profileImageUrl,
  className = '',
  onLikeClick,
  onReplyClick,
}) => {
  const renderStarIcon = () => {
    return <Icon icon="mdi:star" width="16" height="16" style={{ color: '#FFD60A' }} />;
  };

  return (
    <div className={`simple-comment-card ${className}`}>
      <div className="simple-comment-card__header">
        <div className="simple-comment-card__profile">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={username}
              className="simple-comment-card__profile-image"
            />
          ) : (
            <div className="simple-comment-card__profile-placeholder">
              <Icon icon="mdi:account" width="20" height="20" />
            </div>
          )}
          <span className="simple-comment-card__username">{username}</span>
        </div>
        <div className="simple-comment-card__rating">
          {renderStarIcon()}
          <span className="simple-comment-card__rating-text">{rating}</span>
        </div>
      </div>
      
      <div className="simple-comment-card__content">
        <p className="simple-comment-card__text">{comment}</p>
      </div>
      
      <div className="simple-comment-card__actions">
        <button 
          className="simple-comment-card__action-button simple-comment-card__action-button--like"
          onClick={onLikeClick}
        >
          <span>좋아요 {likes}개</span>
        </button>
        
        <button 
          className="simple-comment-card__action-button simple-comment-card__action-button--reply"
          onClick={onReplyClick}
        >
          <span>댓글 {replies}</span>
        </button>
      </div>
      
      <div className="simple-comment-card__icon-actions">
        <button 
          className="simple-comment-card__icon-button simple-comment-card__icon-button--like"
          onClick={onLikeClick}
        >
          <Icon icon="mdi:heart-outline" width="24" height="24" />
        </button>
        
        <button 
          className="simple-comment-card__icon-button simple-comment-card__icon-button--reply"
          onClick={onReplyClick}
        >
          <Icon icon="mdi:comment-outline" width="24" height="24" />
        </button>
      </div>
    </div>
  );
};

export default SimpleCommentCard;

