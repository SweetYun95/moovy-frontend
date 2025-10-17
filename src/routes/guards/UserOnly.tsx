// moovy-frontend/src/routes/guards/UserOnly.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import Spinner from '@/components/common/Spinner'
import { isGuardBypassed } from './guardUtils'
import { PATHS } from '../paths'

export default function UserOnly() {
   const { isAuthenticated, loading, hydrated } = useAppSelector((s) => s.auth)
   const location = useLocation()

   // 개발/테스트 우회
   if (isGuardBypassed()) return <Outlet />

   // 초기 세션 동기화/로딩 중엔 대기
   if (!hydrated || loading) return <Spinner />

   // 비로그인 → 로그인으로
   if (!isAuthenticated) {
      return <Navigate to={PATHS.login} replace state={{ from: location }} />
   }

   return <Outlet />
}
