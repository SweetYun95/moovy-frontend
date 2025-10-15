// moovy-frontend/src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom'

// Guards
import GuestOnly from './guards/GuestOnly.tsx'
import UserOnly from './guards/UserOnly.tsx'
import AdminOnly from './guards/AdminOnly.tsx'

// 임시 플레이스홀더 (화면 출력 없음)
const Placeholder = () => null
// 페이지 import 예정

export default function AppRouter() {
  return (
    <Routes>
      {/* 공개/게스트 영역 */}
      <Route element={<GuestOnly />}>
        {/* TODO: 나중에 실제 페이지 붙이기 */}
        <Route path="__guest__" element={<Placeholder />} />
      </Route>

      {/* 로그인 유저 전용 */}
      <Route element={<UserOnly />}>
        {/* TODO: /user 등 실제 페이지 붙이기 */}
        <Route path="__user__" element={<Placeholder />} />
      </Route>

      {/* 관리자 전용 */}
      <Route element={<AdminOnly />}>
        {/* TODO: /admin 등 실제 페이지 붙이기 */}
        <Route path="__admin__" element={<Placeholder />} />
      </Route>
    </Routes>
  )
}
