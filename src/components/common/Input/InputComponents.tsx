import React, { useState } from "react";
import { Input } from "./InputStyle";

export const EmailInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <Input
      type="email"
      placeholder="이메일을 입력하세요"
      value={value}
      onChange={onChange}
      id="email"
    />
  );
};

export const PasswordInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <Input
      type="password"
      placeholder="비밀번호를 입력하세요"
      value={value}
      onChange={onChange}
      showPasswordToggle
      id="password"
    />
  );
};

export const PasswordCheckInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <Input
      type="password"
      placeholder="비밀번호를 다시 입력하세요"
      value={value}
      onChange={onChange}
      showPasswordToggle={true}
      id="password"
    />
  );
};
export const NameInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <Input
      type="text"
      placeholder="이름을 입력하세요"
      value={value}
      onChange={onChange}
      id="name"
    />
  );
};

export const NicknameInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
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
      id="nickname"
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
