// moovy-frontend/src/services/api/commentApi.ts
import moovy from './http'

export type CommentCard = {
  id: number
  username: string
  contentId?: number
  comment: string
  rating: number
  likes: number
  replies: number
}

/** 코멘트 카드 목록 조회 */
export async function getCommentCards() {
  const res = await moovy.get('/comment/list')
  return res.data as CommentCard[]
}

/** 코멘트 조회 */
export async function getComment(id: number) {
  const res = await moovy.get(`/comment/${id}`)
  return res.data as CommentCard
}

// 코멘트 생성/수정/삭제 타입
export type CreateCommentRequest = {
  content: string
  isSpoiler?: boolean
  rating?: number
  movieId?: number
}

export type UpdateCommentRequest = {
  content: string
  isSpoiler?: boolean
}

/** 코멘트 생성 */
export async function createComment(data: CreateCommentRequest) {
  const res = await moovy.post('/comment', data)
  return res.data
}

/** 코멘트 수정 */
export async function updateComment(id: number, data: UpdateCommentRequest) {
  const res = await moovy.put(`/comment/${id}`, data)
  return res.data
}

/** 코멘트 삭제 */
export async function deleteComment(id: number) {
  const res = await moovy.delete(`/comment/${id}`)
  return res.data
}

// ===== 신고 API =====

export type ReportCategory = 'spam' | 'abuse' | 'inappropriate' | 'copyright' | 'other'

export type CreateReportRequest = {
  category: ReportCategory
  targetType: 'user' | 'comment' | 'content'
  targetId: number
  reason?: string
}

/** 신고 생성 */
export async function createReport(data: CreateReportRequest) {
  const res = await moovy.post('/report', data)
  return res.data
}

