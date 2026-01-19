import React, { useState } from 'react'
import { Pagination } from './PaginationStyle'

interface StandardPaginationProps {
   className?: string
   totalItems?: number
   itemsPerPage?: number
   currentPage?: number
   onPageChange?: (page: number) => void
}

export const StandardPagination: React.FC<StandardPaginationProps> = ({ className, totalItems = 0, itemsPerPage = 10, currentPage: controlledPage, onPageChange }) => {
   const [uncontrolledPage, setUncontrolledPage] = useState(1)
   const currentPage = controlledPage ?? uncontrolledPage
   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

   return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange ?? setUncontrolledPage} className={className} />
}

export const ExtendedPagination: React.FC = () => {
   const [currentPage, setCurrentPage] = useState(1)

   return <Pagination currentPage={currentPage} totalPages={50} onPageChange={setCurrentPage} maxVisible={7} />
}

export const SmallPagination: React.FC = () => {
   const [currentPage, setCurrentPage] = useState(1)

   return <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
}

export const LargePagination: React.FC = () => {
   const [currentPage, setCurrentPage] = useState(15)

   return <Pagination currentPage={currentPage} totalPages={100} onPageChange={setCurrentPage} maxVisible={5} />
}
