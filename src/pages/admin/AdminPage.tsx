import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import HistoryPanel from "../../components/admin/HistoryPanel";
import "./AdminPage.scss";
import Table from "@/components/admin/Table";

interface AdminProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
}

const AdminPage: React.FC<AdminProps> = ({ content }) => {
  const [activeSideBar, setActiveSideBar] = useState<
    "dashboard" | "user" | "topic" | "inquiry" | "report"
  >("dashboard");

  const changeActiveSideBar = (e: React.MouseEvent<HTMLLIElement>) => {
    const value = e.currentTarget.getAttribute("value");
    setActiveSideBar(value);
  };

  return (
    <div className="layout">
      <Sidebar
        content={activeSideBar}
        changeActiveSideBar={changeActiveSideBar}
      />
      <div className="main">
        <Header content={activeSideBar} />
        <Table content={activeSideBar} />
      </div>
      <HistoryPanel />
      {/* 아래로 토픽 관리 탭 넣기 */}
    </div>
  );
};

export default AdminPage;
