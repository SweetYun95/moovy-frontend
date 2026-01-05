// moovy-frontend/src/components/admin/Table.tsx
import React from 'react'

import { StandardPagination } from '../common/Pagination'
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
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false)
  const [selectedData, setSelectedData] = React.useState<any>(null)
  const [totalItems, setTotalItems] = React.useState(0)
  const [appliedUserFilters, setAppliedUserFilters] = React.useState<Record<string, any>>({})

  const openModalByStatus = (data: any) => {
    setSelectedData(data)
    if (content === 'inquiry') {
      if (data.state === '신고') {
        setIsReportModalOpen(true)
      } else {
        setIsInquiryModalOpen(true)
      }
    } else if (content === 'report') {
      setIsReportModalOpen(true)
    }
  }

  const handleRowClick = (data: any) => {
    setSelectedData(data)
    if (content === 'inquiry') {
      if (data.state === '신고') {
        setIsReportModalOpen(true)
      } else {
        setIsInquiryModalOpen(true)
      }
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
        return ['유저', '분류', '작성일', '상태']
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
            {content === 'inquiry' && <QnAManagementFilter />}
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

                  {content === 'user' && <UserTable columns={columns} content={content} filters={appliedUserFilters} onDataCountChange={setTotalItems} />}
                  {content === 'inquiry' && <InquiryTable columns={columns} content={content} onRowClick={handleRowClick} onStatusClick={handleStatusClick} onDataCountChange={setTotalItems} />}
                  {content === 'report' && <ReportTable columns={columns} content={content} onRowClick={handleRowClick} onStatusClick={handleStatusClick} onDataCountChange={setTotalItems} />}
                </div>

                <StandardPagination className="mt-4" totalItems={totalItems} />
              </>
            )}
          </div>
        </>
      )}

      {content === 'inquiry' && selectedData?.state !== '신고' && (
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          mode="admin"
          inquiryData={
            selectedData
              ? {
                  category: selectedData.category || '',
                  content: selectedData.content || '문의 내용입니다.',
                  initialReply: selectedData.state === '답변완료' ? '답변 완료되었습니다.' : '',
                }
              : undefined
          }
          readOnly={selectedData?.state === '답변완료'}
          onSubmit={(data) => {
            console.log('Inquiry submitted:', data)
            setIsInquiryModalOpen(false)
          }}
          onReport={() => {
            console.log('Report inquiry')
          }}
        />
      )}

      {(content === 'report' || (content === 'inquiry' && selectedData?.state === '신고')) && (
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
          readOnly={(content === 'report' && selectedData?.state === '처리완료') || (content === 'inquiry' && selectedData?.state === '신고')}
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
