// moovy-frontend/src/components/auth/LoginForm.tsx

import { useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks";
import { loginThunk } from "@/features/auth/authSlice";
import {
  EmailInput,
  PasswordInput,
} from "@/components/common/Input";
import { LoginButton } from "@/components/common/Button/Button";
import { IdSaveCheckbox } from "@/components/common/Checkbox";
import { PATHS } from "@/routes/paths";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ idOrEmail: email, password }));
  };

  return (
    <div id="loginform">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>로그인</h3>
          <div className="mb-3 mt-5 form-item">
            <label htmlFor="email">이메일</label>
            <EmailInput value={email} onChange={setEmail} />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="password">비밀번호</label>
            <PasswordInput value={password} onChange={setPassword} />
          </div>

          <IdSaveCheckbox />
          <div className="row mt-5 form-item">
            <LoginButton loginType="local" type="submit" />
          </div>
          <div className="row mt-6 form-item">
            <LoginButton loginType="google" />
          </div>
          <div className="row mt-3 form-item">
            <LoginButton loginType="kakao" />
          </div>
        </div>
      </form>

      <div className="row mt-6 auth-link">
        <Link to={PATHS.register}>회원가입</Link>
        <Link to={PATHS.findId}>아이디 찾기</Link>
        <Link to={PATHS.findPassword}>비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default LoginForm;
