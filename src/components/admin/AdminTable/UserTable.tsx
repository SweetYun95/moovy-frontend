// moovy-frontend/src/components/admin/AdminTable/UserTable.tsx

import React from "react";

import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
  onRowClick?: (data: any) => void;
  onDataCountChange?: (count: number) => void;
}

const UserTable: React.FC<TableProps> = ({ content, columns, onRowClick, onDataCountChange }) => {
  const tableData = [
    {
      user_id: 1,
      user_name: "Kate Morrison",
      nickname: "kate_m",
      email: "kate@example.com",
      comments: 125,
      replies: 45,
      warnings: 0,
    },
    {
      user_id: 2,
      user_name: "Natali Craig",
      nickname: "natali_c",
      email: "natali@example.com",
      comments: 89,
      replies: 32,
      warnings: 1,
    },
    {
      user_id: 3,
      user_name: "John Doe",
      nickname: "john_d",
      email: "john@example.com",
      comments: 234,
      replies: 67,
      warnings: 0,
    },
    {
      user_id: 4,
      user_name: "Jane Smith",
      nickname: "jane_s",
      email: "jane@example.com",
      comments: 156,
      replies: 23,
      warnings: 2,
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
          key={data.user_id}
          onClick={() => onRowClick?.(data)}
          style={{ cursor: "pointer" }}
        >
          <li>
            <img src={Avatar} /> {data.user_name}
          </li>
          <li>{data.nickname}</li>
          <li>{data.email}</li>
          <li>{data.comments}</li>
          <li>{data.replies}</li>
          <li>{data.warnings}</li>
        </ul>
      ))}
    </>
  );
};

export default UserTable;
