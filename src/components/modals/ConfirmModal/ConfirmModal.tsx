import React from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../../common/Button/ButtonStyle';
import './ConfirmModal.scss';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  type?: 'default' | 'danger';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '삭제하기',
  type = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="360px" 
      showCloseButton={true} 
      titleAlign="center"
      title={title}
      noResponsive={true}
    >
      <div className="confirm-modal">
        <div className="row">
          <div className="col-12">
            {message && <p className="confirm-modal__message">{message}</p>}
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="confirm-modal__actions">
              <Button
                variant={type === 'danger' ? 'danger' : 'primary'}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

// Component wrapper
export function ConfirmModalComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        console.log('확인 클릭!');
        onClose();
      }}
      title="코멘트를 삭제하시겠습니까?"
      type="danger"
      confirmText="삭제하기"
    />
  );
}
