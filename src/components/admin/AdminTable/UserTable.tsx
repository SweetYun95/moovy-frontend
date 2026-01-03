// moovy-frontend/src/components/admin/AdminTable/UserTable.tsx

import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
  onRowClick?: (data: any) => void;
}

const UserTable: React.FC<TableProps> = ({ content, columns, onRowClick }) => {
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
          <li>{data.report_type}</li>
          <li>내용…</li>
          <li>2025.10.28</li>
        </ul>
      ))}
    </>
  );
};

export default UserTable;
