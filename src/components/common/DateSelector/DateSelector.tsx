import React, { useState, useRef, useEffect } from 'react';
import './DateSelector.scss';
import { Icon } from '@iconify/react';

export interface DateSelectorProps {
  value?: {
    year: string;
    month: string;
    day: string;
  };
  onChange?: (date: { year: string; month: string; day: string }) => void;
  className?: string;
  id?: string;
  type?: 'full' | 'year-only';
  theme?: 'dark' | 'light';
  isOpen?: 'year' | null;
  onOpenChange?: (isOpen: 'year' | null) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  value = { year: '', month: '', day: '' },
  onChange,
  className = '',
  id,
  type = 'year-only',
  theme = 'dark',
  isOpen: externalIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<'year' | null>(null);
  const [selectedDate, setSelectedDate] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // isOpen이 true인지 확인 (년도 선택 드롭다운이 열려있는지)
  const isDropdownOpen = isOpen === 'year';

  // 초기 value 동기화
  useEffect(() => {
    setSelectedDate(value);
  }, [value.year, value.month, value.day]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (onOpenChange) {
          onOpenChange(null);
        } else {
          setInternalIsOpen(null);
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen, onOpenChange]);

  const handleYearSelect = (year: string) => {
    const newDate = { ...selectedDate, year };
    setSelectedDate(newDate);
    onChange?.(newDate);
    
    if (onOpenChange) {
      onOpenChange(null);
    } else {
      setInternalIsOpen(null);
    }
  };

  const toggleDropdown = () => {
    const newIsOpen = isDropdownOpen ? null : 'year';
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const displayValue = selectedDate.year ? `${selectedDate.year}년` : '년도';

  // year-only: 단순한 연도 선택
  if (type === 'year-only') {
    return (
      <div className={`moovy-date-selector year-only ${theme === 'light' ? 'light-theme' : ''} ${className}`} id={id} ref={dropdownRef}>
        <div
          className={`date-trigger ${isDropdownOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
        >
          <span className={selectedDate.year ? 'selected' : 'placeholder'}>
            {displayValue}
          </span>
          <Icon 
            icon="mdi:chevron-down" 
            style={{ 
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </div>

        {isDropdownOpen && (
          <div className="date-dropdown">
            {years.map(year => {
              const yearStr = year.toString();
              const isSelected = selectedDate.year === yearStr;
              return (
                <div
                  key={year}
                  className={`date-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleYearSelect(yearStr)}
                >
                  {year}년
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // full: 연도, 월, 일 선택 (더 복잡하지만 필요한 경우를 위해 유지)
  return null; // 현재는 year-only만 사용
};

export default DateSelector;