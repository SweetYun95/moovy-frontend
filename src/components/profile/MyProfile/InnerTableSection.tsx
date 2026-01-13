// moovy-frontend/src/components/profile/MyProfile/InnerTableSection.tsx

import React, { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import type { InnerTabType } from "./ProfileTab";
import { ProfileTable, type TableColumn } from "../ProfileTable";
import { CommentDetailModal } from "@/components/modals/CommentDetailModal/CommentDetailModal";
import { selectAllComments } from "@/features/comments/commentSlice";
import { selectRepliesByComment, selectRepliesState } from "@/features/reply/replySlice";
import { fetchFavorites, selectFavorites } from "@/features/favorite/favoriteSlice";
import { selectContents } from "@/features/content/contentSlice";
import { formatDateDot } from "@/utils/format";

import BookmarkIcon from "../../../assets/bookmarkIcon.svg";
import CommentIcon from "../../../assets/commentIcon.svg";
import LikesIcon from "../../../assets/likesIcon.svg";
import SpeechIcon from "../../../assets/speechIcon.svg";

interface TableRow {
  id: number;
  title: string;
  date: string;
  comment: string;
  commentId?: number; // 코멘트 ID (모달 연결용)
  contentId?: number; // 작품 ID
}

interface InnerTableSectionProps {
  innerTab: InnerTabType;
  onBackClick?: () => void;
}

export const InnerTableSection: React.FC<InnerTableSectionProps> = ({
  innerTab,
  onBackClick,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    id: number;
    username: string;
    date: string;
    content: string;
    likes: number;
    replies: number;
    profileImageUrl?: string;
  } | null>(null);

  // 데이터 가져오기
  const allComments = useAppSelector(selectAllComments);
  const favorites = useAppSelector(selectFavorites);
  const contents = useAppSelector(selectContents);
  const repliesState = useAppSelector(selectRepliesState);

  // 보관한 영화 데이터 로드
  useEffect(() => {
    if (innerTab === "bookmarks") {
      dispatch(fetchFavorites({ page: 1, limit: 100 }));
    }
  }, [innerTab, dispatch]);

  const userId = user ? parseInt(user.user_id, 10) : 0;

  // 탭별 데이터 필터링
  const tableData = useMemo(() => {
    if (!userId) return [];

    switch (innerTab) {
      case "likes":
        // 좋아요한 댓글 - 현재 API가 없으므로 목업 데이터 사용
        return Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          title: `작품 ${i + 1}`,
          date: formatDateDot(new Date()),
          comment: [
            "진짜 너무 좋은 영화 ㅠㅠ",
            "절대 보지 마세요 ㅡㅡ",
            "굳굳",
            "눈 버렸음 ;;;",
          ][i % 4],
          commentId: i + 1,
        }));

      case "replies":
        // 내가 작성한 댓글 (replies)
        const userReplies: TableRow[] = [];
        Object.values(repliesState.byCommentId).forEach((bucket) => {
          bucket.items.forEach((reply) => {
            if (reply.user_id === userId) {
              const content = contents.find((c) => c.id === reply.comment_id);
              userReplies.push({
                id: reply.reply_id,
                title: content?.title || `작품 ID: ${reply.comment_id}`,
                date: reply.created_at
                  ? formatDateDot(new Date(reply.created_at))
                  : formatDateDot(new Date()),
                comment: reply.content,
                commentId: reply.comment_id,
                contentId: content?.id,
              });
            }
          });
        });
        return userReplies.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

      case "bookmarks":
        // 보관한 영화
        return favorites.map((favorite, index) => ({
          id: favorite.content_id,
          title: favorite.title,
          date: favorite.favorited_at
            ? formatDateDot(new Date(favorite.favorited_at))
            : formatDateDot(new Date()),
          comment: "",
          contentId: favorite.content_id,
        }));

      case "comments":
        // 내가 작성한 코멘트
        const userComments = allComments
          .filter((comment) => comment.user_id === userId)
          .map((comment) => {
            const content = contents.find((c) => c.id === comment.topic_id);
            return {
              id: comment.comment_id,
              title: content?.title || `작품 ID: ${comment.topic_id}`,
              date: comment.created_at
                ? formatDateDot(new Date(comment.created_at))
                : formatDateDot(new Date()),
              comment: comment.content,
              commentId: comment.comment_id,
              contentId: content?.id,
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
        return userComments;

      default:
        return [];
    }
  }, [innerTab, userId, allComments, favorites, contents, repliesState]);

  // 탭별 제목 / 아이콘 매핑
  const tabConfig = {
    likes: { title: "좋아요", icon: LikesIcon },
    bookmarks: { title: "보관함", icon: BookmarkIcon },
    replies: { title: "댓글함", icon: SpeechIcon },
    comments: { title: "코멘트", icon: CommentIcon },
  } as const;

  if (!innerTab) {
    return null;
  }

  const { title, icon } = tabConfig[innerTab] || { title: "", icon: "" };

  const handleRowClick = (row: TableRow) => {
    if (row.commentId) {
      // 실제로는 API에서 코멘트 상세 정보를 가져와야 함
      // 여기서는 더미 데이터로 설정
      setSelectedComment({
        id: row.commentId,
        username: "사용자",
        date: row.date,
        content: row.comment,
        likes: 0,
        replies: 0,
      });
      setIsCommentModalOpen(true);
    }
  };

  const columns: TableColumn[] = [
    { key: "id", label: "No" },
    { key: "title", label: "작품" },
    { key: "date", label: "날짜" },
    { key: "comment", label: "좋아요한 댓글" },
  ];

  return (
    <>
      <ProfileTable
        title={title}
        titleIcon={icon}
        columns={columns}
        data={tableData}
        onBackClick={onBackClick}
        onRowClick={handleRowClick}
        totalItems={tableData.length}
        itemsPerPage={10}
      />

      {selectedComment && (
        <CommentDetailModal
          isOpen={isCommentModalOpen}
          onClose={() => {
            setIsCommentModalOpen(false);
            setSelectedComment(null);
          }}
          commentData={selectedComment}
        />
      )}
    </>
  );
};
