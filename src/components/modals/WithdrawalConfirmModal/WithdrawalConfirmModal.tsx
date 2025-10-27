import React from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../../common/Button/ButtonStyle';
import { UserProfileCard } from '../../common/UserProfileCard/UserProfileCard';
import './WithdrawalConfirmModal.scss';

/**
 사용법

// 일반 사용자 모드
<WithdrawalConfirmModal 
  isOpen={isOpen} 
  onClose={onClose}
  mode="user"
  userName="홍길동"
  onConfirm={() => console.log('탈퇴 확인')}
/>

// 관리자 모드 (탈퇴)
<WithdrawalConfirmModal 
  isOpen={isOpen} 
  onClose={onClose}
  mode="admin"
  userName="홍길동"
  reportCount={3}
  onConfirm={() => console.log('강제 탈퇴 확인')}
/>
 */

export interface WithdrawalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  mode?: 'user' | 'admin';
  reportCount?: number;
  avatar?: string;
}

const WithdrawalConfirmModal: React.FC<WithdrawalConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  mode = 'user',
  reportCount = 0,
  avatar,
}) => {
  const defaultTitle = mode === 'admin' ? `'${userName}' 님 탈퇴` : `'${userName}' 님 탈퇴`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="480px"
      showCloseButton={true}
      title={defaultTitle}
      titleAlign="center"
      noResponsive={true}
    >
      <div className="withdrawal-confirm-modal">
        {mode === 'admin' && (
          <div className="row">
            <div className="col-12">
              <UserProfileCard
                name={userName}
                reportCount={reportCount}
                avatar={avatar}
              />
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="withdrawal-confirm-modal__question">
              {mode === 'admin' 
                ? `${userName}님을 정말 강제 탈퇴 처리하시겠습니까?`
                : '정말 탈퇴하시겠습니까?'
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="withdrawal-confirm-modal__actions">
              <Button 
                variant="danger" 
                onClick={onConfirm}
                size="md"
                fullWidth
              >
                탈퇴
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawalConfirmModal;

