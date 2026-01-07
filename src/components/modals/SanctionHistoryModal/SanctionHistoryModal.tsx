import React from 'react'
import Modal from '../Modal/Modal'
import { ActionButton } from '../../common/Button/Button'
import './SanctionHistoryModal.scss'

export interface SanctionHistory {
   id: number
   reason: string
}

export interface SanctionHistoryModalProps {
   isOpen: boolean
   onClose: () => void
   histories: SanctionHistory[]
   onDetailClick?: (historyId: number) => void
}

const SanctionHistoryModal: React.FC<SanctionHistoryModalProps> = ({ isOpen, onClose, histories, onDetailClick }) => {
   const total = histories.length
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="870px" showCloseButton={true} title="제제내역" zIndex={1060}>
         <div className="sanction-history-modal">
            <div className="row">
               <div className="col-12">
                  <div className="sanction-history-modal__list">
                     {histories.length === 0 ? (
                        <div className="sanction-history-modal__empty">경고 기록이 없습니다.</div>
                     ) : (
                        histories.map((history, index) => (
                           <div key={history.id} className="sanction-history-modal__item">
                              <div className="sanction-history-modal__header">제제 {total - index}회</div>
                              <div className="sanction-history-modal__body">
                                 <span className="sanction-history-modal__reason">{history.reason}</span>
                                 {onDetailClick && (
                                    <span className="sanction-history-modal__detail-link" onClick={() => onDetailClick(history.id)}>
                                       상세신고내역
                                    </span>
                                 )}
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-12">
                  <div className="sanction-history-modal__actions">
                     <ActionButton action="confirm" onClick={onClose}>
                        확인
                     </ActionButton>
                  </div>
               </div>
            </div>
         </div>
      </Modal>
   )
}

export default SanctionHistoryModal
