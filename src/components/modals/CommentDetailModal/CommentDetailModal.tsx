import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import "./CommentDetailModal.scss";
import { useAppDispatch } from "@/app/hooks";
import { createReplyThunk } from "@/features/comments/commentCardsSlice";
import { OriginalComment } from "./OriginalComment";
import { ReplyForm } from "./ReplyForm";
import { ReplyList, type ReplyItem } from "./ReplyList";

export interface CommentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentData: {
    username: string;
    date: string;
    content: string;
    likes: number;
    replies: number;
    profileImageUrl?: string;
  };
  comments?: Array<{
    id: number;
    username: string;
    content: string;
    likes: number;
    profileImageUrl?: string;
    isMyComment?: boolean;
  }>;
}

export const CommentDetailModal: React.FC<CommentDetailModalProps> = ({
  isOpen,
  onClose,
  commentData,
  comments: initialComments = [],
}) => {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(true);
  const [repliesList, setRepliesList] = useState<ReplyItem[]>(initialComments);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (content: string, isPrivate: boolean) => {
    try {
      const result = await dispatch(
        createReplyThunk({
          parentCommentId: (commentData as any).id || 0,
          content,
          isPrivate,
        }),
      );

      // 성공 여부와 관계없이 목록에 추가 (dev 모드)
      const newReply: ReplyItem = {
        id: Date.now(),
        username: "유저닉네임",
        content,
        likes: 0,
        isMyComment: true,
      };
      setRepliesList([...repliesList, newReply]);

      // 작성 완료 후 폼 숨김
      setShowReplyForm(false);
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  // 스크롤 시 작성 영역 접기/펼치기
  useEffect(() => {
    const container = scrollerRef.current?.closest(
      ".modal-content",
    ) as HTMLElement | null;
    if (!container) return;
    const onScroll = () => {
      setCollapsed(container.scrollTop > 40);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="870px"
      showCloseButton={true}
      className="comment-reply-modal-wrapper"
    >
      <div className="comment-reply-modal" ref={scrollerRef}>
        <OriginalComment
          username={commentData.username}
          date={commentData.date}
          content={commentData.content}
          likes={commentData.likes}
          replies={commentData.replies}
          profileImageUrl={commentData.profileImageUrl}
          onCommentClick={() => setShowReplyForm(!showReplyForm)}
        />

        <div className={collapsed ? "reply-form--collapsed" : ""}>
          {showReplyForm ? (
            <ReplyForm
              onSubmit={handleSubmit}
              onCancel={() => setShowReplyForm(false)}
            />
          ) : (
            <div className="reply-form-collapsed">
              <button
                className="reply-form-collapsed__button"
                onClick={() => setShowReplyForm(true)}
              >
                댓글입력하기...
              </button>
            </div>
          )}
        </div>

        <ReplyList replies={repliesList} />
      </div>
    </Modal>
  );
};

export default CommentDetailModal;
