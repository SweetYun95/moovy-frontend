// moovy-frontend/src/routes/guards/GuestOnly.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import Spinner from '@/components/common/Spinner'
import { isGuardBypassed } from './guardUtils'
import { PATHS } from '../paths'

export default function GuestOnly() {
   const { isLoggedIn, loading } = useAppSelector((s) => s.auth)
   const location = useLocation()

   // 개발/테스트 우회
   if (isGuardBypassed()) return <Outlet />

   // 로딩 중엔 대기
   if (loading) return <Spinner />

   // 이미 로그인 중이면 유저 홈으로
   if (isLoggedIn && location.pathname !== PATHS.userHome) {
      return <Navigate to={PATHS.userHome} replace state={{ from: location }} />
   }

   return <Outlet />
}
