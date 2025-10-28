import React, { useState } from 'react';
import './AdminFilter.scss';
import { Input } from '../../common/Input/InputStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import { DateSelector } from '../../common/DateSelector/DateSelector';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { RatingPicker } from '../../common/RatingPicker/RatingPicker';
import { Icon } from '@iconify/react';

interface WorkManagementFilterProps {
  onSearch?: (filters: Record<string, any>) => void;
}

export const WorkManagementFilter: React.FC<WorkManagementFilterProps> = ({
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
          <h3 className="filter-title mb-0">작품 관리</h3>
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
              <label className="field-label d-block">작품 제목</label>
                <Input
                  type="text"
                  placeholder="제목을 입력하세요."
                  value={filters.workTitle || ''}
                  onChange={(value) => handleFieldChange('workTitle', value)}
                  theme="light"
                />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">작품 정보</label>
                <Input
                  type="text"
                  placeholder="제목을 입력하세요."
                  value={filters.workInfo || ''}
                  onChange={(value) => handleFieldChange('workInfo', value)}
                  theme="light"
                />
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">토픽 시작-종료일</label>
                <div className="date-range-field">
                  <DatePicker
                    placeholder="시작일"
                    value={filters.topicDate_start || ''}
                    onChange={(date) => handleFieldChange('topicDate_start', date)}
                    theme="light"
                  />
                  <span className="range-separator">~</span>
                  <DatePicker
                    placeholder="종료일"
                    value={filters.topicDate_end || ''}
                    onChange={(date) => handleFieldChange('topicDate_end', date)}
                    theme="light"
                  />
                </div>
            </div>
            <div className="col-12 col-lg-4 mb-3">
              <label className="field-label d-block">개봉년도</label>
                <DateSelector
                  type="year-only"
                  value={filters.releaseYear || { year: '', month: '', day: '' }}
                  onChange={(date) => handleFieldChange('releaseYear', date)}
                  theme="light"
                  isOpen={openSelector === 'releaseYear' ? 'year' : null}
                  onOpenChange={(isOpen) => handleSelectorOpen('releaseYear', isOpen !== null)}
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
              <label className="field-label d-block">장르</label>
                <Selector
                  options={[
                    { value: 'action', label: '액션' },
                    { value: 'comedy', label: '코미디' },
                    { value: 'drama', label: '드라마' },
                    { value: 'horror', label: '공포' }
                  ]}
                  value={filters.genre || ''}
                  onChange={(value) => handleFieldChange('genre', value)}
                  placeholder="장르"
                  theme="light"
                  isOpen={openSelector === 'genre'}
                  onOpenChange={(isOpen) => handleSelectorOpen('genre', isOpen)}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
