import React from 'react';
import './Toggle.scss';

/**
 * Toggle Props:
 * - checked?: boolean (토글 상태)
 * - onChange?: (checked: boolean) => void (상태 변경 핸들러)
 * - disabled?: boolean (비활성화 상태)
 * - className?: string (추가 CSS 클래스)
 * - id?: string (요소 ID)
 * - name?: string (요소 이름)
 */

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className = '',
  id,
  name,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange?.(e.target.checked);
    }
  };

  return (
    <div className={`toggle-wrapper ${className}`}>
      <label className={`toggle ${disabled ? 'toggle--disabled' : ''}`}>
        <input
          type="checkbox"
          className="toggle__input"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          id={id}
          name={name}
        />
        <span className="toggle__slider"></span>
      </label>
    </div>
  );
};

export default Toggle;

