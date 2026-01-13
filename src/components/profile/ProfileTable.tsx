// src/components/profile/ProfileTable.tsx
import React from "react";
import { StandardPagination } from "../common/Pagination/PaginationComponents";
import "./ProfileTable.scss";

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ProfileTableProps {
  title: string;
  titleIcon?: string;
  columns: TableColumn[];
  data: any[];
  onBackClick?: () => void;
  headerButton?: React.ReactNode;
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const ProfileTable: React.FC<ProfileTableProps> = ({
  title,
  titleIcon,
  columns,
  data,
  onBackClick,
  headerButton,
  onRowClick,
  emptyMessage = "데이터가 없습니다.",
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  return (
    <section className="inner-table">
      <div className="inner-table__header">
        <h4 className="mb-0">
          {title}
          {titleIcon && <img src={titleIcon} alt={`${title} 아이콘`} />}
        </h4>
        <div className="inner-table__header-actions">
          {headerButton}
          {onBackClick && (
            <button
              type="button"
              className="inner-table__back-btn"
              onClick={onBackClick}
              aria-label="뒤로가기"
            >
              ←
            </button>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr className="column">
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.id || index}
                  onClick={() => onRowClick?.(row)}
                  style={onRowClick ? { cursor: "pointer" } : {}}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {totalItems !== undefined && (
            <StandardPagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}
    </section>
  );
};

