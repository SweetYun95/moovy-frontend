// 외부 라이브러리
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'

// 내부 유틸/전역/서비스
import { PATHS } from '@/routes/paths'

// 컴포넌트
import { Button } from '../../common/Button/ButtonStyle'

// 자산
import moovyLogo from '../../../assets/moovy-logo.svg'

// 스타일
import './Header.scss'

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
   onSearchChange?: (value: string) => void
   onSearch?: (value: string) => void
   onLoginClick?: () => void
   onSignupClick?: () => void
   searchPlaceholder?: string
   className?: string
   showSearch?: boolean // 검색 기능 표시 여부
   showLoginButton?: boolean // 로그인 버튼 표시 여부
   showSignupButton?: boolean // 회원가입 버튼 표시 여부
   isLoggedIn?: boolean
   user?: {}
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, onSearch, onLoginClick, onSignupClick, searchPlaceholder = '영화명을 입력해주세요', className = '', showSearch = true, showLoginButton = true, showSignupButton = true, user, isLoggedIn }) => {
   const navigate = useNavigate()
   const [searchValue, setSearchValue] = useState('')
   const [isSearchOpen, setIsSearchOpen] = useState(false)
   const inputRef = useRef<HTMLInputElement>(null)
   const wrapperRef = useRef<HTMLDivElement>(null)

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchValue(newValue)
      onSearchChange?.(newValue)
   }

   const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         if (onSearch) {
            onSearch(searchValue)
         } else {
            // 기본 동작: ContentsListPage로 이동
            if (searchValue.trim()) {
               navigate(`${PATHS.contents}?q=${encodeURIComponent(searchValue.trim())}`)
               setSearchValue('')
               setIsSearchOpen(false)
            }
         }
      }
   }

   const handleSearchIconClick = () => {
      if (!isSearchOpen) {
         setIsSearchOpen(true)
         setTimeout(() => {
            inputRef.current?.focus()
         }, 100)
      } else {
         if (!searchValue.trim()) {
            setIsSearchOpen(false)
         } else {
            if (onSearch) {
               onSearch(searchValue)
            } else {
               // 기본 동작: ContentsListPage로 이동
               navigate(`${PATHS.contents}?q=${encodeURIComponent(searchValue.trim())}`)
               setSearchValue('')
               setIsSearchOpen(false)
            }
         }
      }
   }

   const handleSearchBlur = (e: React.FocusEvent) => {
      if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
         setIsSearchOpen(false)
      }
   }

   const handleLoginClick = () => {
      if (onLoginClick) {
         onLoginClick()
      } else {
         navigate(PATHS.login)
      }
   }

   const handleSignupClick = () => {
      if (onSignupClick) {
         onSignupClick()
      } else {
         navigate(PATHS.register)
      }
   }

   console.log('Header:', user, isLoggedIn)

   return (
      <header className={`moovy-header ${className}`}>
         <div className="container px-2">
            <div className="row align-items-center py-3">
               <div className="col-auto">
                  <div className="moovy-header__logo" onClick={() => navigate(PATHS.home)} style={{ cursor: 'pointer' }}>
                     <img
                        src={moovyLogo}
                        alt="MOOVY"
                        className="moovy-header__logo-image"
                        onError={(e) => {
                           // 로고 로드 실패 시 텍스트로 대체
                           e.currentTarget.style.display = 'none'
                           e.currentTarget.nextElementSibling?.classList.add('show')
                        }}
                     />
                     <span className="moovy-header__logo-text" style={{ display: 'none' }}>
                        MOOVY
                     </span>
                  </div>
               </div>

               {showSearch || showLoginButton || showSignupButton ? (
                  <div className="col">
                     <div className="moovy-header__search-group d-flex justify-content-end">
                        {showSearch && (
                           <div className="form-group mb-0">
                              <div className={`moovy-search-wrapper ${isSearchOpen ? 'open' : ''}`} ref={wrapperRef}>
                                 <input ref={inputRef} type="text" className="form-control moovy-search" placeholder={searchPlaceholder} value={searchValue} onChange={handleSearchChange} onKeyPress={handleSearchKeyPress} onBlur={handleSearchBlur} />
                                 <button className="search-icon" type="button" onClick={handleSearchIconClick}>
                                    <Icon icon="line-md:search" />
                                 </button>
                              </div>
                           </div>
                        )}
                        {showLoginButton && !user && (
                           <Button variant="primary" size="sm" onClick={handleLoginClick}>
                              로그인
                           </Button>
                        )}
                        {showSignupButton && (
                           <Button variant="primary" size="sm" onClick={handleSignupClick}>
                              회원가입
                           </Button>
                        )}
                     </div>
                  </div>
               ) : null}
            </div>
         </div>
      </header>
   )
}

export default Header
