// moovy-frontend/src/components/admin/AdminTable/ReportTable.tsx

import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
}

const ReportTable: React.FC<TableProps> = ({ content, columns }) => {
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
      report_id: 1,
      reporter_id: "Natali Craig",
      reported_id: "Kate Morrison",
      category: "신고내역",
      report_content: "신고 내용",
      created_at: "2025-10-08",
      state: "처리완료",
    },
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
      report_id: 1,
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
      {/* index 추후 수정 */}
      {tableData.map((data, index) => (
        <ul className="data" key={index}>
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
