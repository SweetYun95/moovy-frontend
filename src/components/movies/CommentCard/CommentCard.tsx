import React from 'react';
import './CommentCard.scss';
import { Icon } from '@iconify/react';

export interface CommentCardProps {
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

export const CommentCard: React.FC<CommentCardProps> = ({
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
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(likes);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLikeClick) {
      onLikeClick();
    }
  };

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
      
      <div className="comment-card__content">
        <p className="comment-card__text">{comment}</p>
      </div>
      
      <div className="comment-card__actions">
        <button 
          className="comment-card__action-button comment-card__action-button--like"
          onClick={handleLikeClick}
        >
          <span>좋아요 {likeCount}개</span>
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
          className={`comment-card__icon-button comment-card__icon-button--like ${isLiked ? 'comment-card__icon-button--liked' : ''}`}
          onClick={handleLikeClick}
        >
          <Icon icon={isLiked ? "mdi:heart" : "mdi:heart-outline"} width="24" height="24" style={{ color: isLiked ? '#FF3040' : 'inherit' }} />
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

export default CommentCard;
