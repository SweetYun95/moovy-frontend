import React, { useState, useEffect, useRef } from 'react';
import './DatePicker.scss';
import { Icon } from '@iconify/react';

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  theme?: 'dark' | 'light';
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  placeholder = '날짜를 선택하세요',
  className = '',
  id,
  theme = 'dark',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    const dateString = formatDate(date);
    setSelectedDate(dateString);
    onChange?.(dateString);
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return selectedDate === formatDate(date);
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div ref={wrapperRef} className={`date-picker-wrapper ${theme === 'light' ? 'light-theme' : ''} ${className}`} id={id}>
      <div
        className={`date-picker-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedDate ? 'selected' : 'placeholder'}>
          {selectedDate || placeholder}
        </span>
        <Icon icon="mdi:calendar" className={isOpen ? 'rotated' : ''} />
      </div>
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="calendar-header">
            <button type="button" onClick={goToPreviousMonth}>
              <Icon icon="mdi:chevron-left" />
            </button>
            <span className="month-year">
              {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
            </span>
            <button type="button" onClick={goToNextMonth}>
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
          
          <div className="calendar-grid">
            <div className="day-names">
              {dayNames.map(day => (
                <div key={day} className="day-name">{day}</div>
              ))}
            </div>
            
            <div className="days">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div
                  key={index}
                  className={`day ${date ? 'selectable' : 'empty'} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                  onClick={() => date && handleDateSelect(date)}
                >
                  {date?.getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;