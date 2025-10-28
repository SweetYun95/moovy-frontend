import React from 'react';
import Modal from '../Modal/Modal';
import { ActionButton } from '../../common/Button/Button';
import './ConfirmModal.scss';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="360px" 
      showCloseButton={true} 
      titleAlign="center"
      noResponsive={true}
    >
      <div className="confirm-modal">
        <div className="row">
          <div className="col-12">
            <p className="confirm-modal__message">{message}</p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="confirm-modal__actions">
              <ActionButton action="confirm" onClick={onClose}>
                확인
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ConfirmModal };
export default ConfirmModal;

// Component wrapper
export function ConfirmModalComponent({ 
  isOpen, 
  onClose, 
  message 
}: { 
  isOpen: boolean
  onClose: () => void
  message: string
}) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      message={message}
    />
  );
}

