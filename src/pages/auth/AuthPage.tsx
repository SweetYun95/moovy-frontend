// moovy-frontend/src/pages/auth/AuthPage.tsx
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import "./AuthPage.scss";

// 로그인/회원가입 모드 타입 정의
type AuthMode = "login" | "register";

const AuthPage: React.FC = () => {
  // 실제 구현 시 useState나 URL param으로 대체 가능
  const mode: AuthMode = "register";

  return (
    <div className="container">
      {mode === "login" && <LoginForm />}
      {mode === "register" && <RegisterForm />}
    </div>
  );
};

export default AuthPage;
