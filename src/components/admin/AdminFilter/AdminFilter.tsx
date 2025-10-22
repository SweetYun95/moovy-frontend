import React, { useState } from 'react';
import './AdminFilter.scss';
import { Input } from '../../common/Input/Input';
import { Selector } from '../../common/Selector/Selector';
import { DateSelector } from '../../common/DateSelector/DateSelector';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { RatingPicker } from '../../common/RatingPicker/RatingPicker';
import { Icon } from '@iconify/react';

/**
 * AdminFilter Props:
 * - title: string (필터 제목)
 * - fields: FilterField[] (필터 필드 배열)
 * - onSearch?: (filters: Record<string, any>) => void (검색 실행 핸들러)
 * - className?: string (추가 CSS 클래스)
 * 
 * FilterField Props:
 * - type: 'text' | 'number' | 'number-range' | 'date' | 'select' | 'year-only' | 'date-range' | 'rating-range' (필드 타입)
 * - label: string (필드 라벨)
 * - name: string (필드 이름)
 * - placeholder?: string (플레이스홀더 텍스트)
 * - options?: { value: string, label: string }[] (선택 옵션 배열)
 * - minValue?: number (최소값)
 * - maxValue?: number (최대값)
 */

export interface AdminFilterProps {
  title: string;
  fields: FilterField[];
  onSearch?: (filters: Record<string, any>) => void;
  className?: string;
}

export interface FilterField {
  type: 'text' | 'number' | 'number-range' | 'date' | 'select' | 'year-only' | 'date-range' | 'rating-range';
  label: string;
  name: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export const AdminFilter: React.FC<AdminFilterProps> = ({
  title,
  fields,
  onSearch,
  className = '',
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
    // 통합 검색창에서 검색할 때는 모든 필드에 검색어를 적용
    const unifiedFilters = { ...filters, unifiedSearch: searchQuery };
    onSearch?.(unifiedFilters);
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={field.placeholder || `${field.label}을 입력하세요`}
            value={filters[field.name] || ''}
            onChange={(value) => handleFieldChange(field.name, value)}
            theme="light"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || '숫자를 입력하세요'}
            value={filters[field.name] || ''}
            onChange={(value) => handleFieldChange(field.name, value)}
            theme="light"
            min={0}
          />
        );

      case 'rating-range':
        return (
          <div className="rating-range-field">
            <RatingPicker
              placeholder="최소 평점"
              value={parseFloat(filters[`${field.name}_min`]) || undefined}
              onChange={(rating) => handleFieldChange(`${field.name}_min`, rating.toString())}
              theme="light"
              isOpen={openSelector === `${field.name}_min`}
              onOpenChange={(isOpen) => handleSelectorOpen(`${field.name}_min`, isOpen)}
            />
            <span className="range-separator">~</span>
            <RatingPicker
              placeholder="최대 평점"
              value={parseFloat(filters[`${field.name}_max`]) || undefined}
              onChange={(rating) => handleFieldChange(`${field.name}_max`, rating.toString())}
              theme="light"
              isOpen={openSelector === `${field.name}_max`}
              onOpenChange={(isOpen) => handleSelectorOpen(`${field.name}_max`, isOpen)}
            />
          </div>
        );

      case 'number-range':
        return (
          <div className="number-range-field">
            <Input
              type="number"
              placeholder={field.minValue?.toString() || '0'}
              value={filters[`${field.name}_min`] || ''}
              onChange={(value) => handleFieldChange(`${field.name}_min`, value)}
              theme="light"
              min={0}
            />
            <span className="range-separator">~</span>
            <Input
              type="number"
              placeholder={field.maxValue?.toString() || '10000'}
              value={filters[`${field.name}_max`] || ''}
              onChange={(value) => handleFieldChange(`${field.name}_max`, value)}
              theme="light"
              min={0}
            />
          </div>
        );

      case 'date':
        return (
          <DatePicker
            value={filters[field.name] || ''}
            onChange={(date) => handleFieldChange(field.name, date)}
            placeholder={field.placeholder || '날짜를 선택하세요'}
            theme="light"
            isOpen={openSelector === field.name}
            onOpenChange={(isOpen) => handleSelectorOpen(field.name, isOpen)}
          />
        );

      case 'year-only':
        return (
          <DateSelector
            type="year-only"
            value={filters[field.name] || { year: '', month: '', day: '' }}
            onChange={(date) => handleFieldChange(field.name, date)}
            theme="light"
            openDropdown={openSelector === field.name ? 'year' : null}
            onDropdownChange={(dropdown) => handleSelectorOpen(field.name, dropdown !== null)}
          />
        );

      case 'date-range':
        return (
          <div className="date-range-field">
            <DatePicker
              placeholder="시작일"
              value={filters[`${field.name}_start`] || ''}
              onChange={(date) => handleFieldChange(`${field.name}_start`, date)}
              theme="light"
              isOpen={openSelector === `${field.name}_start`}
              onOpenChange={(isOpen) => handleSelectorOpen(`${field.name}_start`, isOpen)}
            />
            <span className="range-separator">~</span>
            <DatePicker
              placeholder="종료일"
              value={filters[`${field.name}_end`] || ''}
              onChange={(date) => handleFieldChange(`${field.name}_end`, date)}
              theme="light"
              isOpen={openSelector === `${field.name}_end`}
              onOpenChange={(isOpen) => handleSelectorOpen(`${field.name}_end`, isOpen)}
            />
          </div>
        );

      case 'select':
        return (
          <Selector
            options={field.options || []}
            value={filters[field.name] || ''}
            onChange={(value) => handleFieldChange(field.name, value)}
            placeholder={field.placeholder || field.label}
            theme="light"
            isOpen={openSelector === field.name}
            onOpenChange={(isOpen) => handleSelectorOpen(field.name, isOpen)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`admin-filter ${className}`}>
      <div className="filter-header">
        <div className="filter-controls">
          <button 
            className="drag-handle"
            type="button"
          >
            <Icon icon="mdi:menu" />
          </button>
          <button 
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <Icon icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
          </button>
          <h3 className="filter-title">{title}</h3>
        </div>

        {isExpanded ? (
          <button 
            className="search-button"
            onClick={handleSearch}
            type="button"
          >
            <Icon icon="line-md:search" />
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
              <Icon icon="line-md:search" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-rows">
            {Array.from({ length: Math.ceil(fields.length / 3) }, (_, rowIndex) => (
              <div key={rowIndex} className="filter-row">
                {fields.slice(rowIndex * 3, (rowIndex + 1) * 3).map((field) => (
                  <div key={field.name} className="filter-field">
                    <label className="field-label">{field.label}</label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFilter;

