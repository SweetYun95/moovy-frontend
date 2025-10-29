import {
  EmailInput,
  NameInput,
  PasswordInput,
} from "@/components/common/Input";
import { LoginButton } from "@/components/common/Button/Button";
import { IdSaveCheckbox } from "@/components/common/Checkbox";

const LoginForm = () => {
  return (
    <div id="loginform">
      <form action="submit">
        <div className="form-group">
          <h3>로그인</h3>
          <div className="mb-3 mt-5 form-item">
            <label htmlFor="email">이메일</label>
            <EmailInput />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="password">비밀번호</label>
            <PasswordInput />
          </div>

          <IdSaveCheckbox />
          <div className="row mt-5 form-item">
            <LoginButton loginType="local" />
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
        <a href="">회원가입</a>
        <a href="">아이디 찾기</a>
        <a href="">비밀번호 찾기</a>
      </div>
    </div>
  );
};

export default LoginForm;
