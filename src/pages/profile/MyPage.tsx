// src/pages/profile/MyPage.tsx

import { useState } from "react";
import { MypageTabs } from "@/components/common/Tabs";
import { Button } from "@/components/common/Button/ButtonStyle";
import { ConfirmModal, ProfileEditModalComponent } from "@/components/modals";
import { CalendarSection } from "@/components/profile/CalendarSection";
import { CommentHistorySection } from "@/components/profile/CommentHistorySection";
import { TasteAnalysisSection } from "@/components/profile/TasteAnalysisSection";
import { InquirySection } from "@/components/profile/InquirySection";

import "./MyPage.scss";

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "calendar" | "comments" | "analysis" | "inquiry"
  >("profile");
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        />
      )}
      {activeTab === "calendar" && <CalendarSection />}
      {activeTab === "comments" && <CommentHistorySection />}
      {activeTab === "analysis" && <TasteAnalysisSection />}
      {activeTab === "inquiry" && <InquirySection />}
    </div>
  );
};

export default MyPage;

// 프로필 탭 전용 하위 컴포넌트
interface ProfileTabProps {
  user: { user_id: number; email: string; name: string };
  onEditClick: () => void;
  showProfileEditModal: boolean;
  setShowProfileEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmModal: boolean;
  setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onEditClick,
  showProfileEditModal,
  setShowProfileEditModal,
  showConfirmModal,
  setShowConfirmModal,
}) => (
  <div className="row mt-5">
    <div className="col-md-4 profile">
      <div className="profile--pic" />
      <Button
        variant="primary"
        size="md"
        onClick={onEditClick}
        className="mr-2 mb-2 mt-3 btn profile--edit"
      >
        프로필 수정
      </Button>
    </div>
    <div className="col-md-8 user-info">
      <div className="row info--rank">
        <div>
          랭킹 <span>아이콘</span> 00위
        </div>
        <div className="icon setting">설정버튼</div>
      </div>
      <div className="row info--name mt-2">
        <h5>{user.name} 님</h5>
        <p>{user.email}</p>
      </div>
    </div>
    <ProfileEditModalComponent
      isOpen={showProfileEditModal}
      onClose={() => setShowProfileEditModal(false)}
      onSuccess={() => setShowConfirmModal(true)}
    />
    <ConfirmModal
      isOpen={showConfirmModal}
      onClose={() => setShowConfirmModal(false)}
      message="수정되었습니다."
    />
  </div>
);
