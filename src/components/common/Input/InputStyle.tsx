import React, { useEffect, useState } from "react";
import "./Input.scss";
import { Button } from "../Button/ButtonStyle";
import { Icon } from "@iconify/react";

/**
 * Input Props:
 * - type?: 'text' | 'email' | 'password' | 'number' (입력 타입)
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
 * - showPasswordToggle?: boolean (비밀번호 표시 토글)
 * - min?: number (최소값)
 * - max?: number (최대값)
 * - theme?: 'dark' | 'light' (테마)
 * - rightButton?: { text: string, onClick: () => void, variant: string, size: string } (우측 버튼)
 */

export interface InputProps {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  state?: "success" | "warning" | "error";
  showPasswordToggle?: boolean;
  min?: number;
  max?: number;
  theme?: "dark" | "light";
  rightButton?: {
    text: string;
    onClick: () => void;
    variant?:
      | "primary"
      | "secondary"
      | "success"
      | "danger"
      | "warning"
      | "info"
      | "modal-close"
      | "local-login"
      | "kakao"
      | "google";
    size?: "sm" | "md" | "lg";
  };
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value = "",
  onChange,
  onBlur,
  disabled = false,
  required = false,
  className = "",
  id,
  name,
  state,
  showPasswordToggle = false,
  min,
  max,
  theme = "dark",
  rightButton,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // develop 기준: 외부 value 변경을 내부 state에 동기화
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  const inputClasses = [
    "moovy-input",
    state && `moovy-input--${state}`,
    theme === "light" && "light-theme",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputElement = (
    <input
      type={inputType}
      className={inputClasses}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      id={id}
      name={name}
      min={min}
      max={max}
    />
  );

  if (showPasswordToggle || rightButton) {
    return (
      <div className={`moovy-input-wrapper ${theme === "light" ? "light-theme" : ""}`}>
        {inputElement}

        {showPasswordToggle && (
          <button
            className="password-toggle-icon"
            type="button"
            onClick={togglePasswordVisibility}
          >
            <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
          </button>
        )}

        {rightButton && (
          <div className="right-button-wrapper">
            <Button
              variant={rightButton.variant || "primary"}
              size={rightButton.size || "sm"}
              onClick={rightButton.onClick}
            >
              {rightButton.text}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return inputElement;
};

export default Input;
