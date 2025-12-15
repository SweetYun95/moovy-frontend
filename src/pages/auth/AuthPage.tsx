// 외부 라이브러리
import React from 'react'
import { useLocation } from 'react-router-dom'

// 내부 유틸/전역/서비스
import { PATHS } from '@/routes/paths'

// 컴포넌트
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

// 스타일
import './AuthPage.scss'

type AuthMode = 'login' | 'register'

const AuthPage: React.FC = () => {
   const location = useLocation()
   const mode: AuthMode = location.pathname === PATHS.register ? 'register' : 'login'

   return (
      <div className="auth-page">
         {mode === 'login' && <LoginForm />}
         {mode === 'register' && <RegisterForm />}
      </div>
   )
}

export default AuthPage
