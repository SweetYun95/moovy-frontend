import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../../common/Button/ButtonStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import type { SelectorOption } from '../../common/Selector/SelectorStyle';
import { createReport, type ReportCategory } from '../../../services/api/commentApi';
import './ReportModal.scss';
import { Icon } from '@iconify/react';

/**
 사용법
 <ReportModalComponent 
   isOpen={isOpen} 
   onClose={onClose} 
   targetType="user"
   targetId={123}
   targetUser={{ name: '홍길동', reportCount: 5 }}
 />
 */

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: string) => void;
  targetUser?: {
    name: string;
    reportCount: number;
  };
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetUser,
}) => {
  const [category, setCategory] = useState('');

  const categoryOptions: SelectorOption[] = [
    { value: 'spam', label: '스팸' },
    { value: 'abuse', label: '욕설/비방' },
    { value: 'inappropriate', label: '부적절한 콘텐츠' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' },
  ];

  const handleSubmit = () => {
    if (!category) {
      return;
    }
    onSubmit(category);
    handleClose();
  };

  const handleClose = () => {
    setCategory('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="480px" 
      showCloseButton={true} 
      titleAlign="center"
      title={
        <>
          신고하기 <Icon icon="mdi:alert" className="report-modal__icon" />
        </>
      }
    >
      <div className="report-modal">
        {targetUser && (
          <div className="row">
            <div className="col-12">
              <div className="report-modal__target">
                <div className="report-modal__target-info">
                  <span className="report-modal__target-name">{targetUser.name}</span>
                  <span className="report-modal__target-count">
                    관리자 경고 {targetUser.reportCount}회
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="report-modal__field">
              <Selector
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="분류"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="report-modal__actions">
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

export default ReportModal;

// Component wrapper with API integration
export function ReportModalComponent({ 
  isOpen, 
  onClose,
  targetType,
  targetId,
  targetUser 
}: { 
  isOpen: boolean
  onClose: () => void
  targetType?: 'user' | 'comment' | 'content'
  targetId?: number
  targetUser?: {
    name: string
    reportCount: number
  }
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (category: string) => {
    if (!targetType || !targetId) {
      console.error('신고 대상이 지정되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await createReport({
        category: category as ReportCategory,
        targetType: targetType,
        targetId: targetId,
      });
      alert('신고가 접수되었습니다.');
      onClose();
    } catch (error) {
      console.error('신고 제출 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      targetUser={targetUser}
    />
  );
}
