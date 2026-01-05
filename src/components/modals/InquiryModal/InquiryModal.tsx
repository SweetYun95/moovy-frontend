import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { ActionButton } from '../../common/Button/Button';
import { Button } from '../../common/Button/ButtonStyle';
import { InquirySelector } from '../../common/Selector/SelectorComponents';
import { Textarea } from '../../common/Textarea/TextareaStyle';
import { createInquiry, INQUIRY_CATEGORY_OPTIONS } from '../../../services/api/inquiryApi';
import './InquiryModal.scss';

/**
 사용법
// 일반 사용자 모드
<InquiryModalComponent 
   isOpen={isOpen} 
   onClose={onClose} 
 />

// 관리자 모드
<InquiryModal 
   isOpen={isOpen} 
   onClose={onClose}
   mode="admin"
   inquiryData={{ category: 'general', content: '문의 내용', initialReply: '답변 내용' }}
   onSubmit={(data) => console.log(data)}
   onReport={() => console.log('신고')}
 />
 */

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; content: string; reply?: string }) => void;
  title?: string;
  mode?: 'user' | 'admin';
  inquiryData?: { category: string; content: string; initialReply?: string };
  onReport?: () => void;
  readOnly?: boolean;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  mode = 'user',
  inquiryData,
  onReport,
  readOnly = false,
}) => {
  const defaultTitle = mode === 'admin' ? '문의 관리' : '1:1 문의하기';
  
  const [category, setCategory] = useState(inquiryData?.category || '');
  const [content, setContent] = useState(inquiryData?.content || '');
  const [reply, setReply] = useState(inquiryData?.initialReply || '');

  // 카테고리 value를 label로 변환
  const getCategoryLabel = (value: string) => {
    const option = INQUIRY_CATEGORY_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const handleSubmit = () => {
    if (!category || !content.trim()) {
      return;
    }
    if (mode === 'admin' && !reply.trim()) {
      return;
    }
    onSubmit({ category, content, reply: mode === 'admin' ? reply : undefined });
    handleClose();
  };

  const handleClose = () => {
    setCategory('');
    setContent('');
    setReply('');
    onClose();
  };

  const modalTitle = title || defaultTitle;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle} size="870px" showCloseButton={true}>
      <div className="inquiry-modal">
        <div className="row">
          <div className="col-12">
            <div className="inquiry-modal__field">
              <label className="form-label">분류</label>
              {mode === 'admin' ? (
                <div className="inquiry-modal__readonly-value">{getCategoryLabel(inquiryData?.category || '')}</div>
              ) : (
                <InquirySelector
                  value={category}
                  onChange={setCategory}
                  placeholder="처리 상태"
                />
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="inquiry-modal__field">
              <label className="form-label">문의 내용</label>
              {mode === 'admin' ? (
                <div className="inquiry-modal__readonly-value">{inquiryData?.content}</div>
              ) : (
                <Textarea
                  placeholder="문의사항을 적어주세요."
                  value={content}
                  onChange={setContent}
                  rows={8}
                  maxLength={10000}
                  showCounter
                />
              )}
            </div>
          </div>
        </div>

        {mode === 'admin' && (
          <div className="row">
            <div className="col-12">
              <div className="inquiry-modal__field">
                <label className="form-label">답변 내용</label>
                {readOnly ? (
                  <div className="inquiry-modal__readonly-value">{reply || "답변 내용이 없습니다."}</div>
                ) : (
                  <Textarea
                    placeholder="답변내용을 적어주세요."
                    value={reply}
                    onChange={setReply}
                    rows={8}
                    maxLength={10000}
                    showCounter
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="inquiry-modal__actions">
              {mode === 'admin' && onReport && !readOnly && (
                <Button variant="danger" onClick={onReport}>
                  신고
                </Button>
              )}
              {!readOnly && (
                <ActionButton action="confirm" onClick={handleSubmit}>
                  확인
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InquiryModal;

// Component wrapper with API integration
export function InquiryModalComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { category: string; content: string }) => {
    setIsLoading(true);
    try {
      await createInquiry({
        category: data.category,
        content: data.content,
      });
      onClose();
    } catch (error) {
      console.error('문의 제출 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InquiryModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
