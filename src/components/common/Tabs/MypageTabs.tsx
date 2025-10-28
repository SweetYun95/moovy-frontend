import React, { useState } from 'react';
import { Tabs } from './Tabs';

export const MypageTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs
      tabs={[
        { id: 'profile', label: '내 프로필' },
        { id: 'calendar', label: '캘린더' },
        { id: 'comments', label: '코멘트 내역' },
        { id: 'analysis', label: '취향 분석' },
        { id: 'inquiry', label: '1:1문의' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      variant="underline"
    />
  );
};

export default MypageTabs;
