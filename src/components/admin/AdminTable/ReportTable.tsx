// moovy-frontend/src/components/admin/AdminTable/ReportTable.tsx
//모달 연결 로직은 Table.tsx의 handleRowClick 함수에 추가하면됩니다.
import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
  onRowClick?: (data: any) => void;
  onStatusClick?: (e: React.MouseEvent, data: any) => void;
  onDataCountChange?: (count: number) => void;
}

const ReportTable: React.FC<TableProps> = ({ content, columns, onRowClick, onStatusClick, onDataCountChange }) => {
  const tableData = [
    {
      report_id: 1,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "부적절한 언어 사용",
      content: "부적절한 언어를 사용한 사용자에 대한 신고입니다.",
      created_at: "2025-10-08",
      state: "확인하기",
    },
    {
      report_id: 2,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "광고글",
      content: "광고글에 대한 신고입니다.",
      created_at: "2025-10-08",
      state: "처리완료",
      sanctionLevel: "경고",
      notification: "처리 완료되었습니다.",
    },
    {
      report_id: 3,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "도배글",
      content: "도배글에 대한 신고입니다.",
      created_at: "2025-10-08",
      state: "확인하기",
    },
    {
      report_id: 4,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "부적절한 언어 사용",
      content: "부적절한 언어 사용에 대한 신고입니다.",
      created_at: "2025-10-08",
      state: "처리완료",
      sanctionLevel: "경고",
      notification: "처리 완료되었습니다.",
    },
  ];

  React.useEffect(() => {
    onDataCountChange?.(tableData.length);
  }, [onDataCountChange]);

  return (
    <>
      {tableData.map((data) => (
        <ul 
          className="data" 
          key={data.report_id}
          onClick={() => onRowClick?.(data)}
          style={{ cursor: "pointer" }}
        >
          <li>
            <img src={Avatar} /> {data.reported_id}
          </li>
          <li>
            <img src={Avatar} /> {data.reporter_id}
          </li>
          <li>{data.category}</li>
          <li>{data.created_at}</li>
          <li 
            className={`status status--${data.state === "처리완료" ? "completed" : "pending"} ${data.state === "확인하기" ? "status--clickable" : ""}`}
            onClick={(e) => onStatusClick?.(e, data)}
            style={{ cursor: "pointer" }}
          >
            {data.state}
          </li>
        </ul>
      ))}
    </>
  );
};

export default ReportTable;
