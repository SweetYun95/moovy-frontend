// moovy-frontend/src/services/api/authApi.ts
import moovy from './http'
import type { ApiResponse } from './http'

export interface SignUpResponse {
   newUser: {
      user_id: string
      email: string
      name: string
   }
}

export interface loginResponse {
   user: {
      user_id: string
      email: string
      name: string
   }
}

export interface CheckEmailResponse {
   success: boolean
   isDuplicate: boolean
}

// ✅ (선택) 응답 타입: 백엔드가 message만 내려주는 형태로 가정
export interface MessageResponse {
   message: string
}

// ─────────────────────────────
// 기존 Auth
// ─────────────────────────────

export const signUpLocal = async (prop: { email: string; password: string; name: string }): Promise<ApiResponse<SignUpResponse>> => {
   const result = await moovy.post('/auth/signup', prop)
   return result.data
}

export const loginLocal = async (prop: { email: string; password: string }): Promise<ApiResponse<loginResponse>> => {
   const result = await moovy.post('/auth/login', prop)
   return result.data
}

export const logout = async (): Promise<ApiResponse<{}>> => {
   const result = await moovy.post('/auth/logout')
   return result.data
}

export const checkAuth = async (): Promise<ApiResponse<loginResponse>> => {
   const result = await moovy.get('/auth/me')
   return result.data
}

// ─────────────────────────────
// ✅ 추가: 비밀번호 재설정
// ─────────────────────────────

/**
 * 이메일 중복 확인
 * POST /api/auth/check-email
 */
export const checkEmail = async (prop: { email: string }): Promise<ApiResponse<CheckEmailResponse>> => {
   const result = await moovy.post('/auth/check-email', prop)
   return result.data
}

/**
 * 비밀번호 재설정 요청(메일 발송)
 * POST /api/auth/password/reset-request
 */
export const requestPasswordReset = async (prop: { email: string }): Promise<ApiResponse<MessageResponse>> => {
   const result = await moovy.post('/auth/password/reset-request', prop)
   return result.data
}

/**
 * 비밀번호 재설정 확정(토큰 + 새 비밀번호)
 * POST /api/auth/password/reset
 */
export const confirmPasswordReset = async (prop: { token: string; password: string }): Promise<ApiResponse<MessageResponse>> => {
   const result = await moovy.post('/auth/password/reset', prop)
   return result.data
}
