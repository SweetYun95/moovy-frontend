import React, { useState } from 'react';
import './AdminFilter.scss';
import { Input } from '../../common/Input/InputStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import { Icon } from '@iconify/react';

interface UserManagementFilterProps {
  onSearch?: (filters: Record<string, any>) => void;
}

export const UserManagementFilter: React.FC<UserManagementFilterProps> = ({
  onSearch,
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSelector, setOpenSelector] = useState<string | null>(null);

  const handleFieldChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectorOpen = (selectorId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenSelector(selectorId);
    } else {
      setOpenSelector(null);
    }
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleUnifiedSearch = () => {
    const unifiedFilters = { ...filters, unifiedSearch: searchQuery };
    onSearch?.(unifiedFilters);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="admin-filter">
      <div className="filter-header">
        <div className="d-flex">
          <button 
            className="filter-icon-button"
            type="button"
          >
            <Icon icon="mdi:menu" style={{ fontSize: 'icon-md' }} />
          </button>
          <button 
            className="filter-icon-button"
            onClick={handleToggleExpand}
            type="button"
          >
            <Icon icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} style={{ fontSize: 'icon-md' }} />
          </button>
          <h3 className="filter-title mb-0">유저 관리</h3>
        </div>

        {isExpanded ? (
          <button 
            className="search-button"
            onClick={handleSearch}
            type="button"
          >
            <Icon icon="line-md:search" style={{ fontSize: 'icon-sm' }} />
            Search
          </button>
        ) : (
          <div className="unified-search-wrapper">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="unified-search-input"
            />
            <button 
              className="unified-search-icon"
              onClick={handleUnifiedSearch}
              type="button"
            >
              <Icon icon="line-md:search" style={{ fontSize: 'icon-sm' }} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="row g-3">
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">유저 이름</label>
              <Input
                type="text"
                placeholder="이름을 입력하세요."
                value={filters.userName || ''}
                onChange={(value) => handleFieldChange('userName', value)}
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">닉네임</label>
              <Input
                type="text"
                placeholder="닉네임을 입력하세요."
                value={filters.nickname || ''}
                onChange={(value) => handleFieldChange('nickname', value)}
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">이메일</label>
              <Input
                type="text"
                placeholder="이메일을 입력하세요."
                value={filters.email || ''}
                onChange={(value) => handleFieldChange('email', value)}
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">댓글</label>
              <div className="number-range-field">
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.comments_min || ''}
                  onChange={(value) => handleFieldChange('comments_min', value)}
                  theme="light"
                  min={0}
                />
                <span className="range-separator">~</span>
                <Input
                  type="number"
                  placeholder="10000"
                  value={filters.comments_max || ''}
                  onChange={(value) => handleFieldChange('comments_max', value)}
                  theme="light"
                  min={0}
                />
              </div>
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">코멘트</label>
              <div className="number-range-field">
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.comments2_min || ''}
                  onChange={(value) => handleFieldChange('comments2_min', value)}
                  theme="light"
                  min={0}
                />
                <span className="range-separator">~</span>
                <Input
                  type="number"
                  placeholder="10000"
                  value={filters.comments2_max || ''}
                  onChange={(value) => handleFieldChange('comments2_max', value)}
                  theme="light"
                  min={0}
                />
              </div>
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">관리자경고</label>
              <Selector
                options={[
                  { value: 'none', label: '없음' },
                  { value: 'warning', label: '경고' },
                  { value: 'ban', label: '차단' }
                ]}
                value={filters.adminWarning || ''}
                onChange={(value) => handleFieldChange('adminWarning', value)}
                placeholder="관리자경고"
                theme="light"
                isOpen={openSelector === 'adminWarning'}
                onOpenChange={(isOpen) => handleSelectorOpen('adminWarning', isOpen)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
