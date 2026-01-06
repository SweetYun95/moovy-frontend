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

export const signUpLocal = async (prop: { email: string; password: string; name: string }): Promise<ApiResponse<SignUpResponse>> => {
   const result = await moovy.post('/api/auth/register', prop)
   return result
}

export const loginLocal = async (prop: { email: string; password: string }): Promise<ApiResponse<loginResponse>> => {
   const result = await moovy.post('/api/auth/login', prop)
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
