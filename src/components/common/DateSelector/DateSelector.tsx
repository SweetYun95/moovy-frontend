import React, { useState, useEffect } from 'react';
import './DateSelector.scss';
import { Icon } from '@iconify/react';

/**
 * DateSelector Props:
 * - value?: { year: string, month: string, day: string } (선택된 날짜)
 * - onChange?: (date: { year: string, month: string, day: string }) => void (날짜 변경 핸들러)
 * - className?: string (추가 CSS 클래스)
 * - id?: string (요소 ID)
 * - type?: 'full' | 'year-only' (날짜 선택 타입)
 * - openDropdown?: 'year' | 'month' | 'day' | null (열린 드롭다운)
 * - onDropdownChange?: (dropdown: 'year' | 'month' | 'day' | null) => void (드롭다운 변경 핸들러)
 * - theme?: 'dark' | 'light' (테마)
 */

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
  openDropdown?: 'year' | 'month' | 'day' | null;
  onDropdownChange?: (dropdown: 'year' | 'month' | 'day' | null) => void;
  theme?: 'dark' | 'light';
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  value = { year: '', month: '', day: '' },
  onChange,
  className = '',
  id,
  type = 'full',
  openDropdown: externalOpenDropdown,
  onDropdownChange,
  theme = 'dark',
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const [internalOpenDropdown, setInternalOpenDropdown] = useState<'year' | 'month' | 'day' | null>(null);
  const openDropdown = externalOpenDropdown !== undefined ? externalOpenDropdown : internalOpenDropdown;

  useEffect(() => {
    if (value && (value.year !== selectedDate.year || value.month !== selectedDate.month || value.day !== selectedDate.day)) {
      setSelectedDate(value);
    }
  }, [value.year, value.month, value.day, selectedDate.year, selectedDate.month, selectedDate.day]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleYearChange = (year: string) => {
    const newDate = { ...selectedDate, year };
    setSelectedDate(newDate);
    onChange?.(newDate);
    if (onDropdownChange) {
      onDropdownChange(null);
    } else {
      setInternalOpenDropdown(null);
    }
  };

  const handleMonthChange = (month: string) => {
    const newDate = { ...selectedDate, month };
    setSelectedDate(newDate);
    onChange?.(newDate);
    if (onDropdownChange) {
      onDropdownChange(null);
    } else {
      setInternalOpenDropdown(null);
    }
  };

  const handleDayChange = (day: string) => {
    const newDate = { ...selectedDate, day };
    setSelectedDate(newDate);
    onChange?.(newDate);
    if (onDropdownChange) {
      onDropdownChange(null);
    } else {
      setInternalOpenDropdown(null);
    }
  };

  const toggleDropdown = (field: 'year' | 'month' | 'day') => {
    const newDropdown = openDropdown === field ? null : field;
    if (onDropdownChange) {
      onDropdownChange(newDropdown);
    } else {
      setInternalOpenDropdown(newDropdown);
    }
  };

  const getDisplayValue = (field: 'year' | 'month' | 'day') => {
    const value = selectedDate[field];
    if (!value) return field === 'year' ? '년도' : field === 'month' ? '월' : '일';
    return field === 'year' ? `${value}년` : field === 'month' ? `${value}월` : `${value}일`;
  };

  if (type === 'year-only') {
    return (
      <div className={`moovy-date-selector year-only ${theme === 'light' ? 'light-theme' : ''} ${className}`} id={id}>
        <div className="date-field">
          <div
            className={`date-trigger ${openDropdown === 'year' ? 'open' : ''}`}
            onClick={() => toggleDropdown('year')}
          >
            <span className={selectedDate.year ? 'selected' : 'placeholder'}>
              {getDisplayValue('year')}
            </span>
            <i className={`fas fa-chevron-down ${openDropdown === 'year' ? 'rotated' : ''}`}></i>
          </div>
          
          {openDropdown === 'year' && (
            <div className="date-dropdown">
              {years.map(year => (
                <div
                  key={year}
                  className={`date-option ${selectedDate.year === year.toString() ? 'selected' : ''}`}
                  onClick={() => handleYearChange(year.toString())}
                >
                  {year}년
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
      <div className={`moovy-date-selector ${theme === 'light' ? 'light-theme' : ''} ${className}`} id={id}>
      <div className="date-selector-group">
        <div className="date-field">
          <div
            className={`date-trigger ${openDropdown === 'year' ? 'open' : ''}`}
            onClick={() => toggleDropdown('year')}
          >
            <span className={selectedDate.year ? 'selected' : 'placeholder'}>
              {getDisplayValue('year')}
            </span>
            <Icon icon="mdi:chevron-down" className={openDropdown === 'year' ? 'rotated' : ''} />
          </div>
          
          {openDropdown === 'year' && (
            <div className="date-dropdown">
              {years.map(year => (
                <div
                  key={year}
                  className={`date-option ${selectedDate.year === year.toString() ? 'selected' : ''}`}
                  onClick={() => handleYearChange(year.toString())}
                >
                  {year}년
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="date-field">
          <div
            className={`date-trigger ${openDropdown === 'month' ? 'open' : ''}`}
            onClick={() => toggleDropdown('month')}
          >
            <span className={selectedDate.month ? 'selected' : 'placeholder'}>
              {getDisplayValue('month')}
            </span>
            <Icon icon="mdi:chevron-down" className={openDropdown === 'month' ? 'rotated' : ''} />
          </div>
          
          {openDropdown === 'month' && (
            <div className="date-dropdown">
              {months.map(month => (
                <div
                  key={month}
                  className={`date-option ${selectedDate.month === month.toString().padStart(2, '0') ? 'selected' : ''}`}
                  onClick={() => handleMonthChange(month.toString().padStart(2, '0'))}
                >
                  {month}월
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="date-field">
          <div
            className={`date-trigger ${openDropdown === 'day' ? 'open' : ''}`}
            onClick={() => toggleDropdown('day')}
          >
            <span className={selectedDate.day ? 'selected' : 'placeholder'}>
              {getDisplayValue('day')}
            </span>
            <Icon icon="mdi:chevron-down" className={openDropdown === 'day' ? 'rotated' : ''} />
          </div>
          
          {openDropdown === 'day' && (
            <div className="date-dropdown">
              {days.map(day => (
                <div
                  key={day}
                  className={`date-option ${selectedDate.day === day.toString().padStart(2, '0') ? 'selected' : ''}`}
                  onClick={() => handleDayChange(day.toString().padStart(2, '0'))}
                >
                  {day}일
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
