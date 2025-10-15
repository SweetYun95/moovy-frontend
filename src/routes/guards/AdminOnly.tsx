// src/routes/guards/AdminOnly.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { isGuardBypassed } from './guardUtils'

export default function AdminOnly() {
   const { isAuthenticated, user, loading, hydrated } = useAppSelector((s) => s.auth)
   const role = user?.role ?? 'GUEST'
   const location = useLocation()

   if (isGuardBypassed()) return <Outlet /> // 개발 모드 우회

   if (!hydrated || loading) return null // 하이드레이션/로딩 중엔 대기

   if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />
   }
   if (role !== 'ADMIN') {
      return <Navigate to="/user" replace state={{ from: location }} />
   }
   return <Outlet />
}
