import React, { useEffect, useState } from 'react'
import Modal from '../Modal/Modal'
import { ActionButton } from '../../common/Button/Button'
import { Input } from '../../common/Input/InputStyle'
import { Textarea } from '../../common/Textarea/TextareaStyle'
import { createInquiry } from '../../../services/api/inquiryApi'
import './InquiryModal.scss'

export interface InquiryModalProps {
   isOpen: boolean
   onClose: () => void
   onSubmit: (data: { title: string; content: string; replyTitle?: string; reply?: string }) => void
   title?: string
   mode?: 'user' | 'admin'
   inquiryData?: { title: string; content: string; initialReplyTitle?: string; initialReply?: string; answererName?: string }
   readOnly?: boolean
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, onSubmit, title, mode = 'user', inquiryData, readOnly = false }) => {
   const defaultTitle = mode === 'admin' ? '문의 관리' : '1:1 문의하기'

   const [inquiryTitle, setInquiryTitle] = useState(inquiryData?.title || '')
   const [content, setContent] = useState(inquiryData?.content || '')
   const [replyTitle, setReplyTitle] = useState(inquiryData?.initialReplyTitle || '')
   const [reply, setReply] = useState(inquiryData?.initialReply || '')

   useEffect(() => {
      if (!isOpen) return
      setInquiryTitle(inquiryData?.title || '')
      setContent(inquiryData?.content || '')
      setReplyTitle(inquiryData?.initialReplyTitle || '')
      setReply(inquiryData?.initialReply || '')
   }, [isOpen, inquiryData?.title, inquiryData?.content, inquiryData?.initialReplyTitle, inquiryData?.initialReply])

   const handleClose = () => {
      setInquiryTitle('')
      setContent('')
      setReplyTitle('')
      setReply('')
      onClose()
   }

   const handleSubmit = () => {
      if (!inquiryTitle.trim() || !content.trim()) return
      if (mode === 'admin' && !readOnly && (!replyTitle.trim() || !reply.trim())) return

      onSubmit({
         title: inquiryTitle,
         content,
         replyTitle: mode === 'admin' ? replyTitle : undefined,
         reply: mode === 'admin' ? reply : undefined,
      })

      handleClose()
   }

   const modalTitle = title || defaultTitle

   return (
      <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle} size="870px" showCloseButton={true}>
         <div className="inquiry-modal">
            <div className="row">
               <div className="col-12">
                  <div className="inquiry-modal__field">
                     <label className="form-label">문의 제목</label>
                     {mode === 'admin' ? <div className="inquiry-modal__readonly-value">{inquiryData?.title}</div> : <Input type="text" placeholder="문의 제목을 입력하세요." value={inquiryTitle} onChange={setInquiryTitle} theme="light" />}
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-12">
                  <div className="inquiry-modal__field">
                     <label className="form-label">문의 내용</label>
                     {mode === 'admin' ? <div className="inquiry-modal__readonly-value">{inquiryData?.content}</div> : <Textarea placeholder="문의사항을 적어주세요." value={content} onChange={setContent} rows={8} maxLength={10000} showCounter />}
                  </div>
               </div>
            </div>

            {mode === 'admin' && (
               <>
                  {readOnly && (
                     <div className="row">
                        <div className="col-12">
                           <div className="inquiry-modal__field">
                              <label className="form-label">답변자</label>
                              <div className="inquiry-modal__readonly-value">{inquiryData?.answererName?.trim() ? inquiryData.answererName : '-'}</div>
                           </div>
                        </div>
                     </div>
                  )}

                  <div className="row">
                     <div className="col-12">
                        <div className="inquiry-modal__field">
                           <label className="form-label">답변 제목</label>
                           {readOnly ? <div className="inquiry-modal__readonly-value">{replyTitle || '답변 제목이 없습니다.'}</div> : <Input type="text" placeholder="답변 제목을 입력하세요." value={replyTitle} onChange={setReplyTitle} theme="light" />}
                        </div>
                     </div>
                  </div>

                  <div className="row">
                     <div className="col-12">
                        <div className="inquiry-modal__field">
                           <label className="form-label">답변 내용</label>
                           {readOnly ? <div className="inquiry-modal__readonly-value">{reply || '답변 내용이 없습니다.'}</div> : <Textarea placeholder="답변내용을 적어주세요." value={reply} onChange={setReply} rows={8} maxLength={10000} showCounter />}
                        </div>
                     </div>
                  </div>
               </>
            )}

            <div className="row">
               <div className="col-12">
                  <div className="inquiry-modal__actions">
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
   )
}

export default InquiryModal

// Component wrapper with API integration
export function InquiryModalComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
   const [isLoading, setIsLoading] = useState(false)

   const handleSubmit = async (data: { title: string; content: string }) => {
      setIsLoading(true)
      try {
         await createInquiry({
            title: data.title,
            content: data.content,
         })
         onClose()
      } catch (error) {
         console.error('문의 제출 실패:', error)
      } finally {
         setIsLoading(false)
      }
   }

   return <InquiryModal isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} readOnly={isLoading} />
}
