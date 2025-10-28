import React, { useState } from 'react';
import './Textarea.scss';

/**
 * Textarea Props:
 * - placeholder?: string (플레이스홀더 텍스트)
 * - value?: string (입력값)
 * - onChange?: (value: string) => void (값 변경 핸들러)
 * - onBlur?: () => void (포커스 아웃 핸들러)
 * - disabled?: boolean (비활성화 상태)
 * - required?: boolean (필수 입력 여부)
 * - className?: string (추가 CSS 클래스)
 * - id?: string (요소 ID)
 * - name?: string (요소 이름)
 * - state?: 'success' | 'warning' | 'error' (입력 상태)
 * - rows?: number (행 수)
 * - maxLength?: number (최대 길이)
 * - showCounter?: boolean (글자 수 카운터 표시)
 */

export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  state?: 'success' | 'warning' | 'error';
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value = '',
  onChange,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  state,
  rows = 4,
  maxLength,
  showCounter = false,
}) => {
  const [textareaValue, setTextareaValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
    onChange?.(newValue);
  };

  const textareaClasses = [
    'moovy-textarea',
    state && `moovy-textarea-${state}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="moovy-textarea-wrapper">
      <textarea
        className={textareaClasses}
        placeholder={placeholder}
        value={textareaValue}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        id={id}
        name={name}
        rows={rows}
        maxLength={maxLength}
      />
      {showCounter && maxLength && (
        <div className="textarea-counter">
          <span className={textareaValue.length > maxLength * 0.9 ? 'warning' : ''}>
            {textareaValue.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default Textarea;
