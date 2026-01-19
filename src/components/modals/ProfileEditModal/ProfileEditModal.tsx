import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import { Button } from '../../common/Button/ButtonStyle'
import { ActionButton } from '../../common/Button/Button'
import { Input } from '../../common/Input/InputStyle'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { updateProfile, checkNickname, getAdminUserProfile, updateAdminUserProfile, type UserProfile } from '../../../services/api/userApi'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
// import { setUser } from '../../../features/auth/authSlice'
import './ProfileEditModal.scss'

import DefaultAvatar from '../../../assets/Avatar.png'

export interface ProfileEditModalComponentProps {
   isOpen: boolean
   onClose: () => void
   onSuccess?: () => void
}

/**
 사용법

// 일반 사용자 모드
<ProfileEditModalComponent 
  isOpen={isOpen} 
  onClose={onClose} 
/>

// 관리자 모드
<ProfileEditModal 
  isOpen={isOpen} 
  onClose={onClose}
  mode="admin"
  userData={{ name: '이름', nickname: '닉네임', email: 'email@example.com', profileImage: 'url', reportCount: 5 }}
  onSubmit={(data) => console.log(data)}
  onWithdraw={() => console.log('강제탈퇴')}
/>
 */

export interface ProfileEditModalProps {
   isOpen: boolean
   onClose: () => void
   onSubmit: (data: { name: string; nickname: string; email: string; profileImage?: string; password?: string }) => void
   title?: string
   mode?: 'user' | 'admin'
   disabled?: boolean
   userData?: {
      userId?: number
      name: string
      nickname: string
      email: string
      profileImage?: string
      reportCount?: number
   }
   onWithdraw?: () => void
   onCheckNickname?: (nickname: string) => Promise<boolean>
   onDetailClick?: () => void
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSubmit, title, mode = 'user', disabled = false, userData, onWithdraw, onCheckNickname, onDetailClick }) => {
   const defaultTitle = mode === 'admin' ? '프로필 관리' : '프로필 수정'

   const [name, setName] = useState(userData?.name || '')
   const [nickname, setNickname] = useState(userData?.nickname || '')
   const [email, setEmail] = useState(userData?.email || '')
   const [profileImage, setProfileImage] = useState(userData?.profileImage || '')
   const [password, setPassword] = useState('')
   const [passwordConfirm, setPasswordConfirm] = useState('')
   const [infoMessage, setInfoMessage] = useState<string | null>(null)

   // userData가 변경되면 state 업데이트
   useEffect(() => {
      if (userData) {
         setName(userData.name || '')
         setNickname(userData.nickname || '')
         setEmail(userData.email || '')
         setProfileImage(userData.profileImage || '')
      }
   }, [userData])

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         const reader = new FileReader()
         reader.onload = (event) => {
            if (event.target?.result) {
               setProfileImage(event.target.result as string)
            }
         }
         reader.readAsDataURL(file)
      }
   }

   const handleSubmit = () => {
      if (mode === 'admin') {
         if (!nickname.trim() || !email.trim()) return
      } else {
         if (!name.trim() || !nickname.trim() || !email.trim()) return
      }

      // 비밀번호 변경이 있는 경우 검증 (비밀번호나 확인 입력이 하나라도 있으면 검증)
      if (mode === 'user' && (password || passwordConfirm)) {
         if (!password) {
            alert('비밀번호를 입력하세요.')
            return
         }
         if (password.length < 8) {
            alert('비밀번호는 8자 이상이어야 합니다.')
            return
         }
         if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.')
            return
         }
      }

      const submitData: any = { name, nickname, email, profileImage }
      // 비밀번호가 입력된 경우에만 포함
      if (password && password.trim()) {
         submitData.password = password
      }
      onSubmit(submitData)
      // 비밀번호 필드 초기화
      setPassword('')
      setPasswordConfirm('')
      onClose()
   }

   const handleCheckNickname = async () => {
      if (onCheckNickname) {
         await onCheckNickname(nickname)
      }
   }

   const handleClose = () => {
      // 필드 초기화
      setPassword('')
      setPasswordConfirm('')
      onClose()
   }

   const modalTitle = title || defaultTitle

   const generate4Digits = () => {
      // 0000~9999
      const n = Math.floor(Math.random() * 10000)
      return String(n).padStart(4, '0')
   }

   const handleApplyDefaultNickname = async () => {
      if (mode !== 'admin') return

      let lastErrorMessage: string | null = null

      // "중복이 안되는" 기본 닉네임(건전한닉네임+4자리)을 위해 재시도
      for (let i = 0; i < 20; i++) {
         const candidate = `건전한닉네임${generate4Digits()}`
         try {
            const result = await checkNickname({ name: candidate })
            if (result.available) {
               setNickname(candidate)
               return
            }
         } catch (e: any) {
            // 서버/네트워크 에러는 메시지로 기록
            const data = e?.response?.data
            const serverMessage = data?.message
            const nameErrors: string[] | undefined = data?.errors?.fieldErrors?.name
            if (Array.isArray(nameErrors) && nameErrors.length > 0) {
               lastErrorMessage = nameErrors[0]
            } else if (serverMessage) {
               lastErrorMessage = String(serverMessage)
            } else if (e?.message) lastErrorMessage = String(e.message)
         }
      }

      setInfoMessage(lastErrorMessage ? `기본 닉네임 생성 실패: ${lastErrorMessage}` : '기본 닉네임 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
   }

   const handleApplyDefaultAvatar = () => {
      if (mode !== 'admin') return
      setProfileImage(DefaultAvatar)
   }

   return (
      <>
         <Modal isOpen={isOpen} onClose={handleClose} size="480px" showCloseButton={true} titleAlign="center" title={modalTitle}>
            <div className="profile-edit-modal">
               <div className="row">
                  <div className="col-12">
                     <div className="profile-edit-modal__avatar">
                        <label htmlFor="profile-image-input" className="profile-edit-modal__avatar-wrapper">
                           {profileImage ? (
                              <img src={profileImage} alt="Profile" className="profile-edit-modal__avatar-img" />
                           ) : (
                              <div className="profile-edit-modal__avatar-placeholder">
                                 <span>👤</span>
                              </div>
                           )}
                        </label>
                        {mode === 'user' && <input type="file" id="profile-image-input" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />}
                        {mode === 'admin' && (
                           <div className="profile-edit-modal__avatar-actions">
                              <Button variant="secondary" onClick={handleApplyDefaultAvatar} size="md">
                                 기본 이미지 적용
                              </Button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {mode !== 'admin' && (
                  <div className="row">
                     <div className="col-12">
                        <div className="profile-edit-modal__field">
                           <label className="form-label">이름</label>
                           <Input placeholder="유저 이름" value={name} onChange={setName} disabled={disabled} />
                        </div>
                     </div>
                  </div>
               )}

               <div className="row">
                  <div className="col-12">
                     <div className="profile-edit-modal__field">
                        <label className="form-label">닉네임</label>
                        <Input
                           placeholder="유저 닉네임"
                           value={nickname}
                           onChange={setNickname}
                           disabled={mode === 'admin' || disabled}
                           rightButton={
                              mode === 'admin'
                                 ? {
                                      text: '기본 닉네임',
                                      onClick: handleApplyDefaultNickname,
                                      variant: 'primary',
                                      size: 'sm',
                                   }
                                 : mode === 'user' && onCheckNickname
                                   ? {
                                        text: '중복확인',
                                        onClick: handleCheckNickname,
                                        variant: 'primary',
                                        size: 'sm',
                                     }
                                   : undefined
                           }
                        />
                     </div>
                  </div>
               </div>

               <div className="row">
                  <div className="col-12">
                     <div className="profile-edit-modal__field">
                        <label className="form-label">이메일</label>
                        <Input type="email" placeholder="유저 이메일" value={email} onChange={setEmail} disabled={mode === 'admin' || disabled} />
                     </div>
                  </div>
               </div>

               {mode === 'user' && (
                  <>
                     <div className="row">
                        <div className="col-12">
                           <div className="profile-edit-modal__field">
                              <label className="form-label">비밀번호</label>
                              <Input type="password" placeholder="비밀번호를 입력하세요." value={password} onChange={setPassword} />
                           </div>
                        </div>
                     </div>

                     <div className="row">
                        <div className="col-12">
                           <div className="profile-edit-modal__field">
                              <label className="form-label">비밀번호 확인</label>
                              <Input type="password" placeholder="비밀번호를 다시 입력하세요." value={passwordConfirm} onChange={setPasswordConfirm} />
                           </div>
                        </div>
                     </div>
                  </>
               )}

               {mode === 'admin' && (
                  <div className="row">
                     <div className="col-12">
                        <div className="profile-edit-modal__info">
                           <div className="profile-edit-modal__info-left">
                              <div className="profile-edit-modal__info-row">
                                 <span className="profile-edit-modal__label">관리자 경고</span>
                                 <span className="profile-edit-modal__report-count">{userData?.reportCount || 0}회</span>
                              </div>
                              <div className="profile-edit-modal__info-detail" onClick={onDetailClick} style={{ cursor: 'pointer' }}>
                                 상세보기
                              </div>
                           </div>
                           {onWithdraw && (
                              <Button variant="danger" onClick={onWithdraw} size="md">
                                 탈퇴
                              </Button>
                           )}
                        </div>
                     </div>
                  </div>
               )}

               <div className="row">
                  <div className="col-12">
                     <div className="profile-edit-modal__actions">
                        <ActionButton action="confirm" onClick={handleSubmit} disabled={disabled}>
                           {mode === 'admin' ? '수정' : '수정'}
                        </ActionButton>
                     </div>
                  </div>
               </div>
            </div>
         </Modal>

         <ConfirmModal isOpen={!!infoMessage} onClose={() => setInfoMessage(null)} message={infoMessage || ''} />
      </>
   )
}

export default ProfileEditModal

// Component wrapper with API integration - 일반 사용자용
export function ProfileEditModalComponent({ isOpen, onClose, onSuccess }: ProfileEditModalComponentProps) {
   const dispatch = useAppDispatch()
   const { user } = useAppSelector((state) => state.auth)
   const [isLoading, setIsLoading] = useState(false)

   // Redux store의 user 데이터 사용
   const userData = user
      ? {
           name: user.name || '',
           nickname: user.name || '',
           email: user.email || '',
           profileImage: user.profileImage || '',
        }
      : null

   const handleSubmit = async (data: { name: string; nickname: string; email: string; profileImage?: string; password?: string }) => {
      setIsLoading(true)
      try {
         const updateData: any = {
            name: data.name,
            nickname: data.nickname,
            email: data.email,
            profileImage: data.profileImage,
         }
         if (data.password) {
            updateData.password = data.password
         }
         const updatedUser = await updateProfile(updateData)

         // Redux store 업데이트
         if (updatedUser && user) {
            // dispatch(setUser({ ...user, ...updatedUser }))
         }

         onClose()
         if (onSuccess) {
            onSuccess()
         }
      } catch (error) {
         console.error('프로필 수정 실패:', error)
         // TODO: 에러 토스트 메시지 표시
      } finally {
         setIsLoading(false)
      }
   }

   const handleCheckNickname = async (nickname: string): Promise<boolean> => {
      try {
         const result = await checkNickname({ name: nickname })
         return result.available
      } catch (error) {
         console.error('닉네임 중복 확인 실패:', error)
         return false
      }
   }

   return <ProfileEditModal isOpen={isOpen} onClose={onClose} mode="user" onSubmit={handleSubmit} userData={userData || { name: '', nickname: '', email: '', profileImage: undefined }} onCheckNickname={handleCheckNickname} />
}

// 관리자용 Component wrapper
export function AdminProfileEditModalComponent({ isOpen, onClose, userId, onWithdrawClick, onSanctionData }: { isOpen: boolean; onClose: () => void; userId: number; onWithdrawClick?: () => void; onSanctionData?: (data: Array<{ id: number; reason: string }>) => void }) {
   const [isLoading, setIsLoading] = useState(false)
   const [userData, setUserData] = useState<{
      name: string
      nickname: string
      email: string
      profileImage?: string
      reportCount?: number
   } | null>(null)

   const [sanctionCount, setSanctionCount] = useState<number>(0)
   const [sanctions, setSanctions] = useState<Array<{ id: number; reason: string }>>([])

   // 사용자 데이터 로드
   useEffect(() => {
      if (isOpen && userId) {
         loadUserData()
      }
   }, [isOpen, userId])

   const loadUserData = async () => {
      try {
         const data = await getAdminUserProfile(userId)
         const sanctionsData = (data as any)?.sanctions ?? []
         setSanctions(sanctionsData)
         setSanctionCount(sanctionsData.length)
         setUserData({
            name: data.name,
            nickname: data.name,
            email: data.email,
            profileImage: (data as any)?.profileImage,
            reportCount: sanctionsData.length,
         })
      } catch (error) {
         console.error('사용자 데이터 로드 실패:', error)
         // TestApp용 mock 데이터
         setUserData({
            name: '김철수',
            nickname: '철수형',
            email: 'cheolsu@example.com',
            profileImage: undefined,
            reportCount: 5,
         })
         const mockSanctions = [
            { id: 1, reason: '부적절한 언어 사용' },
            { id: 2, reason: '광고글' },
            { id: 3, reason: '도배글' },
            { id: 4, reason: '스팸 댓글' },
            { id: 5, reason: '비매너 행위' },
         ]
         setSanctions(mockSanctions)
         setSanctionCount(mockSanctions.length)
      }
   }

   const handleSubmit = async (data: { name: string; nickname: string; email: string; profileImage?: string }) => {
      setIsLoading(true)
      try {
         await updateAdminUserProfile(userId, {
            name: data.nickname,
            email: data.email,
         })
         onClose()
         // TODO: 성공 토스트 메시지
      } catch (error) {
         console.error('프로필 수정 실패:', error)
         // TODO: 에러 토스트 메시지 표시
      } finally {
         setIsLoading(false)
      }
   }

   const handleForceWithdraw = () => {
      if (onWithdrawClick) {
         onWithdrawClick()
      }
   }

   if (!userData) {
      return null // 로딩 중
   }

   return (
      <ProfileEditModal
         isOpen={isOpen}
         onClose={onClose}
         mode="admin"
         onSubmit={handleSubmit}
         userData={
            {
               ...userData,
               reportCount: sanctionCount || userData?.reportCount,
            } as any
         }
         onWithdraw={handleForceWithdraw}
         onDetailClick={() => {
            if (onSanctionData) {
               onSanctionData(sanctions)
            }
         }}
      />
   )
}
