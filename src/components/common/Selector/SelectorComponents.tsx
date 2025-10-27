import React, { useState } from 'react';
import { Selector } from './SelectorStyle';

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
        { value: 'sci-fi', label: 'SF' },
      ]}
      value={value}
      onChange={setValue}
      placeholder="장르를 선택하세요"
      id="genre-selector"
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
