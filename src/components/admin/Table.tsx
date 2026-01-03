// moovy-frontend/src/components/admin/Table.tsx

import React from "react";

import { StandardPagination } from "../common/Pagination";
import DashboardTable from "./AdminTable/DashboardTable";
import UserTable from "./AdminTable/UserTable";
import TopicManagement from "./TopicManagement/TopicManagement";
import InquiryTable from "./AdminTable/InquiryTable";
import ReportTable from "./AdminTable/ReportTable";
import {
  ReportManagementFilter,
  UserManagementFilter,
  WorkManagementFilter,
  QnAManagementFilter,
} from "./AdminFilter";
import InquiryModal from "../modals/InquiryModal/InquiryModal";
import ReportModal from "../modals/ReportModal/ReportModal";

interface TableProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
}

const Table: React.FC<TableProps> = ({ content }) => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<any>(null);
  const [totalItems, setTotalItems] = React.useState(0);
  
  // 상태별 모달 열기 함수
  const openModalByStatus = (data: any) => {
    setSelectedData(data);
    if (content === "inquiry") {
      // 1:1 문의: "신고" 상태는 ReportModal, 나머지는 InquiryModal
      if (data.state === "신고") {
        setIsReportModalOpen(true);
      } else {
        setIsInquiryModalOpen(true);
      }
    } else if (content === "report") {
      // 신고 내역: 모든 상태에서 ReportModal
      setIsReportModalOpen(true);
    }
  };
  
  // 모달이 읽기 전용인지 확인
  const isReadOnly = (state: string) => {
    if (content === "inquiry") {
      return state === "답변완료"; // 답변완료는 읽기 전용
    } else if (content === "report") {
      return state === "처리완료"; // 처리완료는 읽기 전용
    }
    return false;
  };

  const handleRowClick = (data: any) => {
    setSelectedData(data);
    if (content === "inquiry") {
      // 1:1 문의: "신고" 상태는 ReportModal, 나머지는 InquiryModal
      if (data.state === "신고") {
        setIsReportModalOpen(true);
      } else {
        setIsInquiryModalOpen(true);
      }
    } else if (content === "report") {
      setIsReportModalOpen(true);
    }
  };

  const handleStatusClick = (e: React.MouseEvent, data: any) => {
    e.stopPropagation();
    openModalByStatus(data);
  };

  // ul.header와 ul.data의 li 너비를 동기화
  React.useEffect(() => {
    const syncColumnWidths = () => {
      if (!tableRef.current) return;

      const headerUl = tableRef.current.querySelector('ul.header');
      const dataUls = tableRef.current.querySelectorAll('ul.data');

      if (!headerUl || dataUls.length === 0) return;

      const headerLis = headerUl.querySelectorAll('li');
      
      // 각 li의 너비를 계산하여 모든 ul.data의 같은 인덱스 li에 적용
      headerLis.forEach((headerLi, index) => {
        const width = (headerLi as HTMLElement).offsetWidth;
        
        // 모든 ul.data의 같은 인덱스 li에 너비 적용
        dataUls.forEach((dataUl) => {
          const dataLi = dataUl.querySelectorAll('li')[index] as HTMLElement;
          if (dataLi) {
            dataLi.style.width = `${width}px`;
            dataLi.style.minWidth = `${width}px`;
            dataLi.style.maxWidth = `${width}px`;
          }
        });
        
        // header li에도 너비 적용 (일관성 유지)
        (headerLi as HTMLElement).style.width = `${width}px`;
        (headerLi as HTMLElement).style.minWidth = `${width}px`;
        (headerLi as HTMLElement).style.maxWidth = `${width}px`;
      });
    };

    // DOM이 렌더링된 후 실행
    const timeoutId = setTimeout(syncColumnWidths, 0);
    
    // 윈도우 리사이즈 시에도 동기화
    window.addEventListener('resize', syncColumnWidths);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', syncColumnWidths);
    };
  }, [content]);

  const columns = React.useMemo(() => {
    switch (content) {
      case "user":
        return [
          "유저",
          "닉네임",
          "이메일",
          "코멘트",
          "댓글",
          "관리자 경고",
        ];
      case "topic":
        return ["작품 제목", "작품 정보", "시작일", "종료일", "조회수"];
      case "inquiry":
        return ["유저", "분류", "작성일", "상태"];
      case "report":
        return ["유저", "신고한 유저", "분류", "작성일", "상태"];
      default:
        return [];
    }
  }, [content]);

  const tableData = [
    {
      report_id: 1,
      reporter_id: "Natali Craig",
      reported_id: "Natali Craig",
      comment_id: 1,
      report_type: "spam",
    },
    {
      report_id: 2,
      reporter_id: "Natali Craig",
      reported_id: "Natali Craig",
      comment_id: 2,
      report_type: "other",
    },
    {
      report_id: 3,
      reporter_id: "Natali Craig",
      reported_id: "Natali Craig",
      comment_id: 3,
      report_type: "abuse",
    },
    {
      report_id: 4,
      reporter_id: "Natali Craig",
      reported_id: "Natali Craig",
      comment_id: 4,
      report_type: "other",
    },
  ];
  return (
    <>
      {content === "dashboard" ? (
        <DashboardTable />
      ) : (
        <>
          <div className="admin-content">
            {content === "user" && <UserManagementFilter />}
            {content === "inquiry" && <QnAManagementFilter />}
            {content === "report" && <ReportManagementFilter />}
            {content === "topic" ? (
              <TopicManagement />
            ) : (
              <>
                <div className={`table ${content}-table`} ref={tableRef}>
                  <ul className="header">
                    {columns.map((column) => (
                      <li key={column}>{column}</li>
                    ))}
                  </ul>

                  {content === "user" && (
                    <UserTable 
                      columns={columns} 
                      content={content}
                      onRowClick={handleRowClick}
                      onDataCountChange={setTotalItems}
                    />
                  )}
                  {content === "inquiry" && (
                    <InquiryTable 
                      columns={columns} 
                      content={content}
                      onRowClick={handleRowClick}
                      onStatusClick={handleStatusClick}
                      onDataCountChange={setTotalItems}
                    />
                  )}
                  {content === "report" && (
                    <ReportTable 
                      columns={columns} 
                      content={content}
                      onRowClick={handleRowClick}
                      onStatusClick={handleStatusClick}
                      onDataCountChange={setTotalItems}
                    />
                  )}
                </div>

                <StandardPagination className="mt-4" totalItems={totalItems} />
              </>
            )}
          </div>
        </>
      )}

      {/* 1:1 문의 모달 */}
      {content === "inquiry" && selectedData?.state !== "신고" && (
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          mode="admin"
          inquiryData={selectedData ? {
            category: selectedData.category || "",
            content: selectedData.content || "문의 내용입니다.",
            initialReply: selectedData.state === "답변완료" ? "답변 완료되었습니다." : ""
          } : undefined}
          readOnly={selectedData?.state === "답변완료"}
          onSubmit={(data) => {
            console.log("Inquiry submitted:", data);
            setIsInquiryModalOpen(false);
          }}
          onReport={() => {
            console.log("Report inquiry");
          }}
        />
      )}

      {/* 신고 모달 - 신고 내역 또는 1:1 문의의 신고 상태 */}
      {(content === "report" || (content === "inquiry" && selectedData?.state === "신고")) && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          mode="admin"
          reportData={selectedData ? {
            category: selectedData.category || "",
            content: selectedData.content || "신고 내용입니다.",
            targetUser: {
              name: content === "report" ? (selectedData.reported_id || "") : (selectedData.user_id || ""),
              reportCount: 0
            },
            sanctionLevel: selectedData.sanctionLevel || "",
            notification: selectedData.notification || ""
          } : undefined}
          readOnly={(content === "report" && selectedData?.state === "처리완료") || (content === "inquiry" && selectedData?.state === "신고")}
          onSubmit={(data) => {
            console.log("Report submitted:", data);
            setIsReportModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Table;
