import React, { useState, useRef, useEffect } from 'react';
import './RatingPicker.scss';
import { Icon } from '@iconify/react';

/**
 * RatingPicker Props:
 * - value?: number (선택된 평점)
 * - onChange?: (rating: number) => void (평점 변경 핸들러)
 * - placeholder?: string (플레이스홀더 텍스트)
 * - className?: string (추가 CSS 클래스)
 * - theme?: 'dark' | 'light' (테마)
 * - isOpen?: boolean (평점 선택기 열림 상태)
 * - onOpenChange?: (isOpen: boolean) => void (평점 선택기 열림 상태 변경 핸들러)
 */

interface RatingPickerProps {
  value?: number;
  onChange?: (rating: number) => void;
  placeholder?: string;
  className?: string;
  theme?: 'dark' | 'light';
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const RatingPicker: React.FC<RatingPickerProps> = ({
  value,
  onChange,
  placeholder = '평점 선택',
  className = '',
  theme = 'dark',
  isOpen: externalIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [selectedRating, setSelectedRating] = useState<number | null>(value || null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedRating(value || null);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (onOpenChange) {
          onOpenChange(false);
        } else {
          setInternalIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOpenChange]);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    onChange?.(rating);
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (selectedRating !== null) {
      return `${selectedRating.toFixed(1)}점`;
    }
    return placeholder;
  };

  const ratings = Array.from({ length: 11 }, (_, i) => i * 0.5); // 0.0 to 5.0

  return (
    <div className={`rating-picker-wrapper ${theme === 'light' ? 'light-theme' : ''} ${className}`} ref={dropdownRef}>
      <div
        className={`rating-picker-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => {
          const newIsOpen = !isOpen;
          if (onOpenChange) {
            onOpenChange(newIsOpen);
          } else {
            setInternalIsOpen(newIsOpen);
          }
        }}
      >
        <span className={`rating-text ${selectedRating !== null ? 'selected' : ''}`}>{getDisplayValue()}</span>
        <Icon icon="mdi:chevron-down" className={`rating-icon ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="rating-picker-dropdown">
          <div className="rating-options">
            {ratings.map((rating) => (
              <div
                key={rating}
                className={`rating-option ${selectedRating === rating ? 'selected' : ''}`}
                onClick={() => handleRatingSelect(rating)}
              >
                {rating.toFixed(1)}점
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
