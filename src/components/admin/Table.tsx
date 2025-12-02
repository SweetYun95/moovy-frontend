// moovy-frontend/src/components/admin/Table.tsx

import React from "react";

import { StandardPagination } from "../common/Pagination";
import { ActionButton, StatusButton } from "../common/Button/Button";
import DashboardTable from "./AdminTable/DashboardTable";
import UserTable from "./AdminTable/UserTable";
import TopicTable from "./AdminTable/TopicTable";
import InquiryTable from "./AdminTable/InquiryTable";
import ReportTable from "./AdminTable/ReportTable";
import {
  ReportManagementFilter,
  UserManagementFilter,
  WorkManagementFilter,
} from "./AdminFilter";

interface TableProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
}

const Table: React.FC<TableProps> = ({ content }) => {
  const columns = React.useMemo(() => {
    switch (content) {
      case "user":
        return [
          "",
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
            {content === "topic" && <WorkManagementFilter />}
            {/* {content === "inquiry" && 필터 생성되면 추가하기} */}
            {content === "report" && <ReportManagementFilter />}
            <div className={`table ${content}-table`}>
              <ul className="header">
                {columns.map((column) => (
                  <li key={column}>{column}</li>
                ))}
              </ul>

              {content === "user" && (
                <UserTable columns={columns} content={content} />
              )}
              {content == "topic" && (
                <TopicTable columns={columns} content={content} />
              )}
              {content == "inquiry" && (
                <InquiryTable columns={columns} content={content} />
              )}
              {content == "report" && (
                <ReportTable columns={columns} content={content} />
              )}
            </div>

            <StandardPagination />
            <div className="button">
              <ActionButton action="confirm" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Table;
