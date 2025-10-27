import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../../common/Button/ButtonStyle';
import { Input } from '../../common/Input/InputStyle';
import { 
  updateProfile, 
  checkNickname, 
  withdraw, 
  getAdminUserProfile,
  updateAdminUserProfile,
  forceWithdrawUser,
  type UserProfile
} from '../../../services/api/userApi';
import './ProfileEditModal.scss';

/**
 사용법

// 일반 사용자
<ProfileEditModalComponent 
  isOpen={isOpen} 
  onClose={onClose} 
  mode="user"
/>

// 관리자
<AdminProfileEditModalComponent 
  isOpen={isOpen} 
  onClose={onClose}
  userId={123}
/>
 */

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    nickname: string;
    email: string;
    profileImage?: string;
  }) => void;
  initialData?: {
    name: string;
    nickname: string;
    email: string;
    profileImage?: string;
  };
  reportCount?: number;
  onWithdraw?: () => void;
  onCheckNickname?: (nickname: string) => Promise<boolean>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = { name: '', nickname: '', email: '' },
  reportCount = 0,
  onWithdraw,
  onCheckNickname,
}) => {
  const [name, setName] = useState(initialData.name);
  const [nickname, setNickname] = useState(initialData.nickname);
  const [email, setEmail] = useState(initialData.email);
  const [profileImage, setProfileImage] = useState(initialData.profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !nickname.trim() || !email.trim()) {
      return;
    }
    onSubmit({ name, nickname, email, profileImage });
    onClose();
  };

  const handleCheckNickname = async () => {
    if (onCheckNickname) {
      await onCheckNickname(nickname);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="480px" showCloseButton={true} titleAlign="center">
      <div className="profile-edit-modal">
        <div className="row">
          <div className="col-12">
            <div className="profile-edit-modal__avatar">
          <label htmlFor="profile-image-input" className="profile-edit-modal__avatar-wrapper">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-edit-modal__avatar-img" />
            ) : (
              <div className="profile-edit-modal__avatar-placeholder">
                <span>👤</span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="profile-image-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="profile-edit-modal__field">
          <label className="profile-edit-modal__label">이름</label>
          <Input placeholder="유저 이름" value={name} onChange={setName} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="profile-edit-modal__field">
          <label className="profile-edit-modal__label">닉네임</label>
          <Input
            placeholder="유저 닉네임"
            value={nickname}
            onChange={setNickname}
            rightButton={
              onCheckNickname
                ? {
                    text: '중복확인',
                    onClick: handleCheckNickname,
                    variant: 'primary',
                    size: 'sm',
                  }
                : undefined
            }
          />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="profile-edit-modal__field">
          <label className="profile-edit-modal__label">이메일</label>
          <Input
            type="email"
            placeholder="유저 이메일"
            value={email}
            onChange={setEmail}
          />
        </div>

        <div className="profile-edit-modal__info">
          <div className="profile-edit-modal__info-left">
            <div className="profile-edit-modal__info-row">
              <span className="profile-edit-modal__label">관리자 경고</span>
              <span className="profile-edit-modal__report-count">{reportCount}회</span>
            </div>
            <div className="profile-edit-modal__info-detail">상세보기</div>
          </div>
          {onWithdraw && (
            <Button variant="danger" onClick={onWithdraw} size="md">
              탈퇴
            </Button>
          )}
        </div>

        <div className="profile-edit-modal__actions">
          <Button variant="primary" onClick={handleSubmit} fullWidth>
            수정
          </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;

// Component wrapper with API integration
export function ProfileEditModalComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    nickname: string;
    email: string;
    profileImage?: string;
  }) => {
    setIsLoading(true);
    try {
      await updateProfile({
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        profileImage: data.profileImage,
      });
      onClose();
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckNickname = async (nickname: string): Promise<boolean> => {
    try {
      const result = await checkNickname({ nickname });
      return result.available;
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      return false;
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      setIsLoading(true);
      try {
        await withdraw();
        onClose();
        // TODO: 로그아웃 처리 및 홈으로 이동
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        // TODO: 에러 토스트 메시지 표시
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ProfileEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={{
        name: '유저 이름',
        nickname: '유저 닉네임',
        email: 'user@example.com',
      }}
      reportCount={0}
      onWithdraw={handleWithdraw}
      onCheckNickname={handleCheckNickname}
    />
  );
}

// 관리자용 Component wrapper
export function AdminProfileEditModalComponent({ 
  isOpen, 
  onClose,
  userId
}: { 
  isOpen: boolean
  onClose: () => void
  userId: number
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<UserProfile | null>(null);

  // 사용자 데이터 로드
  React.useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    try {
      const data = await getAdminUserProfile(userId);
      setInitialData(data);
    } catch (error) {
      console.error('사용자 데이터 로드 실패:', error);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    nickname: string;
    email: string;
    profileImage?: string;
  }) => {
    setIsLoading(true);
    try {
      await updateAdminUserProfile(userId, {
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        profileImage: data.profileImage,
      });
      onClose();
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceWithdraw = async () => {
    if (window.confirm('정말 강제 탈퇴 처리하시겠습니까?')) {
      setIsLoading(true);
      try {
        await forceWithdrawUser(userId, '관리자에 의한 강제 탈퇴');
        onClose();
        // TODO: 사용자 목록 새로고침
      } catch (error) {
        console.error('강제 탈퇴 실패:', error);
        // TODO: 에러 토스트 메시지 표시
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!initialData) {
    return null; // 로딩 중
  }

  return (
    <ProfileEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={{
        name: initialData.name,
        nickname: initialData.nickname,
        email: initialData.email,
        profileImage: initialData.avatarUrl,
      }}
      reportCount={initialData.reportCount}
      onWithdraw={handleForceWithdraw}
      // 관리자는 닉네임 중복 확인 불필요
    />
  );
}
