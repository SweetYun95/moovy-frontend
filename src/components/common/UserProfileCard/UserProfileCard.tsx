import React from 'react';
import './UserProfileCard.scss';

export interface UserProfileCardProps {
  name: string;
  reportCount: number;
  avatar?: string;
  onReportCountClick?: (data: Array<{ id: number; reason: string }>) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  reportCount,
  avatar,
  onReportCountClick,
}) => {
  const handleClick = () => {
    if (onReportCountClick) {
      // Mock 데이터 전달 (실제로는 상위 컴포넌트에서 관리)
      onReportCountClick([
        { id: 1, reason: '부적절한 언어 사용' },
        { id: 2, reason: '광고글' },
        { id: 3, reason: '도배글' },
        { id: 4, reason: '스팸 댓글' },
        { id: 5, reason: '비매너 행위' }
      ]);
    }
  };

  return (
    <div className="user-profile-card">
      <div className="user-profile-card__avatar">
        {avatar ? (
          <img src={avatar} alt={name} />
        ) : (
          <div className="user-profile-card__avatar-placeholder">
            <span>👤</span>
          </div>
        )}
      </div>
      <div className="user-profile-card__info">
        <span className="user-profile-card__name">{name}</span>
        <span 
          className={`user-profile-card__count ${onReportCountClick ? 'clickable' : ''}`}
          onClick={handleClick}
        >
          관리자 경고 {reportCount}회
        </span>
      </div>
    </div>
  );
};

export default UserProfileCard;
