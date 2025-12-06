// moovy-frontend/src/components/admin/AdminTable/InquiryTable.tsx

import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
}

const InquiryTable: React.FC<TableProps> = ({ content, columns }) => {
  const tableData = [
    {
      qna_id: 1,
      user_id: "Kate Morrison",
      category: "other",
      q_content: "2025-10-28",
      created_at: "2025-10-28",
      state: "PENDING",
    },
    {
      qna_id: 2,
      user_id: "Kate Morrison",
      category: "other",
      q_content: "2025-10-28",
      created_at: "2025-10-28",
      state: "PENDING",
    },
    {
      qna_id: 3,
      user_id: "Kate Morrison",
      category: "other",
      q_content: "2025-10-28",
      created_at: "2025-10-28",
      state: "PENDING",
    },
    {
      qna_id: 4,
      user_id: "Kate Morrison",
      category: "other",
      q_content: "2025-10-28",
      created_at: "2025-10-28",
      state: "FULFILLED",
    },
    {
      qna_id: 5,
      user_id: "Kate Morrison",
      category: "other",
      q_content: "2025-10-28",
      created_at: "2025-10-28",
      state: "FULFILLED",
    },
  ];

  return (
    <>
      {/* index 추후 수정 */}
      {tableData.map((data, index) => (
        <ul className="data" key={index}>
          <li>
            <img src={Avatar} /> {data.user_id}
          </li>
          <li>{data.category}</li>
          <li>{data.q_content}</li>
          <li>{data.created_at}</li>
          <li>{data.state}</li>
        </ul>
      ))}
    </>
  );
};

export default InquiryTable;
