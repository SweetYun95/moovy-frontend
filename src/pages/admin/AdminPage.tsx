import "./AdminPage.scss";

const AdminPage: React.FC = () => {
  return (
    <div id="admin">
      <div className="admin--menu">
        <img src="/" alt="로고" />
        <div className="admin__group">
          <div className="menu__tab">
            <div>대시보드</div>
            <div>유저 관리</div>
            <div>토픽 관리</div>
            <div>1:1 문의</div>
            <div>신고내역</div>
          </div>
          <div className="admin__tab">
            <div className="profile">
              <img src="/" alt="이미지" />
              <p>관리자 아이디</p>
              <img src="/" alt="설정" />
            </div>
            <a href="/">로그아웃</a>
          </div>
        </div>
      </div>
      <div className="admin--content">
        <div className="container">컨텐츠</div>
      </div>
      <div className="admin--history">히스토리</div>
    </div>
  );
};

export default AdminPage;
