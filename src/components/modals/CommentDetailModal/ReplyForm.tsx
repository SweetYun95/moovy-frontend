import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { ActionButton } from "../../common/Button/Button";
import "./ReplyForm.scss";

export interface ReplyFormProps {
  onSubmit: (content: string, isPrivate: boolean) => void;
  onCancel: () => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, onCancel }) => {
  const [commentText, setCommentText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit(commentText, isPrivate);
      setCommentText("");
      setIsPrivate(false);
    }
  };

  return (
    <div className="reply-form">
      <div className="reply-form__header">
        <div className="reply-form__user">
          <div className="reply-form__avatar-placeholder">
            <Icon icon="mdi:account" width="24" height="24" />
          </div>
          <span className="reply-form__username">유저닉네임</span>
        </div>
        <label className="reply-form__checkbox">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <span>나만보기</span>
        </label>
      </div>

      <textarea
        className="reply-form__textarea"
        placeholder="댓글 작성필드"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={4}
      />

      <div className="reply-form__buttons">
        <ActionButton action="confirm" onClick={handleSubmit}>
          작성
        </ActionButton>
        <ActionButton action="cancel" onClick={onCancel}>
          취소
        </ActionButton>
      </div>
    </div>
  );
};

export default ReplyForm;
