// src/routes/guards/UserOnly.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { isGuardBypassed } from './guardUtils'

export default function UserOnly() {
   const { isAuthenticated, loading, hydrated } = useAppSelector((s) => s.auth)
   const location = useLocation()

   if (isGuardBypassed()) return <Outlet />

   if (!hydrated || loading) return null

   if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />
   }
   return <Outlet />
}
