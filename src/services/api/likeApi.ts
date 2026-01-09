// moovy-frontend/src/services/api/likeApi.ts
import moovy from './http'

const base = '/api/likes'

/* =========================
 * Comment Like
 * ========================= */

// 댓글 좋아요 토글
export const toggleCommentLike = async (comment_id: number) => {
   const res = await moovy.post(`${base}/comments/${comment_id}/toggle`)
   return res.data as { liked: boolean }
}

// 댓글 좋아요 개수
export const fetchCommentLikeCount = async (comment_id: number) => {
   const res = await moovy.get(`${base}/comments/${comment_id}/count`)
   return res.data as { count: number }
}

// 내가 이 댓글에 좋아요 했는지
export const checkCommentLike = async (comment_id: number) => {
   const res = await moovy.get(`${base}/comments/${comment_id}/check`)
   return res.data as { liked: boolean }
}

/* =========================
 * Reply Like
 * ========================= */

// 대댓글 좋아요 토글
export const toggleReplyLike = async (reply_id: number) => {
   const res = await moovy.post(`${base}/replies/${reply_id}/toggle`)
   return res.data as { liked: boolean }
}

// 대댓글 좋아요 개수
export const fetchReplyLikeCount = async (reply_id: number) => {
   const res = await moovy.get(`${base}/replies/${reply_id}/count`)
   return res.data as { count: number }
}

// 내가 이 대댓글에 좋아요 했는지
export const checkReplyLike = async (reply_id: number) => {
   const res = await moovy.get(`${base}/replies/${reply_id}/check`)
   return res.data as { liked: boolean }
}
