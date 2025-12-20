// moovy-frontend/src/components/admin/AdminTable/TopicTable.tsx

import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
}

const TopicTable: React.FC<TableProps> = ({ content, columns }) => {
  // 추후 수정
  const tableData = [
    {
      title: "다 이루어질 지니",
      synopsis: "줄거리 혹은 내용을 입력하세요",
      start_at: "2025-10-28",
      end_at: "2025-10-28",
      views: 99,
    },
    {
      title: "아이언맨",
      synopsis: "줄거리 혹은 내용을 입력하세요",
      start_at: "2025-10-28",
      end_at: "2025-10-28",
      views: 99,
    },
    {
      title: "대도시의 사랑법",
      synopsis: "줄거리 혹은 내용을 입력하세요",
      start_at: "2025-10-28",
      end_at: "2025-10-28",
      views: 99,
    },
    {
      title: "야당",
      synopsis: "줄거리 혹은 내용을 입력하세요",
      start_at: "2025-10-28",
      end_at: "2025-10-28",
      views: 99,
    },
    {
      title: "세계의 주인",
      synopsis: "줄거리 혹은 내용을 입력하세요",
      start_at: "2025-10-28",
      end_at: "2025-10-28",
      views: 99,
    },
  ];

  return (
    <>
      {/* index 추후 수정 */}
      {tableData.map((data, index) => (
        <ul className="data" key={index}>
          <li>
            <img src={Avatar} /> {data.title}
          </li>
          <li>{data.synopsis}</li>
          <li>{data.start_at}</li>
          <li>{data.end_at}</li>
          <li>{data.views}</li>
        </ul>
      ))}
    </>
  );
};

export default TopicTable;
