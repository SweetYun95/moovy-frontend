// moovy-frontend/src/components/admin/AdminTable/ReportTable.tsx
import React from 'react'

export type AdminReportRow = {
   type?: 'comment' | 'reply'
   report_id: number
   reporter_user_id?: number
   reporter_name: string
   reported_user_id?: number
   reported_name: string
   post_type: '코멘트' | '댓글'
   post_id: number
   post_content: string
   category: '스팸' | '스포일러' | '도배' | '부적절한 언행' | '기타'
   created_at: string
   state: '대기중' | '처리완료'
   report_content: string
}

interface TableProps {
   content: string
   columns: string[]
   rows: AdminReportRow[]
   onRowClick?: (data: AdminReportRow) => void
   onStatusClick?: (e: React.MouseEvent, data: AdminReportRow) => void
   onPostClick?: (e: React.MouseEvent, data: AdminReportRow) => void
}

const ReportTable: React.FC<TableProps> = ({ rows, onRowClick, onStatusClick, onPostClick }) => {
   const safeRows = rows || []

   return (
      <>
         {safeRows.map((data) => (
            <ul className="data" key={data.report_id} onClick={() => onRowClick?.(data)} style={{ cursor: 'pointer' }}>
               <li>
                  {data.reporter_name}
               </li>
               <li>
                  {data.reported_name}
               </li>
               <li onClick={(e) => onPostClick?.(e, data)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  {data.post_type}/{data.post_id}
               </li>
               <li>{data.category}</li>
               <li>{data.created_at}</li>
               <li className={`status status--${data.state === '처리완료' ? 'completed' : 'pending'}`} onClick={(e) => onStatusClick?.(e, data)} style={{ cursor: 'pointer' }}>
                  {data.state}
               </li>
            </ul>
         ))}
      </>
   )
}

export default ReportTable
