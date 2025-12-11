// moovy-frontend/src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/Home/MainPage";
import ContentDetailPage from "@/pages/movies/ContentDetailPage";
import ContentsListPage from "@/pages/movies/ContentsListPage";
import CommentsListPage from "@/pages/reviews/CommentsListPage";
import AuthPage from "@/pages/auth/AuthPage";
import { PATHS } from "./paths";

// Layout
import AppLayout from "@/components/layout/AppLayout";

// Guards
import GuestOnly from "./guards/GuestOnly.tsx";
import UserOnly from "./guards/UserOnly.tsx";
import AdminOnly from "./guards/AdminOnly.tsx";
import MyPage from "@/pages/profile/MyPage.tsx";
import AdminPage from "@/pages/admin/AdminPage.tsx";
import TestAuthPage from "@/pages/auth/TestAuthPage";

// 임시 플레이스홀더 (화면 출력 없음)
const Placeholder = () => null;
// 페이지 import 예정

export default function AppRouter() {
  return (
    <Routes>
      {/* 테스트 페이지 */}
      <Route path="/test/auth" element={<TestAuthPage />} />

      {/* 전역 레이아웃 (Header, Footer 포함) */}
      <Route element={<AppLayout />}>
        {/* AuthPage는 특별한 Header 표시 */}
        <Route path={PATHS.login} element={<AuthPage />} />
        <Route path={PATHS.register} element={<AuthPage />} />
        {/* 공개/게스트 영역 */}
        <Route element={<GuestOnly />}>
          {/* / → MainPage */}
          <Route path={PATHS.home} element={<MainPage />} />

          {/* /contents → ContentsListPage */}
          <Route path={PATHS.contents} element={<ContentsListPage />} />

          {/* /contents/:id → ContentDetailPage */}
          <Route
            path={PATHS.contentDetail(":id")}
            element={<ContentDetailPage />}
          />

          {/* /comments → CommentsListPage */}
          <Route path={PATHS.comments} element={<CommentsListPage />} />
        </Route>

        {/* 로그인 유저 전용 */}
        <Route element={<UserOnly />}>
          {/* TODO: /user 등 실제 페이지 붙이기 */}
          <Route path={PATHS.mypage} element={<MyPage />} />
        </Route>
      </Route>

      {/* 관리자 전용 (전역 레이아웃 제외) */}
      <Route element={<AdminOnly />}>
        {/* TODO: /admin 등 실제 페이지 붙이기 */}
        <Route path={PATHS.adminHome} element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
