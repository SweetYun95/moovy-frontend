import React, { useState } from 'react'
import './AdminFilter.scss'
import { Input } from '../../common/Input/InputStyle'
import { Selector } from '../../common/Selector/SelectorStyle'
import { DatePicker } from '../../common/DatePicker/DatePicker'
import { Icon } from '@iconify/react'

interface QnAManagementFilterProps {
   onSearch?: (filters: Record<string, any>) => void
}

export const QnAManagementFilter: React.FC<QnAManagementFilterProps> = ({ onSearch }) => {
   const [filters, setFilters] = useState<Record<string, any>>({})
   const [isExpanded, setIsExpanded] = useState(false)
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
               <h3 className="filter-title mb-0">1:1문의 관리</h3>
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
                     <label className="field-label d-block">문의 제목</label>
                     <Input type="text" placeholder="제목을 입력하세요." value={filters.title || ''} onChange={(value) => handleFieldChange('title', value)} theme="light" />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">작성일</label>
                     <div className="number-range-field">
                        <DatePicker value={filters.createdDateStart || ''} onChange={(date) => handleFieldChange('createdDateStart', date)} placeholder="시작일" theme="light" />
                        <span className="range-separator">~</span>
                        <DatePicker value={filters.createdDateEnd || ''} onChange={(date) => handleFieldChange('createdDateEnd', date)} placeholder="종료일" theme="light" />
                     </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">답변일</label>
                     <div className="number-range-field">
                        <DatePicker value={filters.answeredDateStart || ''} onChange={(date) => handleFieldChange('answeredDateStart', date)} placeholder="시작일" theme="light" />
                        <span className="range-separator">~</span>
                        <DatePicker value={filters.answeredDateEnd || ''} onChange={(date) => handleFieldChange('answeredDateEnd', date)} placeholder="종료일" theme="light" />
                     </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">상태</label>
                     <Selector
                        options={[
                           { value: '미완료', label: '미완료' },
                           { value: '답변완료', label: '답변완료' },
                        ]}
                        value={filters.status || ''}
                        onChange={(value) => handleFieldChange('status', value)}
                        placeholder="상태"
                        theme="light"
                        isOpen={openSelector === 'status'}
                        onOpenChange={(isOpen) => handleSelectorOpen('status', isOpen)}
                     />
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
