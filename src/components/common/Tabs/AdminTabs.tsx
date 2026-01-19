import React, { useState, useEffect } from 'react';
import { Tabs } from './Tabs';

export const AdminTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [activeButtonTab, setActiveButtonTab] = useState('all');

  // 언더라인 탭이 변경되면 하위 탭(버튼 탭)을 첫 번째로 리셋
  useEffect(() => {
    setActiveButtonTab('all');
  }, [activeTab]);

  return (
    <>
      <Tabs
        tabs={[
          { id: 'current', label: '현재 토픽' },
          { id: 'past', label: '역대 토픽' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />
      <div className="mt-3">
        <Tabs
          tabs={[
            { id: 'all', label: '전체 보기' },
            { id: 'popular', label: '전체인기작' },
            { id: 'current', label: '현재상영작' },
            { id: 'recommended', label: '관리자추천' },
          ]}
          activeTab={activeButtonTab}
          onTabChange={setActiveButtonTab}
          variant="button"
        />
      </div>
    </>
  );
};

export default AdminTabs;
