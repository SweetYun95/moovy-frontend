import React from 'react';
import './Button.scss';
import { Icon } from '@iconify/react';

/**
 * Button Props:
 * - children: React.ReactNode (버튼 텍스트/내용)
 * - variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'modal-close' | 'local-login' | 'kakao' | 'google' | 'menubar' | 'comment' (버튼 스타일)
 * - size?: 'sm' | 'md' | 'lg' (버튼 크기)
 * - type?: 'button' | 'submit' | 'reset' (버튼 타입)
 * - disabled?: boolean (비활성화 상태)
 * - className?: string (추가 CSS 클래스)
 * - onClick?: () => void (클릭 핸들러)
 * - fullWidth?: boolean (전체 너비 사용)
 * - icon?: React.ReactNode (아이콘)
 */

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' |  'modal-close' | 'local-login' | 'kakao' | 'google' | 'menubar' | 'comment';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  fullWidth = false,
  icon,
}) => {
  const buttonClasses = [
    'btn',
    `btn-moovy-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-block',
    className,
  ].filter(Boolean).join(' ');

  // 기본 아이콘 설정
  const defaultIcon = variant === 'kakao' 
    ? <Icon icon="ri:kakao-talk-fill" /> 
    : variant === 'google' 
    ? <Icon icon="mdi:google" /> 
    : icon;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {defaultIcon && <span className="btn-icon">{defaultIcon}</span>}
      {children}
    </button>
  );
};

export default Button;
