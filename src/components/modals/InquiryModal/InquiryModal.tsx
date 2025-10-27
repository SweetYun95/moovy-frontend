import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../../common/Button/ButtonStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import type { SelectorOption } from '../../common/Selector/SelectorStyle';
import { Textarea } from '../../common/Textarea/TextareaStyle';
import { createInquiry } from '../../../services/api/inquiryApi';
import './InquiryModal.scss';

/**
 사용법
 <InquiryModalComponent 
   isOpen={isOpen} 
   onClose={onClose} 
 />
 */

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; content: string }) => void;
  title?: string;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = '1:1 문의하기',
}) => {
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const categoryOptions: SelectorOption[] = [
    { value: 'general', label: '일반 문의' },
    { value: 'technical', label: '기술 지원' },
    { value: 'account', label: '계정 문의' },
    { value: 'report', label: '신고' },
    { value: 'other', label: '기타' },
  ];

  const handleSubmit = () => {
    if (!category || !content.trim()) {
      return;
    }
    onSubmit({ category, content });
    handleClose();
  };

  const handleClose = () => {
    setCategory('');
    setContent('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="870px" showCloseButton={true}>
      <div className="inquiry-modal">
        <div className="row">
          <div className="col-12">
            <div className="inquiry-modal__field">
              <label className="inquiry-modal__label">분류</label>
              <Selector
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="처리 상태"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="inquiry-modal__field">
              <label className="inquiry-modal__label">문의 내용</label>
              <Textarea
                placeholder="문의사항을 적어주세요."
                value={content}
                onChange={setContent}
                rows={8}
                maxLength={10000}
                showCounter
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="inquiry-modal__actions">
              <Button variant="primary" onClick={handleSubmit} fullWidth>
                확인
              </Button>
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
