// moovy-frontend/src/App.tsx
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks.ts'
// import { hydrateAuthThunk } from './features/auth/authSlice.ts'
import AppRouter from './routes/AppRouter'

export default function App() {
   // const dispatch = useAppDispatch()
   // const { loading } = useAppSelector((s) => s.auth)

   // useEffect(() => {
   //    // 앱 부팅 시 세션/토큰 동기화
   //    dispatch(hydrateAuthThunk())
   // }, [dispatch])

   // 하이드레이션 완료 전 대기 (필요하면 스피너로 교체)
   // if (/*!hydrated ||*/ loading) return null

   return <AppRouter />
}
