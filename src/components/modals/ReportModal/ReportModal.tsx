import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { ActionButton } from '../../common/Button/Button';
import { ReportSelector, SanctionLevelSelector, ReportStatusSelector } from '../../common/Selector/SelectorComponents';
import { Textarea } from '../../common/Textarea/TextareaStyle';
import { UserProfileCard } from '../../common/UserProfileCard/UserProfileCard';
import { createReport, type ReportCategory } from '../../../services/api/commentApi';
import { getAdminUserProfile } from '../../../services/api/userApi';
import './ReportModal.scss';
import { Icon } from '@iconify/react';

/**
 사용법

// 일반 사용자 모드
<ReportModalComponent 
  isOpen={isOpen} 
  onClose={onClose} 
  targetType="user"
  targetId={123}
  targetUser={{ name: '홍길동', reportCount: 5 }}
/>

// 관리자 모드
<ReportModal 
  isOpen={isOpen} 
  onClose={onClose}
  mode="admin"
  reportData={{ category: 'spam', content: '신고 내용', targetUser: { name: '홍길동', reportCount: 5, avatar: 'url' } }}
  onSubmit={(data) => console.log(data)}
/>
 */

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; content?: string; sanctionLevel?: string; notification?: string }) => void;
  title?: string;
  mode?: 'user' | 'admin';
  reportData?: {
    category: string;
    content: string;
    targetUser?: {
      name: string;
      reportCount: number;
      avatar?: string;
    };
  };
  targetUser?: {
    name: string;
    reportCount: number;
  };
  onReportCountClick?: (data: Array<{ id: number; reason: string }>) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  mode = 'user',
  reportData,
  targetUser,
  onReportCountClick,
}) => {
  const defaultTitle = mode === 'admin' ? '신고관리' : '신고하기';
  
  const [category, setCategory] = useState(reportData?.category || '');
  const [content, setContent] = useState(reportData?.content || '');
  const [sanctionLevel, setSanctionLevel] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = () => {
    if (!category) {
      return;
    }
    
    const submitData: any = { category };
    if (mode === 'admin') {
      submitData.content = content;
      submitData.sanctionLevel = sanctionLevel;
      submitData.notification = notification;
    }
    
    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setCategory('');
    setContent('');
    setSanctionLevel('');
    setNotification('');
    onClose();
  };

  const modalTitle = title || defaultTitle;
  const displayTargetUser = reportData?.targetUser || targetUser;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="480px" 
      showCloseButton={true} 
      titleAlign="center"
      title={
        <>
          {modalTitle} <Icon icon="mdi:alert" className="report-modal__icon" />
        </>
      }
    >
      <div className="report-modal">
        {displayTargetUser && (
          <div className="row">
            <div className="col-12">
              <UserProfileCard
                name={displayTargetUser.name}
                reportCount={displayTargetUser.reportCount}
                avatar={reportData?.targetUser?.avatar}
                onReportCountClick={onReportCountClick}
              />
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="report-modal__field">
              <label className="form-label">분류</label>
              <ReportSelector
                value={category}
                onChange={setCategory}
                placeholder="분류"
              />
            </div>
          </div>
        </div>

        {mode === 'admin' && (
          <>
            <div className="row">
              <div className="col-12">
                <div className="report-modal__field">
                  <label className="form-label">신고내용을 적어주세요.</label>
                  <Textarea
                    placeholder="신고내용을 적어주세요."
                    value={content}
                    onChange={setContent}
                    rows={6}
                    maxLength={10000}
                    showCounter
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="report-modal__field">
                  <label className="form-label">제재강도</label>
                  <SanctionLevelSelector
                    value={sanctionLevel}
                    onChange={setSanctionLevel}
                    placeholder="제제단계"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="report-modal__field">
                  <label className="form-label">신고한 유저 알림 메시지</label>
                  <ReportStatusSelector
                    value={notification}
                    onChange={setNotification}
                    placeholder="처리 상태"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="row">
          <div className="col-12">
            <div className="report-modal__actions">
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

export default ReportModal;

// Component wrapper with API integration
export function ReportModalComponent({ 
  isOpen, 
  onClose,
  targetType,
  targetId,
  targetUser,
  targetUserId,
  onReportCountClick
}: { 
  isOpen: boolean
  onClose: () => void
  targetType?: 'user' | 'comment' | 'content'
  targetId?: number
  targetUser?: {
    name: string
    reportCount: number
  }
  targetUserId?: number
  onReportCountClick?: (data: Array<{ id: number; reason: string }>) => void
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<{ name: string; reportCount: number } | undefined>(undefined);

  // 유저 대상 신고인 경우 사용자 정보 로드
  React.useEffect(() => {
    const load = async () => {
      if (isOpen && targetType === 'user' && targetUserId && !targetUser) {
        try {
          const user = await getAdminUserProfile(targetUserId);
          setFetchedUser({ name: user.name || user.nickname || '사용자', reportCount: user.reportCount || 0 });
        } catch (e) {
          console.error('신고 대상 사용자 로드 실패:', e);
          setFetchedUser(undefined);
        }
      }
    };
    load();
  }, [isOpen, targetType, targetUserId, targetUser]);

  const handleSubmit = async (data: { category: string; content?: string; sanctionLevel?: string; notification?: string }) => {
    if (!targetType || !targetId) {
      console.error('신고 대상이 지정되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await createReport({
        category: data.category as ReportCategory,
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
      targetUser={targetUser || fetchedUser}
      onReportCountClick={onReportCountClick}
    />
  );
}
