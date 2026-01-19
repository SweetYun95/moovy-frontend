import React from "react";
import { Tabs } from "./Tabs";

// 각 탭 id를 문자열 유니언으로 명시
type TabId = "profile" | "calendar" | "comments" | "analysis" | "inquiry";

interface MypageTabsProps {
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
}

export const MypageTabs: React.FC<MypageTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  return (
    <Tabs
      tabs={[
        { id: "profile", label: "내 프로필" },
        { id: "calendar", label: "캘린더" },
        { id: "analysis", label: "취향 분석" },
        { id: "inquiry", label: "1:1문의" },
      ]}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      variant="underline"
    />
  );
};

export default MypageTabs;
