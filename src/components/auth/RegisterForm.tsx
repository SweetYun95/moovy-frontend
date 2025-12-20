// moovy-frontend/src/components/auth/RegisterForm.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  EmailInput,
  NameInput,
  NicknameInput,
  PasswordInput,
} from "@/components/common/Input";
import { LoginButton } from "@/components/common/Button/Button";
import { PasswordCheckInput } from "../common/Input/InputComponents";
import { PATHS } from "@/routes/paths";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const registerData = {
      name,
      nick,
      email,
      password,
      checkPassword,
    };
    // 회원가입 함수 넣기
  };

  return (
    <div id="registerform">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>회원가입</h3>
          <div className="mb-3 mt-5 form-item">
            <label htmlFor="name">이름</label>
            <NameInput value={name} onChange={setName} />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="nickname">닉네임</label>
            <NicknameInput value={nick} onChange={setNick} />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="email">이메일</label>
            <EmailInput value={email} onChange={setEmail} />
          </div>
          <div className="mb-3 form-item gap">
            <label htmlFor="password">비밀번호</label>
            <PasswordInput value={password} onChange={setPassword} />
            <PasswordCheckInput
              value={checkPassword}
              onChange={setCheckPassword}
            />
          </div>

          <div className="row mt-5 form-item">
            <LoginButton loginType="register" type="submit" />
          </div>
        </div>
      </form>

      <div className="row mt-6 auth-link">
        <Link to={PATHS.login}>로그인</Link>
        <Link to={PATHS.findId}>아이디 찾기</Link>
        <Link to={PATHS.findPassword}>비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
