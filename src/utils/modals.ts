// moovy-frontend/src/utils/modals.ts
// 모달에 전달할 데이터 매핑/생성 유틸
// - 카드 클릭 데이터 → 모달 props 형태로 변환

import { formatDateDot } from './format'

export interface CommentDetailData {
   id: number // 코멘트 ID (대댓글 조회용) - 필수
   username: string
   date: string
   content: string
   likes: number
   replies: number
}

export interface MinimalCardData {
   id?: number // 원본 카드 데이터는 없을 수도 있음
   username?: string
   comment?: string
   title?: string
   likes?: number
   replies?: number
}

export function buildCommentDetailData(data: MinimalCardData): CommentDetailData {
   if (data.id == null) {
      throw new Error('CommentDetailData 생성 실패: id가 없습니다.')
   }

   return {
      id: data.id,
      username: data.username || '유저닉네임',
      date: formatDateDot(),
      content: data.comment || `${data.title ?? '콘텐츠'}에 대한 코멘트 상세입니다`,
      likes: data.likes ?? 0,
      replies: data.replies ?? 0,
   }
}
