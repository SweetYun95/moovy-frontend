import React from 'react';
import { Icon } from '@iconify/react';
import './ReplyList.scss';

export interface ReplyItem {
  id: number;
  username: string;
  content: string;
  likes: number;
  profileImageUrl?: string;
  isMyComment?: boolean;
}

export interface ReplyListProps {
  replies: ReplyItem[];
}

export const ReplyList: React.FC<ReplyListProps> = ({ replies }) => {
  if (replies.length === 0) {
    return (
      <p className="reply-list__no-comments">아직 댓글이 없습니다.</p>
    );
  }

  return (
    <div className="reply-list">
      {replies.map((reply) => (
        <div key={reply.id} className="reply-list__item">
          <div className="reply-list__user">
            {reply.profileImageUrl ? (
              <img 
                src={reply.profileImageUrl} 
                alt={reply.username}
                className="reply-list__avatar"
              />
            ) : (
              <div className="reply-list__avatar-placeholder">
                <Icon icon="mdi:account" width="20" height="20" />
              </div>
            )}
            <span className="reply-list__username">{reply.username}</span>
          </div>
          
          <p className="reply-list__text">{reply.content}</p>
          
          <div className="reply-list__footer">
            <span className="reply-list__likes">
              <Icon icon="mdi:heart-outline" width="16" height="16" />
              좋아요 {reply.likes}개
            </span>
            
            {reply.isMyComment ? (
              <div className="reply-list__actions">
                <button className="reply-list__action-link reply-list__action-link--delete">삭제</button>
                <button className="reply-list__action-link reply-list__action-link--edit">수정</button>
              </div>
            ) : (
              <button className="reply-list__action-link reply-list__action-link--report">신고</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplyList;

