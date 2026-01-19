import React from 'react'
import './Button.scss'
import { Icon } from '@iconify/react'

export interface ButtonProps {
   children?: React.ReactNode
   variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'modal-close' | 'local-login' | 'kakao' | 'google' | 'menubar' | 'comment'
   size?: 'sm' | 'md' | 'lg'
   type?: 'button' | 'submit' | 'reset'
   disabled?: boolean
   className?: string
   onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
   fullWidth?: boolean
   icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', type = 'button', disabled = false, className = '', onClick, fullWidth = false, icon }) => {
   const buttonClasses = ['moovy-btn', `moovy-btn--${variant}`, `moovy-btn--${size}`, fullWidth && 'moovy-btn--full-width', className].filter(Boolean).join(' ')

   // 기본 아이콘 설정
   const defaultIcon = variant === 'kakao' ? <Icon icon="ri:kakao-talk-fill" style={{ color: '$black2', fontSize: '$icon-md' }} /> : variant === 'google' ? <Icon icon="logos:google-icon" style={{ fontSize: '$icon-md' }} /> : icon

   return (
      <button type={type} className={buttonClasses} disabled={disabled} onClick={onClick}>
         {defaultIcon && <span className="btn-icon">{defaultIcon}</span>}
         {children}
      </button>
   )
}

export default Button
