// 외부 라이브러리
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// 내부 유틸/전역/서비스
import { PATHS } from '@/routes/paths';

// 컴포넌트
import { Header } from './Header/Header';
import Footer from './Footer/Footer';

// 스타일
import './AppLayout.scss';

export default function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === PATHS.login || location.pathname === PATHS.register;
  const isLoginPage = location.pathname === PATHS.login;
  const isRegisterPage = location.pathname === PATHS.register;

  // AuthPage일 때 body에 클래스 추가
  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('auth-page-background');
    } else {
      document.body.classList.remove('auth-page-background');
    }

    // cleanup
    return () => {
      document.body.classList.remove('auth-page-background');
    };
  }, [isAuthPage]);
  
  if (isAuthPage) {
    return (
      <div className="app-layout">
        <Header 
          showSearch={false}
          showLoginButton={!isLoginPage} // 로그인 페이지에서는 로그인 버튼 숨김
          showSignupButton={false} // AuthPage에서는 회원가입 버튼 숨김
        />
        <main className="app-layout__main">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

