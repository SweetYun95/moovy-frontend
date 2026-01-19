// moovy-frontend/src/components/admin/AdminTable/ReportTable.tsx

import React from "react";
import { fetchAdminReports, type AdminReportItem } from "../../../services/api/admin/adminReportApi";
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

const ReportTable: React.FC<TableProps> = ({ content, columns, onRowClick, onStatusClick, onDataCountChange, currentPage = 1, onPageChange }) => {
  const [tableData, setTableData] = React.useState<AdminReportItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);

  // Reports 데이터 가져오기
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchAdminReports({ page: currentPage, limit: 20 });
        setTableData(response.items);
        setTotal(response.total);
        onDataCountChange?.(response.total);
      } catch (error) {
        console.error("Reports 데이터 로드 실패:", error);
        setTableData([]);
        setTotal(0);
        onDataCountChange?.(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, onDataCountChange]);

  // 상태 변환 함수 (백엔드 status -> 프론트엔드 state)
  const convertState = (status: string): string => {
    switch (status) {
      case '대기중':
        return '확인하기';
      case '처리완료':
        return '처리완료';
      default:
        return status;
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      {tableData.map((data) => {
        const state = convertState(data.status);
        const displayData = {
          ...data,
          reporter_id: data.reporter?.name || `User ${data.reporter?.user_id}`,
          reported_id: data.reported?.name || `User ${data.reported?.user_id}`,
          created_at: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '',
          state,
          sanctionLevel: data.sanction ? '제재' : '',
          notification: data.action || '',
        };

        return (
          <ul 
            className="data" 
            key={data.report_id}
            onClick={() => onRowClick?.(displayData)}
            style={{ cursor: "pointer" }}
          >
            <li>
              <img src={data.reported?.profile_img || Avatar} alt="" /> {displayData.reported_id}
            </li>
            <li>
              <img src={data.reporter?.profile_img || Avatar} alt="" /> {displayData.reporter_id}
            </li>
            <li>{data.category}</li>
            <li>{displayData.created_at}</li>
            <li 
              className={`status status--${state === "처리완료" ? "completed" : "pending"} ${state === "확인하기" ? "status--clickable" : ""}`}
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


export default ReportTable
