import React, { useEffect, useState } from 'react'

import ProfileEditModal from '../ProfileEditModal/ProfileEditModal'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import WithdrawalConfirmModal from '../WithdrawalConfirmModal/WithdrawalConfirmModal'
import SanctionHistoryModal, { type SanctionHistory } from '../SanctionHistoryModal/SanctionHistoryModal'
import { createUserSanction, getAdminUserProfile } from '../../../services/api/userApi'

export type AdminUserTableRow = {
   user_id: number
   name: string
   email: string
   sanctionCount: number
   profileImage?: string
}

export interface AdminUserDetailModalProps {
   isOpen: boolean
   onClose: () => void
   user: AdminUserTableRow | null
   onUpdated?: (next: AdminUserTableRow) => void
}

function addDays(date: Date, days: number) {
   const next = new Date(date)
   next.setDate(next.getDate() + days)
   return next
}

function toIso(date: Date) {
   return date.toISOString()
}

const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({ isOpen, onClose, user, onUpdated }) => {
   const [confirmMessage, setConfirmMessage] = useState<string | null>(null)
   const [confirmActionMessage, setConfirmActionMessage] = useState<string | null>(null)
   const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
   const [isSaving, setIsSaving] = useState(false)
   const [sanctions, setSanctions] = useState<SanctionHistory[]>([])
   const [isSanctionsOpen, setIsSanctionsOpen] = useState(false)
   const [pendingSubmit, setPendingSubmit] = useState<null | { nickname: string; email: string; profileImage?: string }>(null)

   useEffect(() => {
      const load = async () => {
         if (!isOpen || !user) return

         const makeMock = (count: number) => {
            const reasons = ['부적절한 언어 사용', '스팸 댓글', '도배글', '광고성 게시물', '비매너 행위']
            const now = Date.now()
            return Array.from({ length: count }).map((_, idx) => ({
               id: now + idx,
               reason: reasons[idx % reasons.length],
            }))
         }

         try {
            const data: any = await getAdminUserProfile(user.user_id)
            const items: SanctionHistory[] = Array.isArray(data?.sanctions) ? data.sanctions.map((s: any) => ({ id: s.id, reason: s.reason })) : []
            if (items.length === 0 && (user.sanctionCount ?? 0) > 0) {
               setSanctions(makeMock(user.sanctionCount))
            } else {
               setSanctions(items)
            }
         } catch (e) {
            console.error('제재 이력 로드 실패:', e)
            // mock fallback: 경고횟수가 1회 이상이면 임의 제재 이력을 보여줌
            const count = user.sanctionCount ?? 0
            if (count > 0) {
               setSanctions(makeMock(count))
            } else {
               setSanctions([])
            }
         }
      }
      load()
   }, [isOpen, user])

   const sanctionCount = sanctions.length > 0 ? sanctions.length : (user?.sanctionCount ?? 0)

   const handleSubmit = async (data: { name: string; nickname: string; email: string; profileImage?: string }) => {
      if (!user) return

      // 관리자 수정 제한: 닉네임은 16자리 숫자(기본 닉네임 버튼으로만 생성되는 값)만 허용
      const isNicknameAllowed = /^건전한닉네임\d{4}$/.test(data.nickname)
      if (!isNicknameAllowed) {
         setConfirmMessage('관리자 수정은 기본 닉네임(건전한닉네임+4자리)으로만 가능합니다.')
         return
      }

      // 이메일은 수정 불가
      if (data.email !== user.email) {
         setConfirmMessage('이메일은 수정할 수 없습니다.')
         return
      }

      const now = new Date()
      const endAt = toIso(addDays(now, 1))

      const nicknameChanged = user.name !== data.nickname
      const profileChanged = (user.profileImage || '') !== (data.profileImage || '')

      if (!nicknameChanged && !profileChanged) {
         setConfirmMessage('변경 사항이 없습니다.')
         return
      }

      // 변경 적용 전 확인 절차
      setPendingSubmit({ nickname: data.nickname, email: data.email, profileImage: data.profileImage })
      setConfirmActionMessage('닉네임/프로필 이미지 수정 시 제재사유가 추가되며 제재기간 1일이 적용됩니다. 진행하시겠습니까?')
   }

   const applySubmit = async () => {
      if (!user || !pendingSubmit) return

      const now = new Date()
      const endAt = toIso(addDays(now, 1))

      const nicknameChanged = user.name !== pendingSubmit.nickname
      const profileChanged = (user.profileImage || '') !== (pendingSubmit.profileImage || '')

      setIsSaving(true)
      try {
         if (nicknameChanged) {
            await createUserSanction(user.user_id, {
               reason: '부적절한 닉네임',
               start_at: toIso(now),
               end_at: endAt,
            })
            setSanctions((prev) => [{ id: Date.now(), reason: '부적절한 닉네임' }, ...prev])
         }
         if (profileChanged) {
            await createUserSanction(user.user_id, {
               reason: '부적절한 프로필이미지',
               start_at: toIso(now),
               end_at: endAt,
            })
            setSanctions((prev) => [{ id: Date.now() + 1, reason: '부적절한 프로필이미지' }, ...prev])
         }

         const added = (nicknameChanged ? 1 : 0) + (profileChanged ? 1 : 0)
         const nextUser: AdminUserTableRow = {
            ...user,
            name: pendingSubmit.nickname,
            profileImage: pendingSubmit.profileImage,
            sanctionCount: (sanctionCount || user.sanctionCount) + added,
         }

         onUpdated?.(nextUser)
         setConfirmMessage(added > 0 ? '수정 및 제재(1일)가 적용되었습니다.' : '변경 사항이 없습니다.')
      } catch (e) {
         console.error('관리자 수정/제재 처리 실패:', e)
         setConfirmMessage('처리 중 오류가 발생했습니다.')
      } finally {
         setIsSaving(false)
         setConfirmActionMessage(null)
         setPendingSubmit(null)
      }
   }

   const handleWithdrawClick = () => {
      if (!user) return
      if (user.sanctionCount < 3) {
         setConfirmMessage('강제 탈퇴는 경고 3회 이상일 때만 가능합니다.')
         return
      }
      setIsWithdrawOpen(true)
   }

   const handleWithdrawConfirm = async () => {
      if (!user) return
      setIsSaving(true)
      try {
         const now = new Date()
         const tenYearsLater = new Date(now)
         tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10)

         await createUserSanction(user.user_id, {
            reason: '운영자에 의한 강제 탈퇴',
            start_at: toIso(now),
            end_at: toIso(tenYearsLater),
         })

         setSanctions((prev) => [{ id: Date.now(), reason: '운영자에 의한 강제 탈퇴' }, ...prev])
         setConfirmMessage('10년 제재가 적용되었습니다.')
         setIsWithdrawOpen(false)
         onClose()
      } catch (e) {
         console.error('10년 제재 적용 실패:', e)
         setConfirmMessage('10년 제재 적용 중 오류가 발생했습니다.')
      } finally {
         setIsSaving(false)
      }
   }

   return (
      <>
         <ProfileEditModal
            isOpen={isOpen}
            onClose={onClose}
            mode="admin"
            title="유저 상세"
            onSubmit={handleSubmit}
            userData={
               user
                  ? {
                       userId: user.user_id,
                       name: user.name,
                       nickname: user.name,
                       email: user.email,
                       profileImage: user.profileImage,
                       reportCount: sanctionCount,
                    }
                  : undefined
            }
            onWithdraw={handleWithdrawClick}
            onDetailClick={() => setIsSanctionsOpen(true)}
            disabled={isSaving}
         />

         <ConfirmModal isOpen={!!confirmMessage} onClose={() => setConfirmMessage(null)} message={confirmMessage || ''} />

         <ConfirmModal
            isOpen={!!confirmActionMessage}
            onClose={() => {
               setConfirmActionMessage(null)
               setPendingSubmit(null)
            }}
            message={confirmActionMessage || ''}
            onConfirm={applySubmit}
            confirmText="진행"
            cancelText="취소"
         />

         {user && <WithdrawalConfirmModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} mode="admin" userName={user.name} reportCount={user.sanctionCount} avatar={user.profileImage} onConfirm={handleWithdrawConfirm} />}

         <SanctionHistoryModal isOpen={isSanctionsOpen} onClose={() => setIsSanctionsOpen(false)} histories={sanctions} />
      </>
   )
}

export default AdminUserDetailModal
