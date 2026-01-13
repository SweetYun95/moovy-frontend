import React, { useState } from 'react'
import './AdminFilter.scss'
import { Input } from '../../common/Input/InputStyle'
import { Selector } from '../../common/Selector/SelectorStyle'
import { DatePicker } from '../../common/DatePicker/DatePicker'
import { Icon } from '@iconify/react'

interface ReportManagementFilterProps {
   onSearch?: (filters: Record<string, any>) => void
}

export const ReportManagementFilter: React.FC<ReportManagementFilterProps> = ({ onSearch }) => {
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
      setOpenSelector(isOpen ? selectorId : null)
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
               <h3 className="filter-title mb-0">신고내역 관리</h3>
            </div>

            <>
               <button className="search-button" onClick={handleReset} type="button">
                  초기화
               </button>
               <button className="search-button" onClick={handleSearch} type="button">
                  <Icon icon="line-md:search" style={{ fontSize: 'icon-sm' }} />
                  Search
               </button>
            </>
         </div>

         {isExpanded && (
            <div className="filter-content">
               <div className="row g-3">
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">신고 유저</label>
                     <Input type="text" placeholder="이름을 입력하세요." value={filters.reporter || ''} onChange={(value) => handleFieldChange('reporter', value)} theme="light" />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">신고한 유저</label>
                     <Input type="text" placeholder="이름을 입력하세요." value={filters.reported || ''} onChange={(value) => handleFieldChange('reported', value)} theme="light" />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">신고 게시글 종류</label>
                     <Selector
                        options={[
                           { value: '코멘트', label: '코멘트' },
                           { value: '댓글', label: '댓글' },
                        ]}
                        value={filters.postType || ''}
                        onChange={(value) => handleFieldChange('postType', value)}
                        placeholder="종류"
                        theme="light"
                        isOpen={openSelector === 'postType'}
                        onOpenChange={(isOpen) => handleSelectorOpen('postType', isOpen)}
                     />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">신고 게시글 번호</label>
                     <Input type="number" placeholder="번호를 입력하세요." value={filters.postId || ''} onChange={(value) => handleFieldChange('postId', value)} theme="light" min={0} />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">분류</label>
                     <Selector
                        options={[
                           { value: '스팸', label: '스팸' },
                           { value: '스포일러', label: '스포일러' },
                           { value: '도배', label: '도배' },
                           { value: '부적절한 언행', label: '부적절한 언행' },
                           { value: '기타', label: '기타' },
                        ]}
                        value={filters.category || ''}
                        onChange={(value) => handleFieldChange('category', value)}
                        placeholder="분류"
                        theme="light"
                        isOpen={openSelector === 'category'}
                        onOpenChange={(isOpen) => handleSelectorOpen('category', isOpen)}
                     />
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">신고일</label>
                     <div className="number-range-field">
                        <DatePicker value={filters.createdDateStart || ''} onChange={(date) => handleFieldChange('createdDateStart', date)} placeholder="시작일" theme="light" />
                        <span className="range-separator">~</span>
                        <DatePicker value={filters.createdDateEnd || ''} onChange={(date) => handleFieldChange('createdDateEnd', date)} placeholder="종료일" theme="light" />
                     </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                     <label className="field-label d-block">상태</label>
                     <Selector
                        options={[
                           { value: '대기중', label: '대기중' },
                           { value: '처리완료', label: '처리완료' },
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
