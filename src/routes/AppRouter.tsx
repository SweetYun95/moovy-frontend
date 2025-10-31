// moovy-frontend/src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/Home/MainPage";
import ContentDetailPage from "@/pages/movies/ContentDetailPage";
import CommentsListPage from "@/pages/reviews/CommentsListPage";
import TestPage from "@/pages/TestPage";
import { PATHS } from "./paths";

// Guards
import GuestOnly from "./guards/GuestOnly.tsx";
import UserOnly from "./guards/UserOnly.tsx";
import AdminOnly from "./guards/AdminOnly.tsx";
import MyPage from "@/pages/profile/MyPage.tsx";

// 임시 플레이스홀더 (화면 출력 없음)
const Placeholder = () => null;
// 페이지 import 예정

export default function AppRouter() {
  return (
    <Routes>
      {/* 공개/게스트 영역 */}
      <Route element={<GuestOnly />}>
        {/* / → MainPage */}
        <Route path={PATHS.home} element={<MainPage />} />

        {/* /contents/:id → ContentDetailPage */}
        <Route
          path={PATHS.contentDetail(":id")}
          element={<ContentDetailPage />}
        />

        {/* /comments → CommentsListPage */}
        <Route path={PATHS.comments} element={<CommentsListPage />} />

        {/* /test → TestPage (component demo) */}
        <Route path={PATHS.test} element={<TestPage />} />
      </Route>

      {/* 로그인 유저 전용 */}
      <Route element={<UserOnly />}>
        {/* TODO: /user 등 실제 페이지 붙이기 */}
        <Route path={PATHS.mypage} element={<MyPage />} />
      </Route>

      {/* 관리자 전용 */}
      <Route element={<AdminOnly />}>
        {/* TODO: /admin 등 실제 페이지 붙이기 */}
        <Route path="__admin__" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}
