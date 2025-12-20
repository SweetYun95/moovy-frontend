// moovy-frontend/src/components/profile/MyProfile/ProfileTab.tsx

import { Button } from "@/components/common/Button/ButtonStyle";
import {
  ConfirmModal,
  ProfileEditModalComponent,
  SettingsModalComponent,
} from "@/components/modals";

import Avatar from "../../../assets/Avatar.png";
import BookmarkIcon from "../../../assets/bookmarkIcon.svg";
import CommentIcon from "../../../assets/commentIcon.svg";
import LikesIcon from "../../../assets/likesIcon.svg";
import SpeechIcon from "../../../assets/speechIcon.svg";
import SettingIcon from "../../../assets/settingIcon.svg";
import { InnerTableSection } from "./InnerTableSection";

export type InnerTabType = "likes" | "replies" | "bookmarks" | "comments";

interface ProfileTabProps {
  user: { user_id: number; email: string; name: string };
  onEditClick: () => void;
  showProfileEditModal: boolean;
  setShowProfileEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmModal: boolean;
  setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSettingClick: () => void;
  innerTab: InnerTabType;
  setInnerTab: React.Dispatch<React.SetStateAction<InnerTabType>>;
}
export interface SettingsData {
  // 알림 설정
  emailNotifications: boolean;
  kakaoNotifications: boolean;
  webPushNotifications: boolean;
  // 공개 범위
  showActivity: boolean;
  // SNS 연동
  kakaoLinked: boolean;
  googleLinked: boolean;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings?: SettingsData;
  onLanguageChange?: (language: string) => void;
  onWithdraw?: () => void;
  onToggle?: (key: keyof SettingsData) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onEditClick,
  showProfileEditModal,
  setShowProfileEditModal,
  showConfirmModal,
  setShowConfirmModal,
  onSettingClick,
  showSettingsModal,
  setShowSettingsModal,
  innerTab,
  setInnerTab,
}) => (
  <>
    <div className="profile_section">
      <div className="col-md-4 profile">
        <img src={Avatar} alt="프로필 사진" className="profile--pic" />
        <Button
          variant="primary"
          size="md"
          onClick={onEditClick}
          className=" btn profile--edit"
        >
          프로필 수정
        </Button>
      </div>
      <div className="col-md-8 user-info">
        <div className="row info--rank">
          <div>
            랭킹 <span>아이콘</span> 00위
          </div>
          <img
            src={SettingIcon}
            alt="설정 버튼"
            className="icon setting"
            onClick={onSettingClick}
          />
        </div>
        <div className="row info--name ">
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
      <SettingsModalComponent
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
    <div className="row inner_Tabs">
      <div className="col-md-3" onClick={() => setInnerTab("likes")}>
        <img src={LikesIcon} alt="좋아요 아이콘" />
        <div>좋아요</div>
      </div>
      <div className="col-md-3" onClick={() => setInnerTab("replies")}>
        <img src={SpeechIcon} alt="댓글함 아이콘" />
        <div>댓글함</div>
      </div>
      <div className="col-md-3" onClick={() => setInnerTab("bookmarks")}>
        <img src={BookmarkIcon} alt="보관함 아이콘" />
        <div>보관함</div>
      </div>
      <div className="col-md-3" onClick={() => setInnerTab("comments")}>
        <img src={CommentIcon} alt="코멘트 아이콘" />
        <div>코멘트</div>
      </div>
    </div>
    <InnerTableSection innerTab={innerTab} />
  </>
);

export default ProfileTab;
