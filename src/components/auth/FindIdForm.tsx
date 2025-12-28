import { Link } from "react-router-dom";
import { EmailInput, NameInput } from "@/components/common/Input";
import { LoginButton } from "@/components/common/Button/Button";
import { PATHS } from "@/routes/paths";

const FindIdForm = () => {
  return (
    <div id="findidform">
      <form action="submit">
        <div className="form-group">
          <h3>아이디 찾기</h3>
          <div className="mb-3 mt-5 form-item">
            <label htmlFor="name">이름</label>
            <NameInput />
          </div>
          <div className="mb-3 form-item">
            <label htmlFor="email">이메일</label>
            <EmailInput />
          </div>

          <div className="row mt-5 form-item">
            <LoginButton loginType="local" text="아이디 찾기" />
          </div>
        </div>
      </form>

      <div className="row mt-6 auth-link">
        <Link to={PATHS.login}>로그인</Link>
        <Link to={PATHS.register}>회원가입</Link>
        <Link to={PATHS.findPassword}>비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default FindIdForm;

