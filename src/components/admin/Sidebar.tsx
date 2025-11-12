import React from "react";

import Moovy from "../../assets/moovy-logo.svg";
import ChartPieSlice from "../../assets/ChartPieSlice.svg";
import Identification from "../../assets/Identification.svg";
import Notebook from "../../assets/Notebook.svg";
import Inquiry from "../../assets/inquiry.svg";
import Warning from "../../assets/warning.svg";
import ByeWind from "../../assets/ByeWind.svg";
import Settings from "../../assets/settings.svg";

interface SidebarProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
  changeActiveSideBar: (e: React.MouseEvent<HTMLLIElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ content, changeActiveSideBar }) => {
  return (
    <aside className="sidebar">
      <img src={Moovy} alt="logo" />
      <nav className="sidebar--tap">
        <ul>
          <li
            className={content === "dashboard" ? "active" : ""}
            value={"dashboard"}
            onClick={changeActiveSideBar}
          >
            <img src={ChartPieSlice} alt="dashboard-icon" />
            대시보드
          </li>
          <li
            className={content === "user" ? "active" : ""}
            value={"user"}
            onClick={changeActiveSideBar}
          >
            <img src={Identification} alt="user-icon" />
            유저 관리
          </li>
          <li
            className={content === "topic" ? "active" : ""}
            value={"topic"}
            onClick={changeActiveSideBar}
          >
            <img src={Notebook} alt="topic-icon" />
            토픽 관리
          </li>
          <li
            className={content === "inquiry" ? "active" : ""}
            value={"inquiry"}
            onClick={changeActiveSideBar}
          >
            <img src={Inquiry} alt="inquiry-icon" />
            1:1 문의
          </li>
          <li
            className={content === "report" ? "active" : ""}
            value={"report"}
            onClick={changeActiveSideBar}
          >
            <img src={Warning} alt="warning-icon" />
            신고 내역
          </li>
        </ul>
      </nav>
      <div className="admin--tap">
        <div className="admin-profile">
          <img src={ByeWind} alt="admin profile" />
          <p>관리자아이디</p>
        </div>
        <img src={Settings} alt="setting-icon" />
      </div>
      <a href="#">로그아웃</a>
    </aside>
  );
};

export default Sidebar;
