// moovy-frontend/src/routes/guards/UserOnly.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import Spinner from '@/components/common/Spinner'
import { isGuardBypassed } from './guardUtils'
import { PATHS } from '../paths'

export default function UserOnly() {
   const { isLoggedIn, loading } = useAppSelector((s) => s.auth)
   const location = useLocation()

   if (isGuardBypassed()) return <Outlet />

   if (loading) return <Spinner />

   if (!isLoggedIn) {
      return <Navigate to={PATHS.login} replace state={{ from: location }} />
   }

   return <Outlet />
}
