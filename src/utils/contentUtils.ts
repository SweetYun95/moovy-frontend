// 내부 유틸/전역/서비스
import type { CommentItem } from '@/features/comments/commentSlice';

/**
 * 코멘트에서 사용자 이름을 안전하게 추출
 * @param comment - 코멘트 아이템
 * @returns 사용자 이름 또는 기본값
 */
export function getCommentUsername(comment: CommentItem): string {
  return comment.User?.name || comment.user?.name || `User ${comment.user_id}`;
}

