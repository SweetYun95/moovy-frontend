import React from 'react';
import Modal from '../Modal/Modal';
import { WideButton } from '../../common/Button/Button';
import './DeleteModal.scss';

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  type?: 'default' | 'danger';
}

const DeleteModal: React.FC<DeleteModalProps> = ({
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
      <div className="delete-modal">
        <div className="row">
          <div className="col-12">
            {message && <p className="delete-modal__message">{message}</p>}
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="delete-modal__actions">
              <WideButton
                buttonType="delete"
                onClick={handleConfirm}
              >
                {confirmText}
              </WideButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

// Component wrapper
export function DeleteModalComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <DeleteModal
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

