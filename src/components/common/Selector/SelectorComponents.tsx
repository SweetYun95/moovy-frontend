import React, { useState } from 'react';
import { Selector, type SelectorOption } from './SelectorStyle';


// 관리자 필터용 장르 선택기 
export const GenreSelector: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Selector
      options={[
        { value: 'action', label: '액션' },
        { value: 'comedy', label: '코미디' },
        { value: 'drama', label: '드라마' },
        { value: 'horror', label: '공포' },
        { value: 'romance', label: '로맨스' },
        { value: 'sf', label: 'SF' },
        { value: 'thriller', label: '스릴러' },
        { value: 'animation', label: '애니메이션' },
      ]}
      value={value}
      onChange={setValue}
      placeholder="장르를 선택하세요"
      id="genre-selector"
    />
  );
};

// 토픽 장르 선택 컴포넌트 (API 연동용 - props로 value, onChange 받음)
export const TopicGenreSelector: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, 
  onChange, 
  placeholder = '장르를 선택하세요' 
}) => {
  return (
    <Selector
      options={[
        { value: 'action', label: '액션' },
        { value: 'comedy', label: '코미디' },
        { value: 'drama', label: '드라마' },
        { value: 'horror', label: '공포' },
        { value: 'romance', label: '로맨스' },
        { value: 'sf', label: 'SF' },
        { value: 'thriller', label: '스릴러' },
        { value: 'animation', label: '애니메이션' },
      ]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export const RatingSelector: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Selector
      options={[
        { value: '5', label: '★★★★★ (5.0점)' },
        { value: '4.5', label: '★★★★☆ (4.5점)' },
        { value: '4', label: '★★★★☆ (4.0점)' },
        { value: '3.5', label: '★★★☆☆ (3.5점)' },
        { value: '3', label: '★★★☆☆ (3.0점)' },
        { value: '2.5', label: '★★☆☆☆ (2.5점)' },
        { value: '2', label: '★★☆☆☆ (2.0점)' },
        { value: '1.5', label: '★☆☆☆☆ (1.5점)' },
        { value: '1', label: '★☆☆☆☆ (1.0점)' },
        { value: '0.5', label: '☆☆☆☆☆ (0.5점)' },
      ]}
      value={value}
      onChange={setValue}
      placeholder="평점을 선택하세요"
      id="rating-selector"
    />
  );
};

export const YearSelector: React.FC = () => {
  const [value, setValue] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <Selector
      options={years.map(year => ({
        value: year.toString(),
        label: `${year}년`
      }))}
      value={value}
      onChange={setValue}
      placeholder="연도를 선택하세요"
      id="year-selector"
    />
  );
};

export const CountrySelector: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Selector
      options={[
        { value: 'kr', label: '한국' },
        { value: 'us', label: '미국' },
        { value: 'jp', label: '일본' },
        { value: 'cn', label: '중국' },
        { value: 'fr', label: '프랑스' },
        { value: 'uk', label: '영국' },
        { value: 'de', label: '독일' },
        { value: 'it', label: '이탈리아' },
      ]}
      value={value}
      onChange={setValue}
      placeholder="국가를 선택하세요"
      id="country-selector"
    />
  );
};

// 문의 카테고리 옵션 (외부에서 label 변환 등에 사용)
export const InquirySelector: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, 
  onChange, 
  placeholder = '분류를 선택하세요' 
}) => {
  return (
    <Selector
      options={[
        { value: 'general', label: '일반 문의' },
        { value: 'technical', label: '기술 지원' },
        { value: 'account', label: '계정 문의' },
        { value: 'report', label: '신고' },
        { value: 'other', label: '기타' },
      ]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

// 신고 카테고리 옵션 (외부에서 label 변환 등에 사용)
export const ReportSelector: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, 
  onChange, 
  placeholder = '분류를 선택하세요' 
}) => {
  return (
    <Selector
      options={[
        { value: 'spam', label: '스팸' },
        { value: 'abuse', label: '욕설/비방' },
        { value: 'inappropriate', label: '부적절한 콘텐츠' },
        { value: 'copyright', label: '저작권 침해' },
        { value: 'other', label: '기타' },
      ]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

// 시청연령 선택 옵션 (외부에서 label 변환 등에 사용)
export const AgeRatingSelector: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, 
  onChange, 
  placeholder = '시청연령을 선택하세요' 
}) => {
  return (
    <Selector
      options={[
        { value: 'all', label: '전체 관람가' },
        { value: '12', label: '12세 관람가' },
        { value: '15', label: '15세 관람가' },
        { value: '18', label: '청소년 관람불가' },
      ]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

// 제재 강도 선택 옵션 (관리자용)
export const SanctionLevelSelector: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, 
  onChange, 
  placeholder = '제재 단계' 
}) => {
  return (
    <Selector
      options={[
        { value: 'warning', label: '경고' },
        { value: 'temporary-ban', label: '일시정지' },
        { value: 'permanent-ban', label: '영구정지' },
      ]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

// 신고 처리 상태 선택 옵션 (관리자용)
export const ReportStatusSelector: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ 
  value, 
  onChange, 
  placeholder = '처리 상태' 
}) => {
  return (
    <Selector
      options={[
        { value: 'pending', label: '대기 중' },
        { value: 'processing', label: '처리 중' },
        { value: 'completed', label: '처리 완료' },
        { value: 'rejected', label: '거부' },
      ]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

