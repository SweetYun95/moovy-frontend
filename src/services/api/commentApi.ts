// moovy-frontend/src/services/api/commentApi.ts
import moovy from "./http";

// ─────────────────────────────────────────────────────────────
// Legacy (홈/카드용) API
// ─────────────────────────────────────────────────────────────

export type CommentCard = {
  id: number;
  username: string;
  contentId?: number;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
};

/** 코멘트 카드 목록 조회 */
export async function getCommentCards() {
  const res = await moovy.get("/comment/list");
  return res.data as CommentCard[];
}

/** 코멘트 단건 조회 */
export async function getComment(id: number) {
  const res = await moovy.get(`/comment/${id}`);
  return res.data as CommentCard;
}

// 코멘트 생성/수정/삭제 타입 (Legacy)
export type CreateCommentRequest = {
  content: string;
  isSpoiler?: boolean;
  rating?: number;
  movieId?: number;
};

export type UpdateCommentRequest = {
  content: string;
  isSpoiler?: boolean;
};

/** 코멘트 생성 (Legacy) */
export async function createComment(data: CreateCommentRequest) {
  const res = await moovy.post("/comment", data);
  return res.data;
}

/** 코멘트 수정 (Legacy) */
export async function updateComment(id: number, data: UpdateCommentRequest) {
  const res = await moovy.put(`/comment/${id}`, data);
  return res.data;
}

/** 코멘트 삭제 (Legacy) */
export async function deleteComment(id: number) {
  const res = await moovy.delete(`/comment/${id}`);
  return res.data;
}

// ─────────────────────────────────────────────────────────────
// Report API (Legacy)
// ─────────────────────────────────────────────────────────────

export type ReportCategory =
  | "spam"
  | "abuse"
  | "inappropriate"
  | "copyright"
  | "other";

export type CreateReportRequest = {
  category: ReportCategory;
  targetType: "user" | "comment" | "content";
  targetId: number;
  reason?: string;
};

/** 신고 생성 */
export async function createReport(data: CreateReportRequest) {
  const res = await moovy.post("/report", data);
  return res.data;
}

// ─────────────────────────────────────────────────────────────
// New REST API (/api/comments/*)  — 무한 스크롤(page/limit)
// ─────────────────────────────────────────────────────────────

export type CommentAuthor = {
  user_id: number;
  name: string;
};

export type CommentEntity = {
  comment_id: number;
  topic_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  User?: CommentAuthor; // include(User)
  user?: CommentAuthor; // 혹시 소문자 키로 올 수도 있어 방어
};

export type FetchCommentsParams = {
  page?: number;
  limit?: number;
};

/**
 * 코멘트 목록 조회 (특정 토픽 기준) - 무한 스크롤
 * GET /api/comments/:topic_id?page=&limit=
 * 응답: CommentEntity[]
 */
export async function fetchComments(
  topic_id: number,
  params?: FetchCommentsParams,
) {
  const { data } = await moovy.get(`/api/comments/${topic_id}`, { params });
  return data as CommentEntity[];
}

/** 코멘트 작성 */
export async function createCommentV2(payload: {
  topic_id: number;
  content: string;
}) {
  const { data } = await moovy.post("/api/comments", payload);
  return data as CommentEntity;
}

/** 코멘트 수정 */
export async function updateCommentV2(
  comment_id: number,
  payload: { content: string },
) {
  const { data } = await moovy.put(`/api/comments/${comment_id}`, payload);
  return data as { message: string; comment: CommentEntity };
}

/** 코멘트 삭제 */
export async function deleteCommentV2(comment_id: number) {
  const { data } = await moovy.delete(`/api/comments/${comment_id}`);
  return data as { message: string };
}
