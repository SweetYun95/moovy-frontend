import React from 'react';
import './QuickMenu.scss';
import { Icon } from '@iconify/react';

/**
 * QuickMenu Props:
 * - className?: string (추가 CSS 클래스)
 */

export interface QuickMenuProps {
  className?: string;
}

export const QuickMenu: React.FC<QuickMenuProps> = ({
  className = '',
}) => {
  return (
    <div className={`quick-menu ${className}`}>
      <div className="row g-2 g-md-3">
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item">
            <span className="quick-menu__text">캘린더</span>
            <Icon icon="uim:calender" className="quick-menu__icon" />
          </div>
        </div>
        
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item">
            <span className="quick-menu__text">이벤트</span>
            <Icon icon="ic:twotone-card-giftcard" className="quick-menu__icon" />
          </div>
        </div>
        
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item">
            <span className="quick-menu__text">취향분석</span>
            <Icon icon="ic:baseline-content-paste-search" className="quick-menu__icon" />
          </div>
        </div>
        
        <div className="col-sm-6 col-md-3">
          <div className="quick-menu__item">
            <span className="quick-menu__text">내가 쓴 코멘트</span>
            <Icon icon="mdi:comment-edit-outline" className="quick-menu__icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMenu;
