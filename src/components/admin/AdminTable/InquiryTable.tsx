// moovy-frontend/src/components/admin/AdminTable/InquiryTable.tsx

import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
  onRowClick?: (data: any) => void;
  onStatusClick?: (e: React.MouseEvent, data: any) => void;
  onDataCountChange?: (count: number) => void;
}

const InquiryTable: React.FC<TableProps> = ({ content, columns, onRowClick, onStatusClick, onDataCountChange }) => {
  const tableData = [
    {
      qna_id: 1,
      user_id: "Kate Morrison",
      category: "부적절한 언어 사용",
      content: "부적절한 언어를 사용한 사용자에 대한 문의입니다.",
      created_at: "2025-10-28",
      state: "미완료",
    },
    {
      qna_id: 2,
      user_id: "Kate Morrison",
      category: "광고글",
      content: "광고글에 대한 문의입니다.",
      created_at: "2025-10-28",
      state: "답변완료",
    },
    {
      qna_id: 3,
      user_id: "Kate Morrison",
      category: "도배글",
      content: "도배글에 대한 신고입니다.",
      created_at: "2025-10-28",
      state: "신고",
    },
    {
      qna_id: 4,
      user_id: "Kate Morrison",
      category: "부적절한 언어 사용",
      content: "부적절한 언어 사용에 대한 문의입니다.",
      created_at: "2025-10-28",
      state: "답변완료",
    },
    {
      qna_id: 5,
      user_id: "Kate Morrison",
      category: "광고글",
      content: "광고글에 대한 문의입니다.",
      created_at: "2025-10-28",
      state: "미완료",
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
          key={data.qna_id}
          onClick={() => onRowClick?.(data)}
          style={{ cursor: "pointer" }}
        >
          <li>
            <img src={Avatar} /> {data.user_id}
          </li>
          <li>{data.category}</li>
          <li>{data.created_at}</li>
          <li 
            className={`status status--${data.state === "답변완료" ? "completed" : data.state === "미완료" ? "pending" : "reported"}`}
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

export default InquiryTable;
