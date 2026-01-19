// moovy-frontend/src/components/admin/AdminTable/InquiryTable.tsx

import React from "react";
import { fetchAdminQnas, type AdminQnaItem } from "../../../services/api/admin/adminQnaApi";
import Avatar from "../../../assets/Avatar.png";

interface TableProps {
  content: string;
  columns: string[];
  onRowClick?: (data: any) => void;
  onStatusClick?: (e: React.MouseEvent, data: any) => void;
  onDataCountChange?: (count: number) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const InquiryTable: React.FC<TableProps> = ({ content, columns, onRowClick, onStatusClick, onDataCountChange, currentPage = 1, onPageChange }) => {
  const [tableData, setTableData] = React.useState<AdminQnaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);

  // QnA 데이터 가져오기
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchAdminQnas({ page: currentPage, limit: 20 });
        setTableData(response.items);
        setTotal(response.total);
        onDataCountChange?.(response.total);
      } catch (error) {
        console.error("QnA 데이터 로드 실패:", error);
        setTableData([]);
        setTotal(0);
        onDataCountChange?.(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, onDataCountChange]);

  // 상태 변환 함수 (백엔드 state -> 프론트엔드 state)
  const convertState = (state: string): string => {
    switch (state) {
      case 'PENDING':
        return '미완료';
      case 'FULFILLED':
        return '답변완료';
      case 'CANCELLED':
        return '신고';
      default:
        return state;
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      {tableData.map((data) => {
        const state = convertState(data.state);
        const displayData = {
          ...data,
          user_id: data.User?.name || `User ${data.user_id}`,
          category: data.q_title || '일반 문의',
          content: data.q_content || '',
          created_at: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '',
          state,
        };

        return (
          <ul 
            className="data" 
            key={data.qna_id}
            onClick={() => onRowClick?.(displayData)}
            style={{ cursor: "pointer" }}
          >
            <li>
              <img src={data.User?.profile_img || Avatar} alt="" /> {displayData.user_id}
            </li>
            <li>{displayData.category}</li>
            <li>{displayData.created_at}</li>
            <li 
              className={`status status--${state === "답변완료" ? "completed" : state === "미완료" ? "pending" : "reported"}`}
              onClick={(e) => onStatusClick?.(e, displayData)}
              style={{ cursor: "pointer" }}
            >
              {state}
            </li>
          </ul>
        );
      })}
    </>
  );
};


export default InquiryTable
