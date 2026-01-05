import React, { useState } from 'react';
import './AdminFilter.scss';
import { Input } from '../../common/Input/InputStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { RatingPicker } from '../../common/RatingPicker/RatingPicker';
import { Icon } from '@iconify/react';

interface CommentManagementFilterProps {
  onSearch?: (filters: Record<string, any>) => void;
}

export const CommentManagementFilter: React.FC<CommentManagementFilterProps> = ({
  onSearch,
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);
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
          <h3 className="filter-title mb-0">토픽관리</h3>
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
              <label className="field-label d-block">제목</label>
              <Input
                type="text"
                placeholder="제목을 입력하세요."
                value={filters.title || ''}
                onChange={(value) => handleFieldChange('title', value)}
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
              <label className="field-label d-block">작성일</label>
              <DatePicker
                value={filters.createdDate || ''}
                onChange={(date) => handleFieldChange('createdDate', date)}
                placeholder="날짜를 선택하세요"
                theme="light"
              />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">평점</label>
              <div className="rating-range-field">
                <RatingPicker
                  placeholder="최소 평점"
                  value={parseFloat(filters.rating_min) || undefined}
                  onChange={(rating) => handleFieldChange('rating_min', rating.toString())}
                  theme="light"
                />
                <span className="range-separator">~</span>
                <RatingPicker
                  placeholder="최대 평점"
                  value={parseFloat(filters.rating_max) || undefined}
                  onChange={(rating) => handleFieldChange('rating_max', rating.toString())}
                  theme="light"
                />
              </div>
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">상태</label>
              <Selector
                options={[
                  { value: 'active', label: '활성' },
                  { value: 'hidden', label: '숨김' },
                  { value: 'deleted', label: '삭제됨' }
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
