import React, { useState } from 'react';
import { Pagination } from './PaginationStyle';

interface StandardPaginationProps {
  className?: string;
}

export const StandardPagination: React.FC<StandardPaginationProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={10}
      onPageChange={setCurrentPage}
      className={className}
    />
  );
};

export const ExtendedPagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={50}
      onPageChange={setCurrentPage}
      maxVisible={7}
    />
  );
};

export const SmallPagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={5}
      onPageChange={setCurrentPage}
    />
  );
};

export const LargePagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(15);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={100}
      onPageChange={setCurrentPage}
      maxVisible={5}
    />
  );
};
