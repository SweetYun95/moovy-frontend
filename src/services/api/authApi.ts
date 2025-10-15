// moovy-frontend/src/services/api/authApi.ts
import moovy from './http'

export type Role = 'USER' | 'ADMIN'
export type Provider = 'local' | 'google' | 'kakao'

export type User = {
   id: number
   name: string
   email?: string
   role: Role
   provider?: Provider
   avatarUrl?: string
}

/** ✅ 로컬 로그인 */
export async function loginLocal(payload: { idOrEmail: string; password: string }) {
   const res = await moovy.post('/auth/login', payload)
   // 토큰을 헤더나 바디로 돌려준다면 여기서 저장
   const token = (res.data?.token ?? '') as string
   if (token) localStorage.setItem('token', token)
   return res.data as { user: User; token?: string }
}

/** ✅ 로그아웃(공통: 세션 쿠키/토큰 무효화) */
export async function logout() {
   try {
      await moovy.post('/auth/logout')
   } finally {
      localStorage.removeItem('token')
   }
}

/** ✅ 로컬 세션 확인 (/auth/me) */
export async function meLocal() {
   const res = await moovy.get('/auth/me')
   if (res.status !== 200) throw new Error('NOT_AUTHED')
   const user = res.data as User
   return { ...user, provider: 'local' as const }
}

/** ✅ 구글 세션 확인 (/auth/google/me) */
export async function meGoogle() {
   const res = await moovy.get('/auth/google/me')
   if (res.status !== 200) throw new Error('NOT_AUTHED')
   const user = res.data as User
   return { ...user, provider: 'google' as const }
}

/** ✅ 카카오 세션 확인 (/auth/kakao/me) */
export async function meKakao() {
   const res = await moovy.get('/auth/kakao/me')
   if (res.status !== 200) throw new Error('NOT_AUTHED')
   const user = res.data as User
   return { ...user, provider: 'kakao' as const }
}
