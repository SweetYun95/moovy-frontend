import React, { useState, useRef } from 'react';
import { Button } from '../../common/Button/ButtonStyle';
import { Icon } from '@iconify/react';
import moovyLogo from '../../../assets/moovy-logo.svg';
import './Header.scss';

/*
Header Props:
- onSearchChange?: (value: string) => void (검색어 변경 핸들러)
- onSearch?: (value: string) => void (검색 실행 핸들러)
- onLoginClick?: () => void (로그인 버튼 클릭 핸들러)
- onSignupClick?: () => void (회원가입 버튼 클릭 핸들러)
- searchPlaceholder?: string (검색창 플레이스홀더)
- className?: string (추가 CSS 클래스)
*/

export interface HeaderProps {
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  searchPlaceholder?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  onSearch,
  onLoginClick,
  onSignupClick,
  searchPlaceholder = '영화명을 입력해주세요',
  className = '',
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onSearchChange?.(newValue);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(searchValue);
    }
  };

  const handleSearchIconClick = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      if (!searchValue.trim()) {
        setIsSearchOpen(false);
      } else {
        onSearch?.(searchValue);
      }
    }
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setIsSearchOpen(false);
    }
  };
  return (
    <header className={`moovy-header ${className}`}>
      <div className="container px-2">
        <div className="row align-items-center py-3">
          <div className="col-auto">
            <div className="moovy-header__logo">
              <img 
                src={moovyLogo} 
                alt="MOOVY" 
                className="moovy-header__logo-image"
                onError={(e) => {
                  // 로고 로드 실패 시 텍스트로 대체
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.add('show');
                }}
              />
              <span className="moovy-header__logo-text" style={{ display: 'none' }}>MOOVY</span>
            </div>
          </div>
          
          <div className="col">
            <div className="moovy-header__search-group d-flex justify-content-end">
              <div className="form-group mb-0">
                <div 
                  className={`moovy-search-wrapper ${isSearchOpen ? 'open' : ''}`}
                  ref={wrapperRef}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-control moovy-search"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    onBlur={handleSearchBlur}
                  />
                  <button
                    className="search-icon"
                    type="button"
                    onClick={handleSearchIconClick}
                  >
                    <Icon icon="line-md:search" />
                  </button>
                </div>
              </div>
              <Button 
                variant="primary"
                size="sm"
                onClick={onLoginClick}
              >
                로그인
              </Button>
              <Button 
                variant="primary"
                size="sm"
                onClick={onSignupClick}
              >
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

