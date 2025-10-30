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
    return <Icon icon="mdi:star" width="16" height="16" style={{ color: '$warning-color' }} />;
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
        <span 
          className="comment-card__action-button comment-card__action-button--like"
          aria-hidden="true"
        >
          <span>좋아요 {likeCount}</span>
        </span>
        
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

export default ImageCommentCard;
