import React, { useState } from 'react';
import { Textarea } from './TextareaStyle';

export const ReviewTextarea: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="영화에 대한 리뷰를 작성해주세요..."
      value={value}
      onChange={setValue}
      rows={5}
      maxLength={500}
      showCounter={true}
      id="review-textarea"
    />
  );
};

export const CommentTextarea: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="댓글을 작성해주세요..."
      value={value}
      onChange={setValue}
      rows={3}
      id="comment-textarea"
    />
  );
};

export const ErrorTextarea: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="에러 상태의 텍스트 영역"
      value={value}
      onChange={setValue}
      state="error"
      rows={3}
      id="textarea-error"
    />
  );
};

export const InquiryTextarea: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="문의 내용을 자세히 작성해주세요..."
      value={value}
      onChange={setValue}
      rows={6}
      maxLength={1000}
      showCounter={true}
      id="inquiry-textarea"
    />
  );
};

export const ProfileTextarea: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="자기소개를 작성해주세요..."
      value={value}
      onChange={setValue}
      rows={4}
      maxLength={200}
      showCounter={true}
      id="profile-textarea"
    />
  );
};
