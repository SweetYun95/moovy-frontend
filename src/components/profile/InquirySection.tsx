// src/components/profile/InquirySection.tsx
import { useState, useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { InquiryModalComponent } from "@/components/modals/InquiryModal/InquiryModal";
import { Button } from "@/components/common/Button/ButtonStyle";
import { getInquiries, type Inquiry } from "@/services/api/inquiryApi";
import { formatDateDot } from "@/utils/format";
import { ProfileTable, type TableColumn } from "./ProfileTable";

export const InquirySection: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // 문의 내역 불러오기
  useEffect(() => {
    if (user) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await getInquiries();
      setInquiries(data.list || []);
    } catch (error) {
      console.error("문의 내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySuccess = () => {
    setIsModalOpen(false);
    loadInquiries(); // 목록 새로고침
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "답변완료";
      case "processing":
        return "작성완료";
      case "pending":
      default:
        return "대기중";
    }
  };

  const getStatusVariant = (status: string): "success" | "info" => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      default:
        return "info";
    }
  };

  // 테이블 컬럼 정의
  const columns: TableColumn[] = [
    {
      key: "no",
      label: "No",
    },
    {
      key: "title",
      label: "제목",
    },
    {
      key: "content",
      label: "내용",
      render: (value: string) => (
        <div
          style={{
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
  </div>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (value: string, row: any) => (
        <Button
          variant={getStatusVariant(row.status)}
          size="sm"
          disabled
        >
          {getStatusLabel(row.status)}
        </Button>
      ),
    },
  ];

  // 테이블 데이터 변환
  const tableData = inquiries.map((inquiry, index) => ({
    id: inquiry.id,
    no: inquiries.length - index,
    title: inquiry.category || "건의사항",
    content: inquiry.content || "건의사항 내용",
    status: inquiry.status,
  }));

  return (
    <>
      <ProfileTable
        title="1:1 문의"
        columns={columns}
        data={loading ? [] : tableData}
        headerButton={
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
          >
            문의하기
          </Button>
        }
        emptyMessage={loading ? "로딩 중..." : "문의 내역이 없습니다."}
        totalItems={inquiries.length}
        itemsPerPage={10}
      />

      <InquiryModalComponent
        isOpen={isModalOpen}
        onClose={handleInquirySuccess}
      />
    </>
  );
};
