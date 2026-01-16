import React from 'react'
import Modal from '../Modal/Modal'
import { ActionButton } from '../../common/Button/Button'

export type ReportedPostModalData = {
   type: '코멘트' | '댓글'
   id: number
   content: string
}

export interface ReportedPostModalProps {
   isOpen: boolean
   onClose: () => void
   data?: ReportedPostModalData
}

const ReportedPostModal: React.FC<ReportedPostModalProps> = ({ isOpen, onClose, data }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} title="신고 게시글 확인" size="480px" showCloseButton={true} titleAlign="center">
         <div className="report-modal">
            <div className="row">
               <div className="col-12">
                  <div className="report-modal__field">
                     <label className="form-label">구분</label>
                     <div className="report-modal__readonly-value">{data ? `${data.type}/${data.id}` : '-'}</div>
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-12">
                  <div className="report-modal__field">
                     <label className="form-label">내용</label>
                     <div className="report-modal__readonly-value">{data?.content || '-'}</div>
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-12">
                  <div className="report-modal__actions">
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

export default ReportedPostModal
