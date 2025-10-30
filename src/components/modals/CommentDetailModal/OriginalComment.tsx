import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './OriginalComment.scss';

export interface OriginalCommentProps {
  username: string;
  date: string;
  content: string;
  likes: number;
  replies: number;
  profileImageUrl?: string;
  onCommentClick?: () => void;
}

export const OriginalComment: React.FC<OriginalCommentProps> = ({
  username,
  date,
  content,
  likes,
  replies,
  profileImageUrl,
  onCommentClick,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
  };

  return (
    <div className="original-comment">
      <div className="original-comment__header">
        <div className="original-comment__user">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={username}
              className="original-comment__avatar"
            />
          ) : (
            <div className="original-comment__avatar-placeholder">
              <Icon icon="mdi:account" width="24" height="24" />
            </div>
          )}
          <span className="original-comment__username">{username}님의 한마디</span>
        </div>
        <span className="original-comment__date">{date}</span>
      </div>
      
      <p className="original-comment__content">{content}</p>
      
      <div className="original-comment__engagement">
        <div className="original-comment__engagement-buttons">
          <button 
            className="original-comment__icon-button"
            onClick={handleLikeClick}
          >
            <Icon 
              icon={isLiked ? "mdi:heart" : "mdi:heart-outline"} 
              width="24" 
              height="24" 
            />
          </button>
          <span>좋아요 {currentLikes}개</span>
          <button 
            className="original-comment__icon-button"
            onClick={onCommentClick}
          >
            <Icon icon="mdi:comment-outline" width="24" height="24" />
          </button>
          <span>댓글 {replies}</span>
        </div>
        <button className="original-comment__report-button">신고</button>
      </div>
    </div>
  );
};

export default OriginalComment;

