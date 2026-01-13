import React, { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'

import Modal from '../Modal/Modal'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { ActionButton } from '../../common/Button/Button'
import { Input } from '../../common/Input/InputStyle'
import { Textarea } from '../../common/Textarea/TextareaStyle'
import { ReportSelector } from '../../common/Selector/SelectorComponents'
import { Selector } from '../../common/Selector/SelectorStyle'
import { UserProfileCard } from '../../common/UserProfileCard/UserProfileCard'

import { createReport, type ReportCategory } from '../../../services/api/commentApi'
import { getAdminUserProfile } from '../../../services/api/userApi'

import './ReportModal.scss'

export interface ReportModalProps {
   isOpen: boolean
   onClose: () => void
   onSubmit: (data: {
      category: string
      content?: string
      sanctionAction?: '조치 안함' | '제재'
      sanctionDays?: number
      sanctionReason?: string
   }) => void
   title?: string
   mode?: 'user' | 'admin'
   reportData?: {
      category: string
      content: string
      targetUser?: {
         name: string
         reportCount: number
         avatar?: string
      }
      sanctionAction?: '조치 안함' | '제재'
      sanctionDays?: number
      sanctionReason?: string
   }
   targetUser?: {
      name: string
      reportCount: number
   }
   onReportCountClick?: (data: Array<{ id: number; reason: string }>) => void
   readOnly?: boolean
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
   readOnly = false,
}) => {
   const defaultTitle = mode === 'admin' ? '신고관리' : '신고하기'

   const [category, setCategory] = useState(reportData?.category || '')
   const [content, setContent] = useState(reportData?.content || '')

   // admin-only
   const [sanctionAction, setSanctionAction] = useState<'' | '조치 안함' | '제재'>((reportData?.sanctionAction as any) || '')
   const [sanctionDays, setSanctionDays] = useState<number | ''>((reportData?.sanctionDays as any) ?? '')
   const [sanctionReason, setSanctionReason] = useState(reportData?.sanctionReason || '')
   const [isConfirmOpen, setIsConfirmOpen] = useState(false)

   useEffect(() => {
      if (!isOpen) return
      setCategory(reportData?.category || '')
      setContent(reportData?.content || '')
      setSanctionAction((reportData?.sanctionAction as any) || '')
      setSanctionDays((reportData?.sanctionDays as any) ?? '')
      setSanctionReason(reportData?.sanctionReason || '')
      setIsConfirmOpen(false)
   }, [isOpen, reportData?.category, reportData?.content, reportData?.sanctionAction, reportData?.sanctionDays, reportData?.sanctionReason])

   useEffect(() => {
      if (sanctionAction !== '제재') {
         setSanctionDays('')
         setSanctionReason('')
      }
   }, [sanctionAction])

   const modalTitle = title || defaultTitle
   const displayTargetUser = reportData?.targetUser || targetUser

   const confirmMessage = useMemo(() => {
      if (mode !== 'admin') return ''
      if (sanctionAction === '제재') {
         const days = typeof sanctionDays === 'number' ? sanctionDays : 0
         const reason = sanctionReason?.trim()
         return `${displayTargetUser?.name || '해당 유저'}에게 ${days}일 제재${reason ? `(제재사유:${reason})` : ''}. 정말 진행하시겠습니까?`
      }
      return '해당 신고 조치 안함. 정말 진행하시겠습니까?'
   }, [mode, sanctionAction, sanctionDays, sanctionReason, displayTargetUser?.name])

   const handleClose = () => {
      setCategory('')
      setContent('')
      setSanctionAction('')
      setSanctionDays('')
      setSanctionReason('')
      setIsConfirmOpen(false)
      onClose()
   }

   const handleSubmit = () => {
      if (!category) return

      if (mode === 'admin') {
         if (!sanctionAction) return
         if (sanctionAction === '제재') {
            if (typeof sanctionDays !== 'number' || Number.isNaN(sanctionDays) || sanctionDays < 1 || sanctionDays > 30) return
         }
         setIsConfirmOpen(true)
         return
      }

      onSubmit({
         category,
         content: content?.trim() ? content : undefined,
      })
      handleClose()
   }

   const handleConfirmSubmit = () => {
      if (mode !== 'admin') return

      onSubmit({
         category,
         content,
         sanctionAction: sanctionAction || undefined,
         sanctionDays: sanctionAction === '제재' && typeof sanctionDays === 'number' ? sanctionDays : undefined,
         sanctionReason: sanctionAction === '제재' ? sanctionReason : undefined,
      })
      setIsConfirmOpen(false)
      handleClose()
   }

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
                        avatar={(reportData as any)?.targetUser?.avatar}
                        onReportCountClick={onReportCountClick}
                     />
                  </div>
               </div>
            )}

            <div className="row">
               <div className="col-12">
                  <div className="report-modal__field">
                     <label className="form-label">분류</label>
                     {mode === 'admin' ? (
                        <div className="report-modal__readonly-value">{category || '분류 없음'}</div>
                     ) : (
                        <ReportSelector value={category} onChange={setCategory} placeholder="분류" />
                     )}
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-12">
                  <div className="report-modal__field">
                     <label className="form-label">신고내용을 적어주세요.</label>
                     {mode === 'admin' || readOnly ? (
                        <div className="report-modal__readonly-value">{content || '신고 내용이 없습니다.'}</div>
                     ) : (
                        <Textarea
                           placeholder="신고내용을 적어주세요."
                           value={content}
                           onChange={setContent}
                           rows={6}
                           maxLength={10000}
                           showCounter
                        />
                     )}
                  </div>
               </div>
            </div>

            {mode === 'admin' && (
               <>
                  <div className="row">
                     <div className="col-12">
                        <div className="report-modal__field">
                           <label className="form-label">조치</label>
                           {readOnly ? (
                              <div className="report-modal__readonly-value">{sanctionAction || '조치 안함'}</div>
                           ) : (
                              <Selector
                                 options={[
                                    { value: '조치 안함', label: '조치 안함' },
                                    { value: '제재', label: '제재' },
                                 ]}
                                 value={sanctionAction}
                                 onChange={(v) => setSanctionAction(v as any)}
                                 placeholder="조치"
                                 theme="light"
                              />
                           )}
                        </div>
                     </div>
                  </div>

                  {sanctionAction === '제재' && !readOnly && (
                     <>
                        <div className="row">
                           <div className="col-12">
                              <div className="report-modal__field">
                                 <label className="form-label">제재 기간(일)</label>
                                 <Input
                                    type="number"
                                    placeholder="1~30"
                                    value={sanctionDays === '' ? '' : String(sanctionDays)}
                                    onChange={(v) => {
                                       const n = Number(v)
                                       setSanctionDays(Number.isNaN(n) ? '' : n)
                                    }}
                                    theme="light"
                                    min={1}
                                    max={30}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="row">
                           <div className="col-12">
                              <div className="report-modal__field">
                                 <label className="form-label">제재 사유</label>
                                 <Textarea
                                    placeholder="제재 사유를 입력하세요."
                                    value={sanctionReason}
                                    onChange={setSanctionReason}
                                    rows={2}
                                    maxLength={200}
                                    showCounter
                                 />
                              </div>
                           </div>
                        </div>
                     </>
                  )}
               </>
            )}

            <div className="row">
               <div className="col-12">
                  <div className="report-modal__actions">
                     {!readOnly && (
                        <ActionButton action="confirm" onClick={handleSubmit}>
                           확인
                        </ActionButton>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {mode === 'admin' && (
            <ConfirmModal
               isOpen={isConfirmOpen}
               onClose={() => setIsConfirmOpen(false)}
               message={confirmMessage}
               onConfirm={handleConfirmSubmit}
            />
         )}
      </Modal>
   )
}

export default ReportModal

// Component wrapper with API integration
export function ReportModalComponent({
   isOpen,
   onClose,
   targetType,
   targetId,
   targetUser,
   targetUserId,
   onReportCountClick,
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
   const [isLoading, setIsLoading] = useState(false)
   const [fetchedUser, setFetchedUser] = useState<{ name: string; reportCount: number } | undefined>(undefined)

   // 유저 대상 신고인 경우 사용자 정보 로드
   React.useEffect(() => {
      const load = async () => {
         if (isOpen && targetType === 'user' && targetUserId && !targetUser) {
            try {
               const user = await getAdminUserProfile(targetUserId)
               setFetchedUser({ name: user.name || '사용자', reportCount: 0 })
            } catch (e) {
               console.error('신고 대상 사용자 로드 실패:', e)
               setFetchedUser(undefined)
            }
         }
      }
      void load()
   }, [isOpen, targetType, targetUserId, targetUser])

   const handleSubmit = async (data: { category: string; content?: string }) => {
      if (!targetType || !targetId) {
         console.error('신고 대상이 지정되지 않았습니다.')
         return
      }

      setIsLoading(true)
      try {
         await createReport({
            category: data.category as ReportCategory,
            targetType,
            targetId,
            reason: data.content?.trim() || undefined,
         })
         alert('신고가 접수되었습니다.')
         onClose()
      } catch (error) {
         console.error('신고 제출 실패:', error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <ReportModal
         isOpen={isOpen}
         onClose={onClose}
         onSubmit={handleSubmit}
         targetUser={targetUser || fetchedUser}
         onReportCountClick={onReportCountClick}
         readOnly={isLoading}
      />
   )
}
