// src/pages/profile/MyPage.tsx

import { useState, useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { MypageTabs } from "@/components/common/Tabs";
import { CalendarSection } from "@/components/profile/CalendarSection";
import { CommentHistorySection } from "@/components/profile/CommentHistorySection";
import { TasteAnalysisSection } from "@/components/profile/TasteAnalysisSection";
import { InquirySection } from "@/components/profile/InquirySection";

import "./MyPage.scss";
import ProfileTab from "@/components/profile/MyProfile/ProfileTab";
import ReplyForm from "@/components/modals/CommentDetailModal/ReplyForm";

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "calendar" | "comments" | "analysis" | "inquiry"
  >("profile");
  const [innerTab, setInnerTab] = useState<
    "likes" | "replies" | "bookmarks" | "comments" | null
  >(null);

  // activeTab이 "profile"로 변경될 때 innerTab 리셋
  useEffect(() => {
    if (activeTab === "profile") {
      setInnerTab(null);
    }
  }, [activeTab]);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // authSlice에서 user 데이터 가져오기
  const authUser = useAppSelector((state) => state.auth.user);
  
  // user가 없을 때를 대비한 기본값 설정
  const user = authUser
    ? {
        user_id: parseInt(authUser.user_id, 10) || 0,
        email: authUser.email || "",
        name: authUser.name || "",
      }
    : {
        user_id: 0,
        email: "",
        name: "",
  };

  return (
    <div className="container mypage-container">
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
