// moovy-frontend/src/components/admin/Table.tsx
import React from 'react'

import { StandardPagination } from '../common/Pagination'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getAdminUsers } from '../../features/admin/usersSlice'
import { answerAdminInquiry, getAdminInquiryDetail, getAdminInquiries } from '../../features/admin/adminInquirySlice'
import DashboardTable from './AdminTable/DashboardTable'
import UserTable from './AdminTable/UserTable'
import TopicManagement from './TopicManagement/TopicManagement'
import InquiryTable from './AdminTable/InquiryTable'
import ReportTable from './AdminTable/ReportTable'
import { ReportManagementFilter, UserManagementFilter, QnAManagementFilter } from './AdminFilter'
import InquiryModal from '../modals/InquiryModal/InquiryModal'
import ReportModal from '../modals/ReportModal/ReportModal'

interface TableProps {
   content: 'dashboard' | 'user' | 'topic' | 'inquiry' | 'report'
}

const Table: React.FC<TableProps> = ({ content }) => {
   const dispatch = useAppDispatch()
   const adminUsersList = useAppSelector((s) => s.adminUsers.list)
   const adminInquiryList = useAppSelector((s) => s.adminInquiry.list)
   const adminInquiryDetailById = useAppSelector((s) => s.adminInquiry.detailById)

   const tableRef = React.useRef<HTMLDivElement>(null)
   const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false)
   const [isReportModalOpen, setIsReportModalOpen] = React.useState(false)
   const [selectedData, setSelectedData] = React.useState<any>(null)
   const [selectedInquiryId, setSelectedInquiryId] = React.useState<number | null>(null)
   const [totalItems, setTotalItems] = React.useState(0)
   const [appliedUserFilters, setAppliedUserFilters] = React.useState<Record<string, any>>({})
   const [appliedInquiryFilters, setAppliedInquiryFilters] = React.useState<Record<string, any>>({})

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

   const openModalByStatus = (data: any) => {
      setSelectedData(data)
      if (content === 'inquiry') {
         const qnaId = data?.qna_id
         setSelectedInquiryId(typeof qnaId === 'number' ? qnaId : null)
         if (typeof qnaId === 'number') dispatch(getAdminInquiryDetail(qnaId))
         setIsInquiryModalOpen(true)
      } else if (content === 'report') {
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
            return ['', '유저', '닉네임', '이메일', '코멘트', '댓글', '경고']
         case 'topic':
            return ['작품 제목', '작품 정보', '시작일', '종료일', '조회수']
         case 'inquiry':
            return ['유저ID', '유저', '문의 제목', '작성일', '답변일', '상태']
         case 'report':
            return ['유저', '신고한 유저', '분류', '작성일', '상태']
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
                  {content === 'report' && <ReportManagementFilter />}
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

                           {content === 'user' && <UserTable columns={columns} content={content} filters={appliedUserFilters} users={adminUsersList.items} onRefresh={() => dispatch(getAdminUsers({ page: adminUsersList.page, size: adminUsersList.size }))} />}
                           {content === 'inquiry' && <InquiryTable columns={columns} content={content} rows={adminInquiryList.items} onRowClick={handleRowClick} onStatusClick={handleStatusClick} />}
                           {content === 'report' && <ReportTable columns={columns} content={content} onRowClick={handleRowClick} onStatusClick={handleStatusClick} onDataCountChange={setTotalItems} />}
                        </div>

                        <StandardPagination
                           className="mt-4"
                           totalItems={content === 'user' ? adminUsersList.total : content === 'inquiry' ? adminInquiryList.total : totalItems}
                           itemsPerPage={content === 'user' ? adminUsersList.size : content === 'inquiry' ? adminInquiryList.size : undefined}
                           currentPage={content === 'user' ? adminUsersList.page : content === 'inquiry' ? adminInquiryList.page : undefined}
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
               onClose={() => setIsReportModalOpen(false)}
               mode="admin"
               reportData={
                  selectedData
                     ? {
                          category: selectedData.category || '',
                          content: selectedData.content || '신고 내용입니다.',
                          targetUser: {
                             name: content === 'report' ? selectedData.reported_id || '' : selectedData.user_id || '',
                             reportCount: 0,
                          },
                          sanctionLevel: selectedData.sanctionLevel || '',
                          notification: selectedData.notification || '',
                       }
                     : undefined
               }
               readOnly={content === 'report' && selectedData?.state === '처리완료'}
               onSubmit={(data) => {
                  console.log('Report submitted:', data)
                  setIsReportModalOpen(false)
               }}
            />
         )}
      </>
   )
}

export default Table
