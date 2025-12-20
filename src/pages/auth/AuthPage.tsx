// 외부 라이브러리
import React from "react";
import { useLocation } from "react-router-dom";

// 내부 유틸/전역/서비스
import { PATHS } from "@/routes/paths";

// 컴포넌트
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import FindIdForm from "@/components/auth/FindIdForm";
import FindPasswordForm from "@/components/auth/FindPasswordForm";

// 스타일
import "./AuthPage.scss";

type AuthMode = "login" | "register" | "find-id" | "find-password";

const AuthPage: React.FC = () => {
  const location = useLocation();
  let mode: AuthMode = "login";
  
  if (location.pathname === PATHS.register) {
    mode = "register";
  } else if (location.pathname === PATHS.findId) {
    mode = "find-id";
  } else if (location.pathname === PATHS.findPassword) {
    mode = "find-password";
  }

  return (
    <div className="auth-page">
      {mode === "login" && <LoginForm />}
      {mode === "register" && <RegisterForm />}
      {mode === "find-id" && <FindIdForm />}
      {mode === "find-password" && <FindPasswordForm />}
    </div>
  );
};

export default AuthPage;
