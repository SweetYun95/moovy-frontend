// moovy-frontend/src/pages/auth/AuthPage.tsx
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import "./AuthPage.scss";

type AuthMode = "login" | "register";

const AuthPage: React.FC = () => {
  const mode: AuthMode = "register";

  return (
    <div className="container">
      {mode === "login" && <LoginForm />}
      {mode === "register" && <RegisterForm />}
    </div>
  );
};

export default AuthPage;
