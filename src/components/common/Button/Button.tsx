import React from "react";
import { Button, type ButtonProps } from "./ButtonStyle";
/*
LoginButtonProps:
- loginType: 로그인 타입 ('local' | 'google' | 'kakao' | 'register')

StatusButtonProps:
- status: 버튼 상태 ('danger' | 'success' | 'info')

ActionButtonProps:
- action: 액션 타입 ('edit' | 'delete' | 'cancel')

WideButtonProps:
- buttonType: 버튼 타입 ('delete' | 'comment')
 */
export interface LoginButtonProps
  extends Omit<ButtonProps, "variant" | "size" | "children"> {
  loginType: "local" | "google" | "kakao" | "register";
  text?: string;
  children?: React.ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  loginType,
  text,
  children,
  ...rest
}) => {
  let variant: ButtonProps["variant"];
  let defaultText: string;

  switch (loginType) {
    case "local":
      variant = "local-login";
      defaultText = "로그인";
      break;
    case "google":
      variant = "google";
      defaultText = "구글 아이디로 로그인";
      break;
    case "kakao":
      variant = "kakao";
      defaultText = "카카오 아이디로 로그인";
      break;
    case "register":
      variant = "local-login";
      defaultText = "회원가입하기";
      break;
    default:
      variant = "primary";
      defaultText = "로그인";
  }

  return (
    <Button variant={variant} size="lg" {...rest}>
      {children || text || defaultText}
    </Button>
  );
};

export interface StatusButtonProps
  extends Omit<ButtonProps, "variant" | "size" | "children"> {
  status: "danger" | "success" | "info";
  text?: string;
  children?: React.ReactNode;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  status,
  text,
  children,
  ...rest
}) => {
  let variant: ButtonProps["variant"];
  let defaultText: string;

  switch (status) {
    case "danger":
      variant = "danger";
      defaultText = "삭제하기";
      break;
    case "success":
      variant = "success";
      defaultText = "답변완료";
      break;
    case "info":
      variant = "info";
      defaultText = "작성완료";
      break;
    default:
      variant = "primary";
      defaultText = "상태 버튼";
  }

  return (
    <Button variant={variant} size="sm" className="btn-status" {...rest}>
      {children || text || defaultText}
    </Button>
  );
};

export interface ActionButtonProps
  extends Omit<ButtonProps, "variant" | "size" | "children"> {
  action: "confirm" | "edit" | "delete" | "cancel";
  text?: string;
  children?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  text,
  children,
  ...rest
}) => {
  let variant: ButtonProps["variant"];
  let defaultText: string;

  switch (action) {
    case "confirm":
      variant = "primary";
      defaultText = "확인";
      break;
    case "delete":
      variant = "secondary";
      defaultText = "삭제";
      break;
    case "cancel":
      variant = "modal-close";
      defaultText = "취소";
      break;
    default:
      variant = "primary";
      defaultText = "액션 버튼";
  }

  return (
    <Button variant={variant} size="md" {...rest}>
      {children || text || defaultText}
    </Button>
  );
};

export interface WideButtonProps
  extends Omit<ButtonProps, "variant" | "children"> {
  buttonType: "delete" | "comment";
  text?: string;
  children?: React.ReactNode;
}

export const WideButton: React.FC<WideButtonProps> = ({
  buttonType,
  text,
  children,
  ...rest
}) => {
  let className: string;
  let defaultText: string;

  switch (buttonType) {
    case "delete":
      className = "btn-delete-wide mb-2 mr-2";
      defaultText = "삭제하기";
      break;
    case "comment":
      className = "btn-comment-wide mb-2";
      defaultText = "코멘트 작성하러 가기";
      break;
    default:
      className = "";
      defaultText = "와이드 버튼";
  }

  return (
    <Button variant="secondary" className={className} {...rest}>
      {children || text || defaultText}
    </Button>
  );
};

// Default exports
export default {
  LoginButton,
  StatusButton,
  ActionButton,
  WideButton,
};
