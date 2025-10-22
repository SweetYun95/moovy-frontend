import React from 'react';
import './Checkbox.scss';

/**
 * Checkbox Props:
 * - checked?: boolean (체크 상태)
 * - onChange?: (checked: boolean) => void (체크 변경 핸들러)
 * - disabled?: boolean (비활성화 상태)
 * - label?: string (라벨 텍스트)
 * - className?: string (추가 CSS 클래스)
 * - id?: string (요소 ID)
 * - name?: string (요소 이름)
 * - state?: 'success' | 'error' (체크박스 상태)
 * - description?: string (설명 텍스트)
 */

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  id?: string;
  name?: string;
  state?: 'success' | 'error';
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  id,
  name,
  state,
  description,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const checkboxClasses = [
    'moovy-checkbox',
    disabled && 'disabled',
    state && state,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="checkbox-item">
      <label className={checkboxClasses}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          id={id}
          name={name}
        />
        <span className="checkmark"></span>
        {label && <span className="checkbox-label">{label}</span>}
      </label>
      {description && (
        <div className="checkbox-description">{description}</div>
      )}
    </div>
  );
};

export default Checkbox;
