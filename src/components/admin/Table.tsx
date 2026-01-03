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

interface TableProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
}

const Table: React.FC<TableProps> = ({ content }) => {
  const tableRef = React.useRef<HTMLDivElement>(null);

  const handleRowClick = (data: any) => {
    // TODO: 모달 열기 로직 추가
    console.log("Row clicked:", data);
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
        return ["유저", "분류", "내용", "작성일", "상태"];
      case "report":
        return ["유저", "신고한 유저", "분류", "내용", "작성일", "상태"];
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
                    />
                  )}
                  {content === "inquiry" && (
                    <InquiryTable 
                      columns={columns} 
                      content={content}
                      onRowClick={handleRowClick}
                    />
                  )}
                  {content === "report" && (
                    <ReportTable 
                      columns={columns} 
                      content={content}
                      onRowClick={handleRowClick}
                    />
                  )}
                </div>

                <StandardPagination className="mt-4" />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Table;
