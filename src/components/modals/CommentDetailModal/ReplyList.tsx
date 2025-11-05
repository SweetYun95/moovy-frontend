// moovy-frontend/src/components/modals/CommentDetailModal/ReplyList.tsx
import React from "react";
import { Icon } from "@iconify/react";
import "./ReplyList.scss";

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
  onDelete?: (replyId: number) => void;
  onEdit?: (replyId: number, nextContent: string) => void;
  onReport?: (replyId: number) => void;
  onLike?: (replyId: number) => void;
}

export const ReplyList: React.FC<ReplyListProps> = ({
  replies,
  onDelete,
  onEdit,
  onReport,
  onLike,
}) => {
  if (replies.length === 0) {
    return <p className="reply-list__no-comments">아직 댓글이 없습니다.</p>;
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
              <div className="reply-list__avatar-placeholder" aria-hidden>
                <Icon icon="mdi:account" width="20" height="20" />
              </div>
            )}
            <span className="reply-list__username">{reply.username}</span>
          </div>

          <p className="reply-list__text">{reply.content}</p>

          <div className="reply-list__footer">
            <button
              type="button"
              className="reply-list__likes"
              onClick={() => onLike?.(reply.id)}
              aria-label="좋아요"
            >
              <Icon icon="mdi:heart-outline" width="16" height="16" />
              <span>좋아요 {reply.likes}개</span>
            </button>

            {reply.isMyComment ? (
              <div className="reply-list__actions">
                <button
                  type="button"
                  className="reply-list__action-link reply-list__action-link--delete"
                  onClick={() => onDelete?.(reply.id)}
                >
                  삭제
                </button>
                <button
                  type="button"
                  className="reply-list__action-link reply-list__action-link--edit"
                  onClick={() => {
                    const v = window.prompt(
                      "수정할 내용을 입력하세요.",
                      reply.content,
                    );
                    if (v && v.trim()) onEdit?.(reply.id, v.trim());
                  }}
                >
                  수정
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="reply-list__action-link reply-list__action-link--report"
                onClick={() => onReport?.(reply.id)}
              >
                신고
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplyList;
