import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { ActionButton } from '../../common/Button/Button';
import { Toggle } from '../../common/Toggle/Toggle';
import { Textarea } from '../../common/Textarea/TextareaStyle';
import { createComment, updateComment } from '../../../services/api/commentApi';
import './CommentEditModal.scss';

/**
 사용법
// 생성 모드
<CommentEditModalComponent 
  isOpen={isOpen} 
  onClose={onClose} 
  movieId={123}
  mode="create"
/>

// 수정 모드
<CommentEditModalComponent 
  isOpen={isOpen} 
  onClose={onClose} 
  commentId={456}
  mode="edit"
/>
 */

export interface CommentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; isSpoiler: boolean }) => void;
  initialContent?: string;
  initialSpoiler?: boolean;
  mode?: 'create' | 'edit';
}

const CommentEditModal: React.FC<CommentEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialContent = '',
  initialSpoiler = false,
  mode = 'create',
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSpoiler, setSpoiler] = useState(initialSpoiler);

  const title = mode === 'create' ? '코멘트 작성하기' : '코멘트 수정하기';

  const handleSubmit = () => {
    if (!content.trim()) {
      return;
    }
    onSubmit({ content, isSpoiler });
    handleClose();
  };

  const handleClose = () => {
    if (mode === 'create') {
      setContent('');
      setSpoiler(false);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="994px" showCloseButton={true}>
      <div className="comment-edit-modal">
        <div className="row">
          <div className="col-12">
            <div className="comment-edit-modal__spoiler mb-2">
              <span className="comment-edit-modal__spoiler-label">스포일러</span>
              <Toggle checked={isSpoiler} onChange={setSpoiler} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="comment-edit-modal__field">
              <Textarea
                placeholder="코멘트를 작성해주세요"
                value={content}
                onChange={setContent}
                rows={12}
                maxLength={10000}
                showCounter
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="comment-edit-modal__actions">
              <ActionButton action="confirm" onClick={handleSubmit}>
                확인
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentEditModal;

// Component wrapper with API integration
export function CommentEditModalComponent({ 
  isOpen, 
  onClose, 
  commentId, 
  movieId,
  mode = 'create' 
}: { 
  isOpen: boolean
  onClose: () => void
  commentId?: number
  movieId?: number
  mode?: 'create' | 'edit'
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { content: string; isSpoiler: boolean }) => {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await createComment({
          content: data.content,
          isSpoiler: data.isSpoiler,
          movieId: movieId,
        });
      } else if (mode === 'edit' && commentId) {
        await updateComment(commentId, {
          content: data.content,
          isSpoiler: data.isSpoiler,
        });
      }
      onClose();
    } catch (error) {
      console.error('코멘트 저장 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommentEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      mode={mode}
    />
  );
}
