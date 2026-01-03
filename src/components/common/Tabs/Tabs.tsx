import React from 'react';
import './Tabs.scss';

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'underline' | 'button'; // 언더라인 스타일 or 버튼 스타일
  className?: string;
  admin?: boolean; // 관리자 페이지용 스타일 적용
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  className = '',
  admin = false,
}) => {
  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (!disabled && tabId !== activeTab) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={`tabs tabs--${variant} ${admin ? 'tabs--admin' : ''} ${className}`}>
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tabs__tab ${
              activeTab === tab.id ? 'tabs__tab--active' : ''
            } ${tab.disabled ? 'tabs__tab--disabled' : ''}`}
            onClick={() => handleTabClick(tab.id, tab.disabled)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

