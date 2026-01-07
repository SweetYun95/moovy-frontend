// moovy-frontend/src/components/admin/HistoryPanel.tsx

import React from "react";

import Human from "../../assets/Human.svg";

interface HistoryPanelProps {
  className?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ className }) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // 히스토리 패널 내부 클릭 시 이벤트 전파 방지 (오버레이 닫기 방지)
    e.stopPropagation();
  };

  return (
    <aside
      className={`history-panel ${className || ""}`}
      onClick={handleClick}
    >
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
