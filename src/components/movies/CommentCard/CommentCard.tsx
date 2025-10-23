import React from 'react';
import './CommentCard.scss';
import { Icon } from '@iconify/react';

/**
 * CommentCard Props:
 * - username: string (사용자 닉네임)
 * - movieTitle: string (영화 제목)
 * - comment: string (코멘트 내용)
 * - rating: number (평점)
 * - likes: number (좋아요 수)
 * - replies: number (댓글 수)
 * - profileImageUrl?: string (프로필 이미지 URL)
 * - movieImageUrl?: string (영화 이미지 URL)
 * - className?: string (추가 CSS 클래스)
 * - onLikeClick?: () => void (좋아요 버튼 클릭 핸들러)
 * - onReplyClick?: () => void (댓글 버튼 클릭 핸들러)
 */

export interface CommentCardProps {
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

export const CommentCard: React.FC<CommentCardProps> = ({
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

export default CommentCard;
