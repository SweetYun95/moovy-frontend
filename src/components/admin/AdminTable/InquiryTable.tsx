// moovy-frontend/src/components/admin/AdminTable/InquiryTable.tsx

import React from 'react'

import Avatar from '../../../assets/Avatar.png'
import type { AdminInquirySummary } from '../../../services/api/admin/adminInquiryApi'

interface TableProps {
   content: string
   columns: string[]
   rows: AdminInquirySummary[]
   onRowClick?: (data: any) => void
   onStatusClick?: (e: React.MouseEvent, data: any) => void
}
function ymdFromAny(value?: string) {
   if (!value) return ''
   return String(value).slice(0, 10)
}

function toUiState(state: AdminInquirySummary['state']): '미완료' | '답변완료' {
   return state === 'FULFILLED' ? '답변완료' : '미완료'
}

const InquiryTable: React.FC<TableProps> = ({ content, columns, rows, onRowClick, onStatusClick }) => {
   const safeRows = rows || []

   return (
      <>
         {safeRows.map((data) => {
            const userId = data.user_id
            const nickname = data.User?.name || '-'
            const title = data.q_title || ''
            const created = ymdFromAny(data.created_at || data.createdAt)
            const uiState = toUiState(data.state)
            const answered = uiState === '답변완료' ? ymdFromAny((data as any).updated_at || (data as any).updatedAt) : '-'

            return (
               <ul className="data" key={data.qna_id} onClick={() => onRowClick?.(data)} style={{ cursor: 'pointer' }}>
                  <li>{userId}</li>
                  <li>
                     <img src={Avatar} alt="avatar" /> {nickname}
                  </li>
                  <li>{title}</li>
                  <li>{created}</li>
                  <li>{answered}</li>
                  <li className={`status status--${uiState === '답변완료' ? 'completed' : 'pending'}`} onClick={(e) => onStatusClick?.(e, data)} style={{ cursor: 'pointer' }}>
                     {uiState}
                  </li>
               </ul>
            )
         })}
      </>
   )
}

export default InquiryTable
