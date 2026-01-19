// src/components/profile/CommentHistorySection.tsx
import { useMemo } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { formatDateDot } from "@/utils/format";
import type { CommentItem } from "@/features/comments/commentSlice";

export const CommentHistorySection: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // 모든 토픽의 코멘트를 가져와서 사용자 코멘트만 필터링
  const allComments = useAppSelector((state) => state.comments.byTopicId);
  
  const userComments = useMemo(() => {
    if (!user) return [];
    
    const userId = parseInt(user.user_id, 10);
    const comments: (CommentItem & { topicId: number })[] = [];
    
    // 모든 토픽의 코멘트를 순회하며 사용자 코멘트만 추출
    Object.entries(allComments).forEach(([topicId, bucket]) => {
      bucket.items.forEach((comment) => {
        if (comment.user_id === userId) {
          comments.push({ ...comment, topicId: parseInt(topicId, 10) });
        }
      });
    });
    
    // 최신순 정렬
    return comments.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [allComments, user]);

  const handleCommentClick = (topicId: number) => {
    navigate(PATHS.contentDetail(topicId));
  };

  return (
  <div className="row mt-5">
      <div className="col-12">
        <h4>코멘트 내역</h4>
        {userComments.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">작성한 코멘트가 없습니다.</p>
          </div>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>작품</th>
                  <th>내용</th>
                  <th>별점</th>
                  <th>좋아요</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {userComments.map((comment, index) => (
                  <tr
                    key={comment.comment_id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCommentClick(comment.topicId)}
                  >
                    <td>{userComments.length - index}</td>
                    <td>작품 ID: {comment.topicId}</td>
                    <td>
                      <div
                        style={{
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {comment.content}
                      </div>
                    </td>
                    <td>{comment.rating ? `⭐ ${comment.rating}` : "-"}</td>
                    <td>{comment.likes || 0}</td>
                    <td>
                      {comment.created_at
                        ? formatDateDot(new Date(comment.created_at))
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  </div>
);
};
