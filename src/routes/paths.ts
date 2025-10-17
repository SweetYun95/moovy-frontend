// moovy-frontend/src/routes/paths.ts

// 라우트 상수(필요시 여기서만 수정)
export const PATHS = {
   root: '/',
   login: '/login',
   register: '/register',
   userHome: '/user',
   adminHome: '/admin',

   movies: '/movies',
   movieDetail: (id: string | number) => `/movies/${id}`,

   reviews: '/reviews',
   reviewWrite: '/reviews/new',
   reviewDetail: (id: string | number) => `/reviews/${id}`,

   profile: '/profile',
} as const

// 상수 키 타입 (오타 방지용)
export type PathKey = keyof typeof PATHS

// 로그인 후 “원래 가려던 곳”으로 보내기 위해 state.from 안전 추출
export function extractReturnPath(state: unknown, fallback: string = PATHS.userHome): string {
   try {
      const s = state as { from?: { pathname?: string } }
      return s?.from?.pathname || fallback
   } catch {
      return fallback
   }
}
