// moovy-frontend/src/components/admin/HistoryPanel.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Human from '../../assets/Human.svg'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { getAdminHistories } from '@/features/admin/adminHistorySlice'
import { PATHS } from '@/routes/paths'

interface HistoryPanelProps {
   className?: string
}

function formatRelativeTime(dateString?: string) {
   if (!dateString) return ''
   const now = Date.now()
   const t = new Date(dateString).getTime()
   if (Number.isNaN(t)) return ''

   const diffMs = now - t
   const diffSec = Math.floor(diffMs / 1000)

   if (diffSec < 60) return `${diffSec}s ago`
   const diffMin = Math.floor(diffSec / 60)
   if (diffMin < 60) return `${diffMin} minutes ago`
   const diffHour = Math.floor(diffMin / 60)
   if (diffHour < 24) return `${diffHour} hours ago`
   const diffDay = Math.floor(diffHour / 24)
   if (diffDay < 7) return `${diffDay} days ago`
   const diffWeek = Math.floor(diffDay / 7)
   if (diffWeek < 5) return `${diffWeek} weeks ago`
   const diffMonth = Math.floor(diffDay / 30)
   if (diffMonth < 12) return `${diffMonth} months ago`
   const diffYear = Math.floor(diffDay / 365)
   return `${diffYear} years ago`
}

function safeParseMeta(meta?: string | null) {
   if (!meta) return null
   try {
      return JSON.parse(meta)
   } catch {
      return null
   }
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ className }) => {
   const dispatch = useAppDispatch()
   const navigate = useNavigate()
   const { items, loading, error } = useAppSelector((s) => s.adminHistory)

   const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      // 히스토리 패널 내부 클릭 시 이벤트 전파 방지 (오버레이 닫기 방지)
      e.stopPropagation()
   }

   // ✅ 최초 1회 히스토리 로드 (최신 10개)
   React.useEffect(() => {
      dispatch(getAdminHistories({ page: 1, limit: 10 }))
   }, [dispatch])

   const handleHistoryItemClick = (h: any) => {
      const meta = safeParseMeta(h.meta)

      // 우선순위 1) QnA 관련이면 문의로 이동
      const qnaIdFromMeta = meta?.qna_id ?? meta?.qnaId ?? meta?.id
      const isQnaAction = typeof h.action === 'string' && h.action.toUpperCase().includes('QNA')

      if (qnaIdFromMeta && (isQnaAction || meta?.type === 'QNA')) {
         // inquiries 페이지로 이동 + 쿼리로 힌트 전달
         navigate(`${PATHS.adminInquiries}?qna_id=${qnaIdFromMeta}`)
         return
      }

      // 우선순위 2) user_id가 있으면 유저 관리로 이동
      if (h.user_id) {
         navigate(`${PATHS.adminUsers}?user_id=${h.user_id}`)
         return
      }

      // 우선순위 3) fallback: 액션에 따라 기본 탭 이동(선택)
      // 예: 신고 관련이면 reports로
      const action = (h.action || '').toUpperCase()
      if (action.includes('REPORT')) {
         navigate(PATHS.adminReports)
         return
      }

      // 그 외는 일단 아무것도 안 함(원하면 toast 추가 가능)
   }

   return (
      <aside className={`history-panel ${className || ''}`} onClick={handleClick}>
         <p>히스토리</p>

         {loading && items.length === 0 && <div style={{ padding: 12 }}>로딩 중...</div>}
         {!loading && error && <div style={{ padding: 12 }}>히스토리 로드 실패: {error}</div>}
         {!loading && !error && items.length === 0 && <div style={{ padding: 12 }}>표시할 히스토리가 없습니다.</div>}

         <ul>
            {items.map((h) => {
               const imgSrc = h.user?.profile_img || Human
               const when = formatRelativeTime(h.created_at)

               return (
                  <li key={h.history_id} onClick={() => handleHistoryItemClick(h)} style={{ cursor: 'pointer' }} title={h.action}>
                     <img src={imgSrc} alt="user icon" />
                     <div className="text">
                        <p>{h.message}</p> <span>{when}</span>
                     </div>
                  </li>
               )
            })}
         </ul>
      </aside>
   )
}

export default HistoryPanel
