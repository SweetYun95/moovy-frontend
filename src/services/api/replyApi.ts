// moovy-frontend/src/services/api/replyApi.ts
import moovy from './http'

const base = '/api/replies'

// 대댓글 작성
export const createReply = async (payload: { comment_id: number; content: string }) => {
   const res = await moovy.post(base, payload)
   return res.data
}

// 대댓글 목록 조회 (특정 코멘트 기준)
export const fetchReplies = async (comment_id: number, params?: { page?: number; size?: number }) => {
   const res = await moovy.get(`${base}/${comment_id}`, { params })
   return res.data
}

// 대댓글 수정
export const updateReply = async (reply_id: number, payload: { content: string }) => {
   const res = await moovy.put(`${base}/${reply_id}`, payload)
   return res.data
}

// 대댓글 삭제
export const deleteReply = async (reply_id: number) => {
   const res = await moovy.delete(`${base}/${reply_id}`)
   return res.data
}
