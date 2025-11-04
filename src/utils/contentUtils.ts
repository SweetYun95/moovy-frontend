// 내부 유틸/전역/서비스
import type { CommentItem, CommentCard } from '@/features/comments/commentSlice';

/**
 * 코멘트에서 사용자 이름을 안전하게 추출
 * @param comment - 코멘트 아이템
 * @returns 사용자 이름 또는 기본값
 */
export function getCommentUsername(comment: CommentItem): string {
  return comment.User?.name || comment.user?.name || `User ${comment.user_id}`;
}

/**
 * CommentItem을 CommentCard 형식으로 변환
 * @param item - CommentItem 타입의 코멘트
 * @returns CommentCard 타입의 코멘트
 */
export function convertCommentItemToCard(item: CommentItem): CommentCard {
  return {
    id: item.comment_id,
    username: getCommentUsername(item),
    contentId: item.topic_id,
    comment: item.content,
    rating: item.rating ?? 0, // CommentItem의 rating 사용
    likes: item.likes ?? 0,
    replies: item.replies ?? 0,
    created_at: item.created_at,
  };
}

