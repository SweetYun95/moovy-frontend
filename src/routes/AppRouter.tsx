// moovy-frontend/src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom'
import MainPage from '@/pages/Home/MainPage'
import ContentDetailPage from '@/pages/movies/ContentDetailPage'
import ContentsListPage from '@/pages/movies/ContentsListPage'
import CommentsListPage from '@/pages/reviews/CommentsListPage'
import AuthPage from '@/pages/auth/AuthPage'
import { PATHS } from './paths'

// Layout
import AppLayout from '@/components/layout/AppLayout'

// Guards
import GuestOnly from './guards/GuestOnly.tsx'
import UserOnly from './guards/UserOnly.tsx'
import AdminOnly from './guards/AdminOnly.tsx'

// 유저 페이지
import MyPage from '@/pages/profile/MyPage.tsx'
import UserPage from '@/pages/user/UserPage.tsx'
import TestAuthPage from '@/pages/auth/TestAuthPage'
import OAuthRedirectPage from '@/pages/auth/OAuthRedirectPage'
import OAuthSuccessPage from '@/pages/auth/OAuthSuccessPage'

// 어드민 페이지
import AdminPage from '@/pages/admin/AdminPage.tsx'

// 임시 플레이스홀더 (화면 출력 없음)
const Placeholder = () => null

export default function AppRouter() {
   return (
      <Routes>
         {/* 테스트 페이지 */}
         <Route path="/test/auth" element={<TestAuthPage />} />
         <Route path="/oauth" element={<OAuthRedirectPage />} />
         <Route path="/oauth/success" element={<OAuthSuccessPage />} />

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
               <Route path={PATHS.contentDetail(':id')} element={<ContentDetailPage />} />

               {/* /comments → CommentsListPage */}
               <Route path={PATHS.comments} element={<CommentsListPage />} />

               {/* 임시: 로그인 없이 접근 가능하도록 */}
               <Route path={PATHS.mypagePath} element={<MyPage />} />
               <Route path={PATHS.mypage} element={<MyPage />} />
            </Route>

            {/* 로그인 유저 전용 */}
            {/* <Route element={<UserOnly />}> */}
            {/* <Route path={PATHS.userHome} element={<UserPage />} /> */}
            <Route path={PATHS.mypage} element={<MyPage />} />
            {/* </Route> */}
         </Route>

         {/* 관리자 전용 (전역 레이아웃 제외) */}
         <Route element={<AdminOnly />}>
            {/* /admin */}
            <Route path={PATHS.adminHome} element={<AdminPage content="dashboard" />} />

            {/* /admin/dashboard */}
            <Route path={PATHS.adminDashboard} element={<AdminPage content="dashboard" />} />

            {/* /admin/users */}
            <Route path={PATHS.adminUsers} element={<AdminPage content="user" />} />

            {/* /admin/topics */}
            <Route path={PATHS.adminTopics} element={<AdminPage content="topic" />} />

            {/* /admin/inquiries */}
            <Route path={PATHS.adminInquiries} element={<AdminPage content="inquiry" />} />

            {/* /admin/reports */}
            <Route path={PATHS.adminReports} element={<AdminPage content="report" />} />
         </Route>
      </Routes>
   )
}
