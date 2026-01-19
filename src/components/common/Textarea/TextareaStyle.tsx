// moovy-frontend/src/components/common/Textarea/TextareaStyle.tsx
import React, { useState, useEffect } from "react";
import "./Textarea.scss";

/**
 * Textarea Props:
 * - value: string (필수 입력값)
 * - onChange: (value: string) => void (필수 이벤트)
 * - placeholder, disabled, required 등 textarea의 모든 표준 속성 지원
 * - showCounter?: boolean (글자 수 카운터 표시)
 * - state?: 'success' | 'warning' | 'error' (입력 상태 스타일)
 */
export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  value: string;
  onChange: (value: string) => void;
  showCounter?: boolean;
  state?: "success" | "warning" | "error";
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  onBlur,
  disabled = false,
  required = false,
  className = "",
  id,
  name,
  state,
  rows = 4,
  maxLength,
  showCounter = false,
  ...rest // 나머지 표준 속성(onKeyDown, autoFocus, aria-*, readOnly 등)
}) => {
  const [textareaValue, setTextareaValue] = useState(value);

  useEffect(() => {
    setTextareaValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
    onChange(newValue);
  };

  const textareaClasses = [
    "moovy-textarea",
    state && `moovy-textarea-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
        {...rest}
      />
      {showCounter && maxLength !== undefined && (
        <div className="textarea-counter">
          <span
            className={
              textareaValue.length > maxLength * 0.9 ? "warning" : undefined
            }
          >
            {textareaValue.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default Textarea;
