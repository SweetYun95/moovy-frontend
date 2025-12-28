// moovy-frontend/src/services/api/userApi.ts
import moovy from './http'

export type UserProfile = {
   user_id: string
   email: string
   name: string
   google?: boolean
   kakao?: boolean
   googleId?: string
   kakaoId?: string
   state?: string
   profileImage?: string
   createdAt?: string
   updatedAt?: string
}

export type SanctionRecord = {
   id: number
   reason: string
   createdAt: string
}

export type UpdateProfileRequest = {
   name?: string
   email?: string
}

export type CheckNicknameRequest = {
   name: string
}

export type WithdrawRequest = {
   reason?: string
}

/** 현재 사용자 프로필 조회 */
export async function getProfile() {
   const res = await moovy.get('/user/profile')
   return res.data as UserProfile
}

/** 프로필 수정 */
export async function updateProfile(data: UpdateProfileRequest) {
   const res = await moovy.put('/user/profile', data)
   return res.data
}

/** 닉네임 중복 확인 */
export async function checkNickname(data: CheckNicknameRequest) {
   const res = await moovy.post('/user/check-nickname', data)
   return res.data as { available: boolean; message?: string }
}

/** 회원 탈퇴 */
export async function withdraw(data?: WithdrawRequest) {
   const res = await moovy.delete('/user/withdraw', { data })
   return res.data
}

/** 프로필 이미지 업로드 */
export async function uploadProfileImage(file: File) {
   const formData = new FormData()
   formData.append('image', file)
   const res = await moovy.post('/user/profile-image', formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   })
   return res.data as { imageUrl: string }
}

// ===== 사용자 설정 API =====

export type UserSettings = {
   emailNotifications: boolean
   kakaoNotifications: boolean
   webPushNotifications: boolean
   showActivity: boolean
   kakaoLinked: boolean
   googleLinked: boolean
}

/** 사용자 설정 조회 */
export async function getSettings() {
   const res = await moovy.get('/user/settings')
   return res.data as UserSettings
}

/** 사용자 설정 업데이트 */
export async function updateSettings(data: Partial<UserSettings>) {
   const res = await moovy.put('/user/settings', data)
   return res.data as UserSettings
}

/** SNS 연동 해제 */
export async function disconnectSns(provider: 'kakao' | 'google') {
   const res = await moovy.post(`/user/sns/disconnect/${provider}`)
   return res.data
}

/** SNS 연동 */
export async function connectSns(provider: 'kakao' | 'google') {
   const res = await moovy.post(`/user/sns/connect/${provider}`)
   return res.data
}

// ===== 관리자 전용 API =====

/** 전체 사용자 목록 조회 (관리자) */
export async function getUserList() {
   const res = await moovy.get('/admin/users')
   return res.data as { list: UserProfile[]; total: number }
}

/** 특정 사용자 프로필 조회 (관리자) */
export async function getAdminUserProfile(userId: number) {
   const res = await moovy.get(`/admin/users/${userId}`)
   return res.data as UserProfile
}

/** 사용자 프로필 수정 (관리자) */
export async function updateAdminUserProfile(userId: number, data: UpdateProfileRequest) {
   const res = await moovy.put(`/admin/users/${userId}`, data)
   return res.data
}

/** 사용자 계정 정지/해제 (관리자) */
export async function toggleUserStatus(userId: number, status: 'active' | 'suspended') {
   const res = await moovy.put(`/admin/users/${userId}/status`, { status })
   return res.data
}

/** 사용자 강제 탈퇴 (관리자) */
export async function forceWithdrawUser(userId: number, reason?: string) {
   const res = await moovy.delete(`/admin/users/${userId}`, {
      data: { reason },
   })
   return res.data
}

/** 사용자 제제 이력 조회 (관리자) */
export async function getUserSanctions(userId: number) {
   const res = await moovy.get(`/admin/users/${userId}/sanctions`)
   return res.data as SanctionRecord[]
}
