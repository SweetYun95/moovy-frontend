import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { Toggle } from '../../common/Toggle/Toggle';
import { getSettings, updateSettings, disconnectSns, connectSns, withdraw, type UserSettings } from '../../../services/api/userApi';
import { logout } from '../../../services/api/authApi';
import './SettingsModal.scss';

/**
 사용법
 <SettingsModalComponent 
   isOpen={isOpen} 
   onClose={onClose} 
 />
 */

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

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSettings = {
    emailNotifications: false,
    kakaoNotifications: false,
    webPushNotifications: false,
    showActivity: false,
    kakaoLinked: false,
    googleLinked: false,
  },
  onLanguageChange,
  onWithdraw,
  onToggle,
}) => {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);

  const handleToggle = (key: keyof SettingsData) => {
    if (onToggle) {
      onToggle(key);
    } else {
      // 기본 동작 (API 연동 없이 로컬만)
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="설정" size="480px" className="settings-modal-wrapper">
      <div className="settings-modal">
        <div className="row">
          <div className="col-12">
            <section className="settings-modal__section">
          <h4 className="settings-modal__section-title">알림 설정</h4>
          
          <div className="settings-modal__item">
            <span className="settings-modal__item-label">이메일</span>
            <Toggle
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="settings-modal__item">
            <span className="settings-modal__item-label">카카오톡</span>
            <Toggle
              checked={settings.kakaoNotifications}
              onChange={() => handleToggle('kakaoNotifications')}
            />
          </div>

          <div className="settings-modal__item">
            <span className="settings-modal__item-label">웹 push</span>
            <Toggle
              checked={settings.webPushNotifications}
              onChange={() => handleToggle('webPushNotifications')}
            />
          </div>
            </section>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <section className="settings-modal__section">
          <h4 className="settings-modal__section-title">공개 범위</h4>
          
          <div className="settings-modal__item">
            <span className="settings-modal__item-label">활성화</span>
            <Toggle
              checked={settings.showActivity}
              onChange={() => handleToggle('showActivity')}
            />
          </div>
            </section>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <section className="settings-modal__section">
          <h4 className="settings-modal__section-title">SNS 연동 설정</h4>
          
          <div className="settings-modal__item">
            <span className="settings-modal__item-label">카카오</span>
            <Toggle
              checked={settings.kakaoLinked}
              onChange={() => handleToggle('kakaoLinked')}
            />
          </div>

          <div className="settings-modal__item">
            <span className="settings-modal__item-label">구글</span>
            <Toggle
              checked={settings.googleLinked}
              onChange={() => handleToggle('googleLinked')}
            />
          </div>
            </section>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <section className="settings-modal__section">
          <h4 className="settings-modal__section-title">서비스 설정</h4>
          
          <div className="settings-modal__item">
            <span className="settings-modal__item-label">언어</span>
            <select
              className="settings-modal__select"
              onChange={(e) => onLanguageChange?.(e.target.value)}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="settings-modal__item">
            <span className="settings-modal__item-label">로그아웃</span>
          </div>

          {onWithdraw && (
            <div className="settings-modal__item">
              <span
                className="settings-modal__item-label settings-modal__item-label--danger"
                onClick={onWithdraw}
              >
                탈퇴하기
              </span>
            </div>
          )}
            </section>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;

// Component wrapper with API integration
export function SettingsModalComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: false,
    kakaoNotifications: false,
    webPushNotifications: false,
    showActivity: false,
    kakaoLinked: false,
    googleLinked: false,
  });

  // 설정 로드
  React.useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  const handleToggle = async (key: keyof UserSettings) => {
    const newValue = !settings[key];
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);

    try {
      await updateSettings({ [key]: newValue });
    } catch (error) {
      console.error('설정 업데이트 실패:', error);
      // 원래 값으로 롤백
      setSettings({ ...newSettings, [key]: !newValue });
    }
  };

  const handleLanguageChange = async (language: string) => {
    console.log('언어 변경:', language);
    // TODO: 언어 설정 API 호출
  };

  const handleLogout = async () => {
    try {
      await logout();
      // TODO: 홈으로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      try {
        await withdraw();
        // TODO: 홈으로 이동
        window.location.href = '/';
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
      }
    }
  };

  return (
    <SettingsModal
      isOpen={isOpen}
      onClose={onClose}
      initialSettings={settings}
      onLanguageChange={handleLanguageChange}
      onWithdraw={handleWithdraw}
      onToggle={handleToggle}
    />
  );
}
