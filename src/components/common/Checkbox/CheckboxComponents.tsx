import React, { useState } from 'react';
import { Checkbox } from './CheckboxStyle';

export const IdSaveCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="아이디 저장" id="id-save" />;
};

export const PrivacyCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="개인정보 처리방침에 동의합니다" id="privacy" />;
};

export const TermsCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="이용약관에 동의합니다" id="terms" />;
};

export const MarketingCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="마케팅 수신에 동의합니다 (선택)" id="marketing" />;
};

export const SuccessCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(true);
  return <Checkbox checked={checked} onChange={setChecked} label="완료됨" state="success" id="success-checkbox" />;
};

export const ErrorCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="필수 동의 항목입니다" state="error" id="error-checkbox" />;
};
