import LoginForm from "@/components/auth/LoginForm";
import "./AuthPage.scss";
import RegisterForm from "@/components/auth/RegisterForm";

const LoginPage = () => {
  const mode = "register";
  return (
    <div className="container">
      {mode === "login" && <LoginForm />}
      {mode === "register" && <RegisterForm />}
    </div>
  );
};

export default LoginPage;
