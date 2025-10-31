// 모달에 전달할 데이터 매핑/생성 유틸
// - 카드 클릭 데이터 → 모달 props 형태로 변환
import { formatDateDot } from './format';

export interface CommentDetailData {
  username: string;
  date: string;
  content: string;
  likes: number;
  replies: number;
}

export interface MinimalCardData {
  username?: string;
  comment?: string;
  title?: string;
  likes?: number;
  replies?: number;
}

export function buildCommentDetailData(data: MinimalCardData): CommentDetailData {
  // 제공된 최소 데이터에서 안전한 기본값을 채워 모달 데이터 구성
  return {
    username: data.username || '유저닉네임',
    date: formatDateDot(),
    content: data.comment || `${data.title ?? '콘텐츠'}에 대한 코멘트 상세입니다`,
    likes: data.likes ?? 0,
    replies: data.replies ?? 0,
  };
}


