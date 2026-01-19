// 외부 라이브러리
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

// 내부 유틸/전역/서비스
import { useAppSelector } from '@/app/hooks';
import { PATHS } from '@/routes/paths';

// 스타일
import './QuickMenu.scss';

export interface QuickMenuProps {
  className?: string;
}

export const QuickMenu: React.FC<QuickMenuProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleMenuClick = () => {
    if (!isAuthenticated) {
      navigate(PATHS.login);
    }
    // TODO: 로그인된 경우 각 메뉴별 페이지로 이동
  };

  const handleContentsClick = () => {
    // 전체 작품 보기는 로그인 상태와 관계없이 컨텐츠 리스트 페이지로 이동
    navigate(PATHS.contents);
  };

  return (
    <div className={`quick-menu ${className}`}>
      <div className="row g-2 g-md-3">
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item" onClick={handleContentsClick}>
            <span className="quick-menu__text">전체 작품 보기</span>
            <Icon icon="mingcute:content-ai-fill" className="quick-menu__icon" />
          </div>
        </div>
        
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item" onClick={handleMenuClick}>
            <span className="quick-menu__text">캘린더</span>
            <Icon icon="uim:calender" className="quick-menu__icon" />
          </div>
        </div>
        
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item" onClick={handleMenuClick}>
            <span className="quick-menu__text">취향분석</span>
            <Icon icon="ic:baseline-content-paste-search" className="quick-menu__icon" />
          </div>
        </div>
        
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item" onClick={handleMenuClick}>
            <span className="quick-menu__text">내가 쓴 코멘트</span>
            <Icon icon="mdi:comment-edit-outline" className="quick-menu__icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMenu;
