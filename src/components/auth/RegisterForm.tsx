import { Link } from "react-router-dom";
import {
  EmailInput,
  Input,
  NameInput,
  NicknameInput,
  PasswordInput,
} from "@/components/common/Input";
import { LoginButton } from "@/components/common/Button/Button";
import { IdSaveCheckbox } from "@/components/common/Checkbox";
import { PasswordCheckInput } from "../common/Input/InputComponents";
import { PATHS } from "@/routes/paths";

const RegisterForm = () => {
  return (
    <div id="registerform">
      <form action="submit">
        <div className="form-group">
          <h3>회원가입</h3>
          <div className="mb-3 mt-5 form-item">
            <label htmlFor="name">이름</label>
            <NameInput />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="nickname">닉네임</label>
            <NicknameInput />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="email">이메일</label>
            <EmailInput />
          </div>
          <div className="mb-3 form-item gap">
            <label htmlFor="password">비밀번호</label>
            <PasswordInput />
            <PasswordCheckInput />
          </div>

          <div className="row mt-5 form-item">
            <LoginButton loginType="register" />
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
