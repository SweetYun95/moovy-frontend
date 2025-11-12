import React from "react";

import Human from "../../assets/Human.svg";
const HistoryPanel: React.FC = () => {
  return (
    <aside className="history-panel">
      <p>히스토리</p>
      <ul>
        <li>
          <img src={Human} alt="user icon" />
          <div className="text">
            <p>새로운 유저 가입</p> <span>59 minutes ago</span>
          </div>
        </li>
        <li>
          <img src={Human} alt="user icon" />
          <div className="text">
            <p>‘유저2’님 경고 1회</p> <span>59 minutes ago</span>
          </div>
        </li>
        <li>
          <img src={Human} alt="user icon" />
          <div className="text">
            <p>‘유저1’님 회원 삭제</p> <span>59 minutes ago</span>
          </div>
        </li>
        <li>
          <img src={Human} alt="user icon" />
          <div className="text">
            <p>새로운 유저 가입</p> <span>59 minutes ago</span>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default HistoryPanel;
