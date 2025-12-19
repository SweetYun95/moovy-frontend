// moovy-frontend/src/components/admin/Header.tsx

import React from "react";

import SideBar from "../../assets/Sidebar.svg";
import Clockwise from "../../assets/Clockwise.svg";
import Bell from "../../assets/Bell.svg";

interface HeaderProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
}

const Header: React.FC<HeaderProps> = ({ content }) => {
  let title = "";
  switch (content) {
    case "dashboard":
      title = "관리자 대시보드";
      break;
    case "user":
      title = "유저 관리";
      break;
    case "topic":
      title = "토픽 관리";
      break;
    case "inquiry":
      title = "1:1 문의";
      break;
    case "report":
      title = "신고 내역";
      break;
  }

  return (
    <header className="header">
      <div className="header-left">
        <img src={SideBar} alt="sidebar icon" />
        <p>{title}</p>
      </div>
      <div className="header-right">
        <div className="icons">
          <img src={Clockwise} alt="Clockwise icon" />
          <img src={Bell} alt="Bell icon" />
          <img src={SideBar} alt="Sidebar icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
