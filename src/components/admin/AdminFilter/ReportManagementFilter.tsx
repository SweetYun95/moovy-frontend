import React, { useState } from 'react';
import './AdminFilter.scss';
import { Input } from '../../common/Input/InputStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { Icon } from '@iconify/react';

interface ReportManagementFilterProps {
  onSearch?: (filters: Record<string, any>) => void;
}

export const ReportManagementFilter: React.FC<ReportManagementFilterProps> = ({
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
          <h3 className="filter-title mb-0">신고 관리</h3>
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
              <label className="field-label d-block">신고 유저</label>
              <Input
                type="text"
                placeholder="이름을 입력하세요."
                value={filters.reporter || ''}
                onChange={(value) => handleFieldChange('reporter', value)}
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">신고한 유저</label>
              <Input
                type="text"
                placeholder="이름을 입력하세요."
                value={filters.reported || ''}
                onChange={(value) => handleFieldChange('reported', value)}
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">분류</label>
              <Selector
                options={[
                  { value: 'spam', label: '스팸' },
                  { value: 'abuse', label: '욕설' },
                  { value: 'inappropriate', label: '부적절한 내용' }
                ]}
                value={filters.category || ''}
                onChange={(value) => handleFieldChange('category', value)}
                placeholder="분류"
                theme="light"
                isOpen={openSelector === 'category'}
                onOpenChange={(isOpen) => handleSelectorOpen('category', isOpen)}
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">내용</label>
              <Input
                type="text"
                placeholder="내용을 입력하세요."
                value={filters.content || ''}
                onChange={(value) => handleFieldChange('content', value)}
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">작성일</label>
              <DatePicker
                value={filters.createdDate || ''}
                onChange={(date) => handleFieldChange('createdDate', date)}
                placeholder="날짜를 선택하세요"
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">상태</label>
              <Selector
                options={[
                  { value: 'pending', label: '대기중' },
                  { value: 'processing', label: '처리중' },
                  { value: 'resolved', label: '해결됨' }
                ]}
                value={filters.status || ''}
                onChange={(value) => handleFieldChange('status', value)}
                placeholder="상태"
                theme="light"
                isOpen={openSelector === 'status'}
                onOpenChange={(isOpen) => handleSelectorOpen('status', isOpen)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
