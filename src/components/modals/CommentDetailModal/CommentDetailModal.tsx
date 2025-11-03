// 외부 라이브러리
import React, { useEffect, useRef, useState } from 'react';

// 스타일
import './CommentDetailModal.scss';

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createReplyThunk, getRepliesByComment, selectRepliesByComment } from '@/features/reply/replySlice';
import type { Reply } from '@/features/reply/replySlice';

// 컴포넌트
import Modal from '../Modal/Modal';
import { OriginalComment } from './OriginalComment';
import { ReplyForm } from './ReplyForm';
import { ReplyList, type ReplyItem } from './ReplyList';

export interface CommentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentData: {
    id?: number; // 코멘트 ID (대댓글 조회용)
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

// Reply 타입을 ReplyItem으로 변환하는 유틸 함수
const convertReplyToReplyItem = (reply: Reply): ReplyItem => {
  const author = reply.User || reply.user;
  return {
    id: reply.reply_id,
    username: author?.name || '유저닉네임',
    content: reply.content,
    likes: 0, // TODO: API 응답에 likes 필드 추가 시 업데이트
    profileImageUrl: undefined, // TODO: API 응답에 프로필 이미지 추가 시 업데이트
    isMyComment: false, // TODO: 현재 사용자와 비교하여 설정
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
  
  // replySlice에서 대댓글 데이터 가져오기
  const repliesFromStore = useAppSelector((state) => 
    commentId ? selectRepliesByComment(state, commentId) : []
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

  // Reply를 ReplyItem으로 변환
  const repliesList: ReplyItem[] = repliesFromStore.length > 0
    ? repliesFromStore.map(convertReplyToReplyItem)
    : initialComments;

  const handleSubmit = async (content: string, isPrivate: boolean) => {
    if (!commentId) {
      console.error('코멘트 ID가 없습니다.');
      return;
    }

    try {
      const result = await dispatch(
        createReplyThunk({ 
          comment_id: commentId, 
          content
        })
      );
      
      if (createReplyThunk.fulfilled.match(result)) {
        // 성공 시 대댓글 목록 다시 조회
        await dispatch(getRepliesByComment({ commentId, page: 1, size: 20 }));
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
    }
  };

  // 스크롤 시 작성 영역 접기/펼치기
  useEffect(() => {
    const container = scrollerRef.current?.closest('.modal-content') as HTMLElement | null;
    if (!container) return;
    const onScroll = () => {
      setCollapsed(container.scrollTop > 40);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
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

        <div className={collapsed ? 'reply-form--collapsed' : ''}>
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

