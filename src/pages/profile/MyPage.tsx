// src/pages/profile/MyPage.tsx

import { useState } from "react";
import { MypageTabs } from "@/components/common/Tabs";
import { CalendarSection } from "@/components/profile/CalendarSection";
import { CommentHistorySection } from "@/components/profile/CommentHistorySection";
import { TasteAnalysisSection } from "@/components/profile/TasteAnalysisSection";
import { InquirySection } from "@/components/profile/InquirySection";

import "./MyPage.scss";
import ProfileTab from "@/components/profile/MyProfile/ProfileTab";

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "calendar" | "comments" | "analysis" | "inquiry"
  >("profile");
  const [innerTab, setInnerTab] = useState<
    "myProfile" | "likes" | "replies" | "bookmarks" | "comments"
  >("myProfile");
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const user = {
    user_id: 1,
    email: "moovy@gmail.com",
    name: "영화 보는 호랑이",
  };

  return (
    <div className="container">
      <div className="row">
        <MypageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "profile" && (
        <ProfileTab
          user={user}
          onEditClick={() => setShowProfileEditModal(true)}
          showProfileEditModal={showProfileEditModal}
          setShowProfileEditModal={setShowProfileEditModal}
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          onSettingClick={() => setShowSettingsModal(true)}
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={setShowSettingsModal}
          innerTab={innerTab}
          setInnerTab={setInnerTab}
        />
      )}
      {activeTab === "calendar" && <CalendarSection />}
      {activeTab === "analysis" && <TasteAnalysisSection />}
      {activeTab === "inquiry" && <InquirySection />}
    </div>
  );
};

export default MyPage;
