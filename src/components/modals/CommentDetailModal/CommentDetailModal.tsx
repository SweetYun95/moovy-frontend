// moovy-frontend/src/components/modals/CommentDetailModal/CommentDetailModal.tsx
// 외부 라이브러리
import React, { useEffect, useRef, useState } from "react";

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createReplyThunk,
  deleteReplyThunk,
  updateReplyThunk,
  getRepliesByComment,
  selectRepliesByComment,
  selectRepliesLoading,
} from "@/features/reply/replySlice";
import type { Reply } from "@/features/reply/replySlice";

// 컴포넌트
import Modal from "../Modal/Modal";
import { OriginalComment } from "./OriginalComment";
import { ReplyForm } from "./ReplyForm";
import { ReplyList, type ReplyItem } from "./ReplyList";

// 스타일
import "./CommentDetailModal.scss";

export interface CommentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentData: {
    id: number; // 코멘트 ID (대댓글 조회/작성용) - 필수로 변경
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

// Reply → ReplyItem 변환 유틸(로그인 유저 ID로 내 댓글 여부 표시)
const convertReplyToReplyItem = (
  reply: Reply,
  myUserId?: number,
): ReplyItem => {
  const author = reply.User || reply.user;
  return {
    id: reply.reply_id,
    username: author?.name || "유저닉네임",
    content: reply.content,
    likes: 0, // TODO: API 응답에 likes 필드 추가 시 업데이트
    profileImageUrl: undefined, // TODO: API 응답에 프로필 이미지 추가 시 업데이트
    isMyComment: myUserId ? reply.user_id === myUserId : false,
  };
};

export const CommentDetailModal: React.FC<CommentDetailModalProps> = ({
  isOpen,
  onClose,
  commentData,
  comments: initialComments = [],
}) => {
  const dispatch = useAppDispatch();
  const commentId = commentData.id;

  // 로그인 유저
  const myUserId = useAppSelector((s) => s.auth.user?.id);

  // replySlice에서 대댓글 데이터/로딩 가져오기
  const repliesFromStore = useAppSelector((state) =>
    selectRepliesByComment(state, commentId),
  );
  const loading = useAppSelector((state) =>
    selectRepliesLoading(state, commentId),
  );

  const [collapsed, setCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 대댓글 조회
  useEffect(() => {
    if (isOpen && commentId) {
      dispatch(getRepliesByComment({ commentId, page: 1, size: 20 }));
    }
  }, [isOpen, commentId, dispatch]);

  // Reply → ReplyItem 변환
  const repliesList: ReplyItem[] =
    repliesFromStore.length > 0
      ? repliesFromStore.map((r) => convertReplyToReplyItem(r, myUserId))
      : initialComments;

  const handleSubmit = async (content: string, isPrivate: boolean) => {
    if (!commentId) {
      console.error("코멘트 ID가 없습니다.");
      return;
    }
    try {
      const result = await dispatch(
        createReplyThunk({
          comment_id: commentId,
          content,
        }),
      );

      if (createReplyThunk.fulfilled.match(result)) {
        // 성공 시 대댓글 목록 다시 조회
        await dispatch(getRepliesByComment({ commentId, page: 1, size: 20 }));
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error("대댓글 작성 실패:", error);
    }
  };

  const handleDelete = async (replyId: number) => {
    const ok = window.confirm("정말 삭제할까요?");
    if (!ok) return;
    try {
      const res = await dispatch(deleteReplyThunk({ reply_id: replyId }));
      if (deleteReplyThunk.fulfilled.match(res)) {
        await dispatch(getRepliesByComment({ commentId, page: 1, size: 20 }));
      }
    } catch (err) {
      console.error("대댓글 삭제 실패:", err);
    }
  };

  const handleEdit = async (replyId: number, nextContent: string) => {
    try {
      const res = await dispatch(
        updateReplyThunk({ reply_id: replyId, content: nextContent }),
      );
      if (updateReplyThunk.fulfilled.match(res)) {
        await dispatch(getRepliesByComment({ commentId, page: 1, size: 20 }));
      }
    } catch (err) {
      console.error("대댓글 수정 실패:", err);
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

        {loading ? (
          <p style={{ padding: 16 }}>불러오는 중...</p>
        ) : (
          <ReplyList
            replies={repliesList}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>
    </Modal>
  );
};

export default CommentDetailModal;
