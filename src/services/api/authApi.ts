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

export interface LoginResponse {
   user: {
      user_id: string
      email: string
      name: string
      role?: string
   }
}

export interface CheckEmailResponse {
   success: boolean
   isDuplicate: boolean
}

export interface MessageResponse {
   message: string
}

// ─────────────────────────────
// 기존 Auth
// ─────────────────────────────

export const signUpLocal = async (prop: { email: string; password: string; name: string }): Promise<ApiResponse<SignUpResponse>> => {
   const result = await moovy.post<ApiResponse<SignUpResponse>>('/api/auth/signup', prop)
   return result.data
}

export const loginLocal = async (prop: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
   const result = await moovy.post<ApiResponse<LoginResponse>>('/api/auth/login', prop)
   return result.data
}

export const logout = async (): Promise<ApiResponse<{}>> => {
   const result = await moovy.post<ApiResponse<{}>>('/api/auth/logout')
   return result.data
}

export const checkAuth = async (): Promise<ApiResponse<LoginResponse>> => {
   const result = await moovy.get<ApiResponse<LoginResponse>>('/api/auth/me')
   return result.data
}

// ─────────────────────────────
// 이메일 중복 확인
// ─────────────────────────────

export const checkEmail = async (prop: { email: string }): Promise<ApiResponse<CheckEmailResponse>> => {
   const result = await moovy.post<ApiResponse<CheckEmailResponse>>('/api/auth/check-email', prop)
   return result.data
}

// ─────────────────────────────
// 비밀번호 재설정 요청
// ─────────────────────────────

export const requestPasswordReset = async (prop: { email: string }): Promise<ApiResponse<MessageResponse>> => {
   const result = await moovy.post<ApiResponse<MessageResponse>>('/api/auth/password/reset-request', prop)
   return result.data
}

// ─────────────────────────────
// 비밀번호 재설정 확정
// ─────────────────────────────

export const confirmPasswordReset = async (prop: { token: string; password: string }): Promise<ApiResponse<MessageResponse>> => {
   const result = await moovy.post<ApiResponse<MessageResponse>>('/api/auth/password/reset', prop)
   return result.data
}
