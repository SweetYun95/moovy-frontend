import React, { useState, useEffect } from 'react';
import './Selector.scss';
import { Icon } from '@iconify/react';

/**
 * Selector Props:
 * - options: SelectorOption[] (선택 옵션 배열)
 * - value?: string (선택된 값)
 * - onChange?: (value: string) => void (값 변경 핸들러)
 * - placeholder?: string (플레이스홀더 텍스트)
 * - disabled?: boolean (비활성화 상태)
 * - className?: string (추가 CSS 클래스)
 * - id?: string (요소 ID)
 * - name?: string (요소 이름)
 * - state?: 'success' | 'warning' | 'error' (선택 상태)
 * - isOpen?: boolean (드롭다운 열림 상태)
 * - onToggle?: () => void (드롭다운 토글 핸들러)
 * - onClose?: () => void (드롭다운 닫기 핸들러)
 */

export interface SelectorOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectorProps {
  options: SelectorOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  state?: 'success' | 'warning' | 'error';
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  theme?: 'dark' | 'light';
}

export const Selector: React.FC<SelectorProps> = ({
  options,
  value = '',
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className = '',
  id,
  name,
  state,
  isOpen: externalIsOpen,
  onOpenChange,
  theme = 'dark',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalIsOpen(false);
    }
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  const selectorClasses = [
    'form-control',
    'moovy-selector',
    state && `moovy-selector-${state}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={`moovy-selector-wrapper ${theme === 'light' ? 'light-theme' : ''}`}>
      <div
        className={`moovy-selector-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (!disabled) {
            const newIsOpen = !isOpen;
            if (onOpenChange) {
              onOpenChange(newIsOpen);
            } else {
              setInternalIsOpen(newIsOpen);
            }
          }
        }}
      >
        <span className={selectedOption ? 'selected' : 'placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon icon="mdi:chevron-down" className={isOpen ? 'rotated' : ''} />
      </div>
      
      {isOpen && !disabled && (
        <div className="moovy-selector-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`moovy-selector-option ${option.disabled ? 'disabled' : ''} ${selectedValue === option.value ? 'selected' : ''}`}
              onClick={() => !option.disabled && handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden select for form submission */}
      <select
        className="d-none"
        value={selectedValue}
        onChange={(e) => handleSelect(e.target.value)}
        disabled={disabled}
        id={id}
        name={name}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
