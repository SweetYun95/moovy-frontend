<<<<<<< HEAD
import React, { useState } from "react";
=======
// moovy-frontend/src/components/modals/CommentDetailModal/ReplyForm.tsx
import React, { useMemo, useState } from "react";
>>>>>>> 7672aefd92d86767c5018ec716ee37d54cdec122
import { Icon } from "@iconify/react";
import { ActionButton } from "../../common/Button/Button";
import "./ReplyForm.scss";

export interface ReplyFormProps {
  onSubmit: (content: string, isPrivate: boolean) => void;
  onCancel: () => void;

  // 옵션(UX 강화)
  isSubmitting?: boolean; // 제출 중 버튼/입력 비활성화
  maxLength?: number; // 글자 수 제한 (기본 1000)
  currentUserName?: string; // 표시용 유저명
  currentUserAvatarUrl?: string; // 표시용 아바타
  autoFocus?: boolean; // 포커스 자동 이동
}

<<<<<<< HEAD
export const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, onCancel }) => {
=======
export const ReplyForm: React.FC<ReplyFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  maxLength = 1000,
  currentUserName = "유저닉네임",
  currentUserAvatarUrl,
  autoFocus = false,
}) => {
>>>>>>> 7672aefd92d86767c5018ec716ee37d54cdec122
  const [commentText, setCommentText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const trimmed = useMemo(() => commentText.trim(), [commentText]);
  const used = commentText.length;
  const canSubmit = trimmed.length > 0 && !isSubmitting;

  const handleSubmit = () => {
<<<<<<< HEAD
    if (commentText.trim()) {
      onSubmit(commentText, isPrivate);
      setCommentText("");
      setIsPrivate(false);
=======
    if (!canSubmit) return;
    onSubmit(trimmed, isPrivate);
    setCommentText("");
    setIsPrivate(false);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    const isCmdEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
    if (isCmdEnter) {
      e.preventDefault();
      handleSubmit();
>>>>>>> 7672aefd92d86767c5018ec716ee37d54cdec122
    }
  };

  return (
    <div className="reply-form">
      <div className="reply-form__header">
        <div className="reply-form__user">
          {currentUserAvatarUrl ? (
            <img
              src={currentUserAvatarUrl}
              alt={currentUserName}
              className="reply-form__avatar"
            />
          ) : (
            <div className="reply-form__avatar-placeholder" aria-hidden>
              <Icon icon="mdi:account" width="24" height="24" />
            </div>
          )}
          <span className="reply-form__username">{currentUserName}</span>
        </div>

        <label className="reply-form__checkbox">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            disabled={isSubmitting}
          />
          <span>나만보기</span>
        </label>
      </div>

      <textarea
        className="reply-form__textarea"
        placeholder="댓글을 입력하세요. (Ctrl/⌘ + Enter 제출)"
        value={commentText}
        maxLength={maxLength} // 네이티브 제한(모바일/스크린리더 호환 ↑)
        onChange={(e) => {
          const v = e.target.value;
          if (v.length <= maxLength) setCommentText(v);
        }}
        onKeyDown={handleKeyDown}
        rows={4}
        disabled={isSubmitting}
        aria-label="대댓글 입력"
        aria-disabled={isSubmitting}
        autoFocus={autoFocus}
      />

<<<<<<< HEAD
      <div className="reply-form__buttons">
        <ActionButton action="confirm" onClick={handleSubmit}>
          작성
        </ActionButton>
        <ActionButton action="cancel" onClick={onCancel}>
          취소
        </ActionButton>
=======
      <div className="reply-form__footer">
        <span className="reply-form__counter" aria-live="polite">
          {used} / {maxLength}
        </span>
        <div className="reply-form__buttons">
          <ActionButton
            action="confirm"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? "작성 중..." : "작성"}
          </ActionButton>
          <ActionButton
            action="cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </ActionButton>
        </div>
>>>>>>> 7672aefd92d86767c5018ec716ee37d54cdec122
      </div>
    </div>
  );
};

export default ReplyForm;
