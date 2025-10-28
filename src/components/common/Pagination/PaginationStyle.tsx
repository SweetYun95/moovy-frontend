import React from 'react';
import './Pagination.scss';
import { Icon } from '@iconify/react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number; // 보여줄 최대 페이지 수 (기본 5)
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  className = '',
}) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 maxVisible 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지가 속한 그룹 계산
      const currentGroup = Math.ceil(currentPage / maxVisible);
      let startPage = (currentGroup - 1) * maxVisible + 1;
      let endPage = Math.min(currentGroup * maxVisible, totalPages);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      // 이전 그룹의 마지막 페이지로 이동
      const currentGroup = Math.ceil(currentPage / maxVisible);
      const prevGroupLastPage = (currentGroup - 2) * maxVisible + maxVisible;
      onPageChange(Math.max(1, prevGroupLastPage));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      // 다음 그룹의 첫 페이지로 이동
      const currentGroup = Math.ceil(currentPage / maxVisible);
      const nextGroupFirstPage = currentGroup * maxVisible + 1;
      const targetPage = Math.min(nextGroupFirstPage, totalPages);
      onPageChange(targetPage);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={`pagination ${className}`}>
      <button
        className="pagination__arrow pagination__arrow--prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <Icon icon="mdi:chevron-left" width="20" height="20" />
      </button>

      <div className="pagination__numbers">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`pagination__number ${
              page === currentPage ? 'pagination__number--active' : ''
            }`}
            onClick={() => typeof page === 'number' && handlePageClick(page)}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination__arrow pagination__arrow--next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <Icon icon="mdi:chevron-right" width="20" height="20" />
      </button>
    </div>
  );
};

