import React from "react";
import { UserManagementFilter, WorkManagementFilter } from "./AdminFilter";
import { StandardPagination } from "../common/Pagination";
import { AdminTabs } from "../common/Tabs";
import Avatar from "../../assets/Avatar.png";
import Topic from "../../assets/topic.svg";
import Toggle from "../common/Toggle/Toggle";
import { ActionButton, StatusButton } from "../common/Button/Button";
interface TableProps {
  content: "dashboard" | "user" | "topic" | "inquiry" | "report";
}

const Table: React.FC<TableProps> = ({ content }) => {
  switch (content) {
    case "dashboard":
      return (
        <div className="admin-content">
          <div className="chart">차트 자리</div>
        </div>
      );

    case "user":
      return (
        <div className="admin-content">
          <UserManagementFilter />
          <table className="table user-table">
            <thead>
              <tr>
                <th>check</th>
                <th>유저</th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>코멘트</th>
                <th>댓글</th>
                <th>관리자 경고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <img src={Avatar} alt="user profile" />
                  Natali Craig
                </td>
                <td>Meadow Lane</td>
                <td>meadow@lane.com</td>
                <td>32</td>
                <td>23</td>
                <td>1회</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>Kate Morrison</td>
                <td>Bagwell Avenue</td>
                <td>bagwell@ocala.com</td>
                <td>0</td>
                <td>0</td>
                <td>없음</td>
              </tr>
            </tbody>
          </table>
          <StandardPagination />
          <div className="button">
            <ActionButton action="edit" />
          </div>
        </div>
      );

    case "topic":
      return (
        <div className="admin-content">
          <AdminTabs />
          <WorkManagementFilter />
          <table className="table topic-table">
            <thead>
              <tr>
                <th>작품 제목</th>
                <th>작품 정보</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src={Topic} alt="topic icon" />
                  Natali Craig
                </td>
                <td>Meadow Lane Oakland</td>
                <td>2025.10.01</td>
                <td>2025.10.08</td>
                <td>3420</td>
              </tr>
              <tr>
                <td>
                  <img src={Topic} alt="topic icon" />
                  Kate Morrison
                </td>
                <td>Bagwell Avenue Ocala</td>
                <td>2025.10.01</td>
                <td>2025.10.08</td>
                <td>6737</td>
              </tr>
              <tr>
                <td>
                  <img src={Topic} alt="topic icon" />
                  Kate Morrison
                </td>
                <td>Bagwell Avenue Ocala</td>
                <td>2025.10.01</td>
                <td>2025.10.08</td>
                <td>6737</td>
              </tr>
            </tbody>
          </table>
          <StandardPagination />
        </div>
      );

    case "inquiry":
      return (
        <div className="admin-content">
          <UserManagementFilter />
          <table className="table inquiry-table">
            <thead>
              <tr>
                <th>check</th>
                <th>유저</th>
                <th>분류</th>
                <th>내용</th>
                <th>작성일</th>
                <th>처리 상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <img src={Avatar} alt="" />
                  Natali Craig
                </td>
                <td>분류내용</td>
                <td>내용입니다.</td>
                <td>2025.10.08</td>
                <td>미완료</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <img src={Avatar} alt="" />
                  Natali Craig
                </td>
                <td>분류내용</td>
                <td>내용입니다.</td>
                <td>2025.10.08</td>
                <td>답변완료</td>
              </tr>
            </tbody>
          </table>
          <StandardPagination />
          <div className="button">
            <ActionButton text="답변하기" />
          </div>
        </div>
      );

    case "report":
      return (
        <div className="admin-content">
          <table className="table report-table">
            <thead>
              <tr>
                <th>check</th>
                <th>유저</th>
                <th>신고한 유저</th>
                <th>분류</th>
                <th>내용</th>
                <th>작성일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <img src={Avatar} alt="user profile" />
                  Natali Craig
                </td>
                <td>
                  <img src={Avatar} alt="user profile" />
                  Natali Craig
                </td>
                <td>신고내역</td>
                <td>댓글...</td>
                <td>2025.10.08</td>
                <td>
                  <a href="#">확인하기</a>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <img src={Avatar} alt="" />
                  Natali Craig
                </td>
                <td>
                  <img src={Avatar} alt="user profile" />
                  Natali Craig
                </td>
                <td>신고내역</td>
                <td>댓글...</td>
                <td>2025.10.08</td>
                <td>처리완료</td>
              </tr>
            </tbody>
          </table>
          <StandardPagination />
          <div className="button">
            <ActionButton action="confirm" />
          </div>
        </div>
      );

    default:
      return <div>데이터가 없습니다</div>;
  }
};

export default Table;
