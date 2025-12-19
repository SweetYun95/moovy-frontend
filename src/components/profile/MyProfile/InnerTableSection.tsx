// moovy-frontend/src/components/profile/MyProfile/InnerTableSection.tsx

import React, { useState } from "react";

import type { InnerTabType } from "./ProfileTab";
import { StandardPagination } from "../../common/Pagination/PaginationComponents";

import BookmarkIcon from "../../../assets/bookmarkIcon.svg";
import CommentIcon from "../../../assets/commentIcon.svg";
import LikesIcon from "../../../assets/likesIcon.svg";
import SpeechIcon from "../../../assets/speechIcon.svg";

interface TableRow {
  id: number;
  title: string;
  date: string;
  comment: string;
}
interface InnerTableSectionProps {
  innerTab: InnerTabType;
}
export const InnerTableSection: React.FC<InnerTableSectionProps> = ({
  innerTab,
}) => {
  // 탭별 데이터 (실제로는 API로 불러오면 됨)
  const dummyData: TableRow[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `작품 ${i + 1}`,
    date: "2025.10.13",
    comment: [
      "진짜 너무 좋은 영화 ㅠㅠ",
      "절대 보지 마세요 ㅡㅡ",
      "굳굳",
      "눈 버렸음 ;;;",
    ][i % 4],
  }));

  // 탭별 제목 / 아이콘 매핑
  const tabConfig = {
    likes: { title: "좋아요", icon: LikesIcon },
    bookmarks: { title: "보관함", icon: BookmarkIcon },
    replies: { title: "댓글함", icon: SpeechIcon },
    comments: { title: "코멘트", icon: CommentIcon },
  } as const;

  const { title, icon } = tabConfig[innerTab] || { title: "", icon: "" };

  console.log("아이콘: ", tabConfig, title, icon);
  return (
    <section className="inner-table">
      <div className="inner-table__header">
        <h4>
          {title} <img src={icon} alt={`${title} 아이콘`} />
        </h4>
      </div>

      {/* 테이블 영역*/}
      <table className="table">
        <thead>
          <tr className="column">
            <th>No</th>
            <th>작품</th>
            <th>날짜</th>
            <th>좋아요한 댓글</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <StandardPagination />
    </section>
  );
};
