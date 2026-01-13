// moovy-frontend/src/components/admin/Table.tsx
import React from 'react'

import { StandardPagination } from '../common/Pagination'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getAdminUsers } from '../../features/admin/usersSlice'
import { answerAdminInquiry, getAdminInquiryDetail, getAdminInquiries } from '../../features/admin/adminInquirySlice'
import { completeAdminReport, getAdminReportDetail, getAdminReports } from '../../features/admin/adminReportsSlice'
import { postSanction } from '../../features/admin/usersSlice'
import DashboardTable from './AdminTable/DashboardTable'
import UserTable from './AdminTable/UserTable'
import TopicManagement from './TopicManagement/TopicManagement'
import InquiryTable from './AdminTable/InquiryTable'
import ReportTable, { type AdminReportRow } from './AdminTable/ReportTable'
import { ReportManagementFilter, UserManagementFilter, QnAManagementFilter } from './AdminFilter'
import InquiryModal from '../modals/InquiryModal/InquiryModal'
import ReportModal from '../modals/ReportModal/ReportModal'
import ReportedPostModal, { type ReportedPostModalData } from '../modals/ReportedPostModal/ReportedPostModal'

interface TableProps {
   content: 'dashboard' | 'user' | 'topic' | 'inquiry' | 'report'
}

const Table: React.FC<TableProps> = ({ content }) => {
   const dispatch = useAppDispatch()
   const adminUsersList = useAppSelector((s) => s.adminUsers.list)
   const adminInquiryList = useAppSelector((s) => s.adminInquiry.list)
   const adminInquiryDetailById = useAppSelector((s) => s.adminInquiry.detailById)
   const adminReportsList = useAppSelector((s) => s.adminReports.list)
   const adminReportDetailByKey = useAppSelector((s) => s.adminReports.detailByKey)

   const tableRef = React.useRef<HTMLDivElement>(null)
   const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false)
   const [isReportModalOpen, setIsReportModalOpen] = React.useState(false)
   const [isReportedPostModalOpen, setIsReportedPostModalOpen] = React.useState(false)
   const [selectedData, setSelectedData] = React.useState<any>(null)
   const [selectedReportedPost, setSelectedReportedPost] = React.useState<ReportedPostModalData | undefined>(undefined)
   const [selectedInquiryId, setSelectedInquiryId] = React.useState<number | null>(null)
   const [selectedReportKey, setSelectedReportKey] = React.useState<string | null>(null)
   const [totalItems, setTotalItems] = React.useState(0)
   const [appliedUserFilters, setAppliedUserFilters] = React.useState<Record<string, any>>({})
   const [appliedInquiryFilters, setAppliedInquiryFilters] = React.useState<Record<string, any>>({})
   const [appliedReportFilters, setAppliedReportFilters] = React.useState<Record<string, any>>({})

   const reportRows = React.useMemo<AdminReportRow[]>(() => {
      const toYmd = (v?: string) => (v ? String(v).slice(0, 10) : '')
      return (adminReportsList.items || []).map((r: any) => ({
         type: r.type,
         report_id: r.report_id,
         reporter_user_id: r.reporter?.user_id,
         reporter_name: r.reporter?.name ?? '-',
         reported_user_id: r.reported?.user_id,
         reported_name: r.reported?.name ?? '-',
         post_type: r.post?.type,
         post_id: r.post?.id,
         post_content: r.post?.content ?? '',
         category: r.category,
         created_at: toYmd(r.created_at),
         state: r.status,
         report_content: r.report_content,
      }))
   }, [adminReportsList.items])

   // user 목록: 서버 페이징 연동
   React.useEffect(() => {
      if (content !== 'user') return

      const page = adminUsersList.page || 1
      const size = adminUsersList.size || 20

      dispatch(
         getAdminUsers({
            page,
            size,
         }),
      )
   }, [content, dispatch])

   // inquiry 목록: 서버 페이징/필터 연동
   React.useEffect(() => {
      if (content !== 'inquiry') return
      dispatch(
         getAdminInquiries({
            ...appliedInquiryFilters,
            page: 1,
            size: adminInquiryList.size || 10,
         }),
      )
   }, [content, dispatch])

   // report 목록: 서버 페이징/필터 연동
   React.useEffect(() => {
      if (content !== 'report') return
      dispatch(
         getAdminReports({
            ...appliedReportFilters,
            page: 1,
            size: adminReportsList.size || 10,
         }),
      )
   }, [content, dispatch])

   const openModalByStatus = (data: any) => {
      setSelectedData(data)
      if (content === 'inquiry') {
         const qnaId = data?.qna_id
         setSelectedInquiryId(typeof qnaId === 'number' ? qnaId : null)
         if (typeof qnaId === 'number') dispatch(getAdminInquiryDetail(qnaId))
         setIsInquiryModalOpen(true)
      } else if (content === 'report') {
         const type = data?.type as 'comment' | 'reply' | undefined
         const reportId = data?.report_id as number | undefined
         if (type && typeof reportId === 'number') {
            setSelectedReportKey(`${type}:${reportId}`)
            dispatch(getAdminReportDetail({ type, report_id: reportId }))
         } else {
            setSelectedReportKey(null)
         }
         setIsReportModalOpen(true)
      }
   }

   const handleRowClick = (data: any) => {
      setSelectedData(data)
      if (content === 'inquiry') {
         const qnaId = data?.qna_id
         setSelectedInquiryId(typeof qnaId === 'number' ? qnaId : null)
         if (typeof qnaId === 'number') dispatch(getAdminInquiryDetail(qnaId))
         setIsInquiryModalOpen(true)
      } else if (content === 'report') {
         const type = data?.type as 'comment' | 'reply' | undefined
         const reportId = data?.report_id as number | undefined
         if (type && typeof reportId === 'number') {
            setSelectedReportKey(`${type}:${reportId}`)
            dispatch(getAdminReportDetail({ type, report_id: reportId }))
         } else {
            setSelectedReportKey(null)
         }
         setIsReportModalOpen(true)
      }
   }

   const handleStatusClick = (e: React.MouseEvent, data: any) => {
      e.stopPropagation()
      openModalByStatus(data)
   }

   React.useEffect(() => {
      const syncColumnWidths = () => {
         if (!tableRef.current) return

         const headerUl = tableRef.current.querySelector('ul.header')
         const dataUls = tableRef.current.querySelectorAll('ul.data')

         if (!headerUl || dataUls.length === 0) return

         const headerLis = headerUl.querySelectorAll('li')
         headerLis.forEach((headerLi, index) => {
            const width = (headerLi as HTMLElement).offsetWidth

            dataUls.forEach((dataUl) => {
               const dataLi = dataUl.querySelectorAll('li')[index] as HTMLElement
               if (dataLi) {
                  dataLi.style.width = `${width}px`
                  dataLi.style.minWidth = `${width}px`
                  dataLi.style.maxWidth = `${width}px`
               }
            })
            ;(headerLi as HTMLElement).style.width = `${width}px`
            ;(headerLi as HTMLElement).style.minWidth = `${width}px`
            ;(headerLi as HTMLElement).style.maxWidth = `${width}px`
         })
      }

      const timeoutId = setTimeout(syncColumnWidths, 0)
      window.addEventListener('resize', syncColumnWidths)
      return () => {
         clearTimeout(timeoutId)
         window.removeEventListener('resize', syncColumnWidths)
      }
   }, [content])

   const columns = React.useMemo(() => {
      switch (content) {
         case 'user':
            return ['유저', '닉네임', '이메일', '코멘트', '댓글', '관리자 경고']
         case 'topic':
            return ['작품 제목', '작품 정보', '시작일', '종료일', '조회수']
         case 'inquiry':
            return ['유저ID', '유저', '문의 제목', '작성일', '답변일', '상태']
         case 'report':
            return ['신고자', '신고대상', '신고 게시글 종류/번호', '분류', '신고일', '상태']
         default:
            return []
      }
   }, [content])

   return (
      <>
         {content === 'dashboard' ? (
            <DashboardTable />
         ) : (
            <>
               <div className="admin-content">
                  {content === 'user' && <UserManagementFilter onSearch={setAppliedUserFilters} />}
                  {content === 'inquiry' && (
                     <QnAManagementFilter
                        onSearch={(filters) => {
                           setAppliedInquiryFilters(filters)
                           dispatch(
                              getAdminInquiries({
                                 ...filters,
                                 page: 1,
                                 size: adminInquiryList.size || 10,
                              }),
                           )
                        }}
                     />
                  )}
                  {content === 'report' && (
                     <ReportManagementFilter
                        onSearch={(filters) => {
                           setAppliedReportFilters(filters)
                           dispatch(
                              getAdminReports({
                                 ...filters,
                                 page: 1,
                                 size: adminReportsList.size || 10,
                              }),
                           )
                        }}
                     />
                  )}
                  {content === 'topic' ? (
                     <TopicManagement />
                  ) : (
                     <>
                        <div className={`table ${content}-table`} ref={tableRef}>
                           <ul className="header">
                              {columns.map((column) => (
                                 <li key={column}>{column}</li>
                              ))}
                           </ul>

                           {content === 'user' && (
                              <UserTable
                                 columns={columns}
                                 content={content}
                                 filters={appliedUserFilters}
                                 users={adminUsersList.items}
                                 onRefresh={() => dispatch(getAdminUsers({ page: adminUsersList.page, size: adminUsersList.size }))}
                              />
                           )}
                           {content === 'inquiry' && (
                              <InquiryTable
                                 columns={columns}
                                 content={content}
                                 rows={adminInquiryList.items}
                                 onRowClick={handleRowClick}
                                 onStatusClick={handleStatusClick}
                              />
                           )}
                           {content === 'report' && (
                              <ReportTable
                                 columns={columns}
                                 content={content}
                                 rows={reportRows}
                                 onRowClick={handleRowClick}
                                 onStatusClick={handleStatusClick}
                                 onPostClick={(e, row) => {
                                    e.stopPropagation()
                                    setSelectedReportedPost({ type: row.post_type, id: row.post_id, content: row.post_content })
                                    setIsReportedPostModalOpen(true)
                                 }}
                              />
                           )}
                        </div>

                        <StandardPagination
                           className="mt-4"
                           totalItems={content === 'user' ? adminUsersList.total : content === 'inquiry' ? adminInquiryList.total : content === 'report' ? adminReportsList.total : totalItems}
                           itemsPerPage={content === 'user' ? adminUsersList.size : content === 'inquiry' ? adminInquiryList.size : content === 'report' ? adminReportsList.size : undefined}
                           currentPage={content === 'user' ? adminUsersList.page : content === 'inquiry' ? adminInquiryList.page : content === 'report' ? adminReportsList.page : undefined}
                           onPageChange={
                              content === 'user'
                                 ? (nextPage) => {
                                      dispatch(getAdminUsers({ page: nextPage, size: adminUsersList.size }))
                                   }
                                 : content === 'inquiry'
                                   ? (nextPage) => {
                                        dispatch(
                                           getAdminInquiries({
                                              ...appliedInquiryFilters,
                                              page: nextPage,
                                              size: adminInquiryList.size || 10,
                                           }),
                                        )
                                     }
                                   : content === 'report'
                                     ? (nextPage) => {
                                          dispatch(
                                             getAdminReports({
                                                ...appliedReportFilters,
                                                page: nextPage,
                                                size: adminReportsList.size || 10,
                                             }),
                                          )
                                       }
                                     : undefined
                           }
                        />
                     </>
                  )}
               </div>
            </>
         )}

         {content === 'inquiry' && (
            <InquiryModal
               isOpen={isInquiryModalOpen}
               onClose={() => {
                  setIsInquiryModalOpen(false)
                  setSelectedInquiryId(null)
               }}
               mode="admin"
               inquiryData={(() => {
                  const qnaId = selectedInquiryId
                  const detail = qnaId ? adminInquiryDetailById[qnaId]?.item : null
                  const qna = detail?.qna
                  const fallback = selectedData
                  return qna || fallback
                     ? {
                          title: (qna?.q_title ?? fallback?.q_title ?? '').toString(),
                          content: (qna?.q_contnet ?? qna?.q_content ?? fallback?.q_contnet ?? fallback?.q_content ?? '').toString(),
                          initialReplyTitle: (qna?.a_title ?? fallback?.a_title ?? '').toString(),
                          initialReply: (qna?.a_content ?? fallback?.a_content ?? '').toString(),
                          answererName: (qna?.AdminUser?.name ?? fallback?.AdminUser?.name ?? '').toString(),
                       }
                     : undefined
               })()}
               readOnly={(() => {
                  const qnaId = selectedInquiryId
                  const detail = qnaId ? adminInquiryDetailById[qnaId]?.item : null
                  const state = detail?.qna?.state ?? selectedData?.state
                  return state === 'FULFILLED' || state === '답변완료'
               })()}
               onSubmit={async (data) => {
                  const qnaId = selectedInquiryId
                  if (!qnaId) return
                  if (!data.title?.trim() || !data.content?.trim()) return
                  if (!data.replyTitle?.trim() || !data.reply?.trim()) return

                  await dispatch(answerAdminInquiry({ qna_id: qnaId, a_title: data.replyTitle, a_content: data.reply }))
                  dispatch(getAdminInquiryDetail(qnaId))
                  dispatch(getAdminInquiries({ ...appliedInquiryFilters, page: adminInquiryList.page, size: adminInquiryList.size || 10 }))
               }}
            />
         )}

         {content === 'report' && (
            <ReportModal
               isOpen={isReportModalOpen}
               onClose={() => {
                  setIsReportModalOpen(false)
                  setSelectedReportKey(null)
               }}
               mode="admin"
               reportData={(() => {
                  const fallback = selectedData
                  const detail = selectedReportKey ? adminReportDetailByKey[selectedReportKey]?.item : null
                  const category = detail?.category ?? fallback?.category ?? ''
                  const reportContent = detail?.report_content ?? fallback?.report_content ?? fallback?.content ?? '신고 내용이 없습니다.'
                  const reportedName = detail?.reported?.name ?? fallback?.reported_name ?? ''
                  const action = detail?.action
                  return fallback || detail
                     ? {
                          category,
                          content: reportContent,
                          targetUser: {
                             name: reportedName,
                             reportCount: 0,
                          },
                          sanctionAction: action === '제재' ? '제재' : action === '조치 안함' ? '조치 안함' : undefined,
                       }
                     : undefined
               })()}
               readOnly={content === 'report' && selectedData?.state === '처리완료'}
               onSubmit={(data) => {
                  const row = selectedData as AdminReportRow | null
                  const type = row?.type
                  const reportId = row?.report_id
                  const reportedUserId = row?.reported_user_id

                  if (!type || typeof reportId !== 'number') return

                  void (async () => {
                     try {
                        if (data?.sanctionAction === '제재') {
                           if (typeof reportedUserId !== 'number') throw new Error('신고 대상 유저 정보를 찾을 수 없습니다.')
                           const days = data?.sanctionDays
                           if (typeof days !== 'number' || Number.isNaN(days) || days < 1 || days > 30) throw new Error('제재 기간이 올바르지 않습니다.')

                           const now = new Date()
                           const startAt = now.toISOString() // z.iso.datetime()
                           const end = new Date(now)
                           end.setUTCDate(end.getUTCDate() + days)
                           const endAt = end.toISOString() // z.iso.datetime()

                           const reason = data?.sanctionReason?.trim() || '신고 처리에 따른 제재'
                           await dispatch(postSanction({ user_id: reportedUserId, start_at: startAt, end_at: endAt, reason })).unwrap()
                        }
                        await dispatch(completeAdminReport({ type, report_id: reportId, action: data?.sanctionAction === '제재' ? 'SANCTION' : 'NONE' })).unwrap()
                        dispatch(getAdminReports({ ...appliedReportFilters, page: adminReportsList.page || 1, size: adminReportsList.size || 10 }))
                     } catch (e) {
                        console.error(e)
                     }
                  })()

                  setIsReportModalOpen(false)
               }}
            />
         )}

         {content === 'report' && (
            <ReportedPostModal
               isOpen={isReportedPostModalOpen}
               onClose={() => {
                  setIsReportedPostModalOpen(false)
                  setSelectedReportedPost(undefined)
               }}
               data={selectedReportedPost}
            />
         )}
      </>
   )
}

export default Table
