import React, { useState } from 'react'
import './AdminFilter.scss'
import { Input } from '../../common/Input/InputStyle'
import { Selector } from '../../common/Selector/SelectorStyle'
import { Icon } from '@iconify/react'

interface UserManagementFilterProps {
   onSearch?: (filters: Record<string, any>) => void
}

export const UserManagementFilter: React.FC<UserManagementFilterProps> = ({ onSearch }) => {
   const [filters, setFilters] = useState<Record<string, any>>({})
   const [isExpanded, setIsExpanded] = useState(true)
   const [openSelector, setOpenSelector] = useState<string | null>(null)

   const handleFieldChange = (name: string, value: any) => {
      setFilters((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   const handleSelectorOpen = (selectorId: string, isOpen: boolean) => {
      if (isOpen) {
         setOpenSelector(selectorId)
      } else {
         setOpenSelector(null)
      }
   }

   const handleSearch = () => {
      onSearch?.(filters)
   }

   const handleReset = () => {
      setFilters({})
      setOpenSelector(null)
      onSearch?.({})
   }

   const handleToggleExpand = () => {
      setIsExpanded(!isExpanded)
   }

   return (
      <div className="admin-filter">
         <div className="filter-header">
            <div className="d-flex">
               <button className="filter-icon-button" type="button">
                  <Icon icon="mdi:menu" style={{ fontSize: 'icon-md' }} />
               </button>
               <button className="filter-icon-button" onClick={handleToggleExpand} type="button">
                  <Icon icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} style={{ fontSize: 'icon-md' }} />
               </button>
               <h3 className="filter-title mb-0">유저 관리</h3>
            </div>

            {isExpanded ? (
               <>
                  <button className="search-button" onClick={handleReset} type="button">
                     초기화
                  </button>
                  <button className="search-button" onClick={handleSearch} type="button">
                     <Icon icon="line-md:search" style={{ fontSize: 'icon-sm' }} />
                     Search
                  </button>
               </>
            ) : (
               <>
                  <button className="search-button" onClick={handleReset} type="button">
                     초기화
                  </button>
                  <button className="search-button" onClick={handleSearch} type="button">
                     <Icon icon="line-md:search" style={{ fontSize: 'icon-sm' }} />
                     Search
                  </button>
               </>
            )}
         </div>

         {isExpanded && (
            <div className="filter-content">
               <div className="row g-3">
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">유저 아이디</label>
                     <Input type="number" placeholder="아이디를 입력하세요." value={filters.userId || ''} onChange={(value) => handleFieldChange('userId', value)} theme="light" min={0} />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">닉네임</label>
                     <Input type="text" placeholder="닉네임을 입력하세요." value={filters.nickname || ''} onChange={(value) => handleFieldChange('nickname', value)} theme="light" />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">이메일</label>
                     <Input type="text" placeholder="이메일을 입력하세요." value={filters.email || ''} onChange={(value) => handleFieldChange('email', value)} theme="light" />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">댓글</label>
                     <div className="number-range-field">
                        <Input type="number" placeholder="0" value={filters.reply_min || ''} onChange={(value) => handleFieldChange('reply_min', value)} theme="light" min={0} />
                        <span className="range-separator">~</span>
                        <Input type="number" placeholder="10000" value={filters.reply_max || ''} onChange={(value) => handleFieldChange('reply_max', value)} theme="light" min={0} />
                     </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">코멘트</label>
                     <div className="number-range-field">
                        <Input type="number" placeholder="0" value={filters.comment_min || ''} onChange={(value) => handleFieldChange('comment_min', value)} theme="light" min={0} />
                        <span className="range-separator">~</span>
                        <Input type="number" placeholder="10000" value={filters.comment_max || ''} onChange={(value) => handleFieldChange('comment_max', value)} theme="light" min={0} />
                     </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">경고</label>
                     <Selector
                        options={[
                           { value: 'none', label: '없음' },
                           { value: 'warning', label: '경고' },
                        ]}
                        value={filters.warning || ''}
                        onChange={(value) => handleFieldChange('warning', value)}
                        placeholder="경고"
                        theme="light"
                        isOpen={openSelector === 'warning'}
                        onOpenChange={(isOpen) => handleSelectorOpen('warning', isOpen)}
                     />
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
