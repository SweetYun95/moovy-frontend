// moovy-frontend/src/components/modals/CommentDetailModal/OriginalComment.tsx
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "./OriginalComment.scss";

export interface OriginalCommentProps {
  username: string;
  date: string;
  content: string;
  likes: number; // 현재 좋아요 수
  replies: number; // 현재 대댓글 수
  liked?: boolean; // 내가 좋아요 누른 상태(선택)
  profileImageUrl?: string;

  // 액션 콜백(선택)
  onCommentClick?: () => void; // 댓글 버튼 클릭
  onToggleLike?: (nextLiked: boolean) => void; // 좋아요 토글
  onReport?: () => void; // 신고 클릭
}

export const OriginalComment: React.FC<OriginalCommentProps> = ({
  username,
  date,
  content,
  likes,
  replies,
  liked = false,
  profileImageUrl,
  onCommentClick,
  onToggleLike,
  onReport,
}) => {
  // 내부 낙관적 상태
  const [isLiked, setIsLiked] = useState(liked);
  const [currentLikes, setCurrentLikes] = useState(likes);

  // 상위에서 likes/liked가 바뀌면 동기화
  useEffect(() => setIsLiked(liked), [liked]);
  useEffect(() => setCurrentLikes(likes), [likes]);

  const handleLikeClick = () => {
    const next = !isLiked;
    setIsLiked(next);
    setCurrentLikes((prev) => Math.max(0, prev + (next ? 1 : -1)));
    onToggleLike?.(next);
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
            <div className="original-comment__avatar-placeholder" aria-hidden>
              <Icon icon="mdi:account" width="24" height="24" />
            </div>
          )}
          <span className="original-comment__username">
            {username}님의 한마디
          </span>
        </div>
        <span className="original-comment__date">{date}</span>
      </div>

      <p className="original-comment__content">{content}</p>

      <div className="original-comment__engagement">
        <div className="original-comment__engagement-buttons">
          <button
            type="button"
            className="original-comment__icon-button"
            aria-pressed={isLiked}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            onClick={handleLikeClick}
          >
            <Icon
              icon={isLiked ? "mdi:heart" : "mdi:heart-outline"}
              width="24"
              height="24"
            />
          </button>
          <span aria-live="polite">좋아요 {currentLikes}개</span>

          <button
            type="button"
            className="original-comment__icon-button"
            aria-label="댓글 보기/쓰기"
            onClick={onCommentClick}
          >
            <Icon icon="mdi:comment-outline" width="24" height="24" />
          </button>
          <span>댓글 {replies}</span>
        </div>

        <button
          type="button"
          className="original-comment__report-button"
          onClick={onReport}
          aria-label="이 코멘트 신고하기"
        >
          신고
        </button>
      </div>
    </div>
  );
};

export default OriginalComment;
