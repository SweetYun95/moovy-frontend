// moovy-frontend/src/components/admin/AdminTable/ReportTable.tsx
//모달 연결 로직은 Table.tsx의 handleRowClick 함수에 추가하면됩니다.
import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
  onRowClick?: (data: any) => void;
}

const ReportTable: React.FC<TableProps> = ({ content, columns, onRowClick }) => {
  const tableData = [
    {
      report_id: 1,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "신고내역",
      report_content: "신고 내용",
      created_at: "2025-10-08",
      state: "처리완료",
    },
    {
      report_id: 2,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "신고내역",
      report_content: "신고 내용",
      created_at: "2025-10-08",
      state: "처리완료",
    },
    {
      report_id: 3,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "신고내역",
      report_content: "신고 내용",
      created_at: "2025-10-08",
      state: "처리완료",
    },
    {
      report_id: 4,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "신고내역",
      report_content: "신고 내용",
      created_at: "2025-10-08",
      state: "처리완료",
    },
  ];

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
          <li>{data.report_content}</li>
          <li>{data.created_at}</li>
          <li>{data.state}</li>
        </ul>
      ))}
    </>
  );
};

export default ReportTable;
