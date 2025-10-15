// src/routes/guards/GuestOnly.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { isGuardBypassed } from './guardUtils'

export default function GuestOnly() {
   const { isAuthenticated, loading, hydrated } = useAppSelector((s) => s.auth)
   const location = useLocation()

   if (isGuardBypassed()) return <Outlet />

   if (!hydrated || loading) return null

   if (isAuthenticated && location.pathname !== '/user') {
      return <Navigate to="/user" replace state={{ from: location }} />
   }
   return <Outlet />
}
