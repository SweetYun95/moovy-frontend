import React, { useState } from "react";
import { Input } from "./InputStyle";
import type { InputProps } from "./InputStyle";

export interface EmailInputProps extends Omit<InputProps, 'type' | 'placeholder' | 'id'> {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value = "",
  onChange,
  id = "email",
  ...props
}) => {
  return (
    <Input
      type="email"
      placeholder="이메일을 입력하세요"
      value={value}
      onChange={onChange}
      id={id}
      {...props}
    />
  );
};

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'placeholder' | 'id' | 'showPasswordToggle'> {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value = "",
  onChange,
  id = "password",
  ...props
}) => {
  return (
    <Input
      type="password"
      placeholder="비밀번호를 입력하세요"
      value={value}
      onChange={onChange}
      showPasswordToggle={true}
      id={id}
      {...props}
    />
  );
};

export interface PasswordCheckInputProps extends Omit<InputProps, 'type' | 'placeholder' | 'id' | 'showPasswordToggle'> {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const PasswordCheckInput: React.FC<PasswordCheckInputProps> = ({
  value = "",
  onChange,
  id = "password-check",
  ...props
}) => {
  return (
    <Input
      type="password"
      placeholder="비밀번호를 다시 입력하세요"
      value={value}
      onChange={onChange}
      showPasswordToggle={true}
      id={id}
      {...props}
    />
  );
};

export interface NameInputProps extends Omit<InputProps, 'type' | 'placeholder' | 'id'> {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const NameInput: React.FC<NameInputProps> = ({
  value = "",
  onChange,
  id = "name",
  ...props
}) => {
  return (
    <Input
      type="text"
      placeholder="이름을 입력하세요"
      value={value}
      onChange={onChange}
      id={id}
      {...props}
    />
  );
};

export interface NicknameInputProps extends Omit<InputProps, 'type' | 'placeholder' | 'id'> {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const NicknameInput: React.FC<NicknameInputProps> = ({
  value = "",
  onChange,
  id = "nickname",
  ...props
}) => {
  return (
    <Input
      type="text"
      placeholder="닉네임을 입력하세요"
      value={value}
      onChange={onChange}
      rightButton={{
        text: "중복 확인",
        onClick: () => alert("중복 확인 클릭!"),
        variant: "primary",
        size: "sm",
      }}
      id={id}
      {...props}
    />
  );
};

export const SuccessInput: React.FC = () => {
  const [value, setValue] = useState("Success!");

  return (
    <Input
      type="text"
      value={value}
      onChange={setValue}
      state="success"
      id="success-input"
    />
  );
};

export const WarningInput: React.FC = () => {
  const [value, setValue] = useState("Warning!");

  return (
    <Input
      type="text"
      value={value}
      onChange={setValue}
      state="warning"
      id="warning-input"
    />
  );
};

export const ErrorInput: React.FC = () => {
  const [value, setValue] = useState("Error!");

  return (
    <Input
      type="text"
      value={value}
      onChange={setValue}
      state="error"
      id="error-input"
    />
  );
};
