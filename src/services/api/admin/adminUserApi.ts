// moovy-frontend/src/services/api/admin/adminUserApi.ts
import adminHttp from "./adminHttp";

/** 공통 타입 */
export type UserState = "ACTIVE" | "SUSPENDED" | "DELETED";
export type Provider = "google" | "kakao" | "email";

export type AdminUserSummary = {
  user_id: number;
  email: string;
  name: string;
  state: UserState;
  google?: 0 | 1;
  kakao?: 0 | 1;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type UserSanction = {
  id: number;
  user_id: number;
  admin_id: number;
  reason: string;
  start_at: string;
  end_at: string;
  created_at?: string;
  updated_at?: string;
};

export type AdminUserDetail = AdminUserSummary & {
  sanctions?: UserSanction[];
  // 필요한 경우 더 추가(닉네임, 통계 등)
};

export type ListParams = {
  page?: number;
  size?: number;
  search?: string;
  state?: UserState;
  provider?: Provider;
  sort?: "created_at" | "updated_at" | "name";
  order?: "ASC" | "DESC";
  // 확장: comment_min/max, content_min/max, warn_min/max ...
};

export type ListResponse<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

/** 목록 */
export async function fetchAdminUsers(params: ListParams = {}) {
  const { data } = await adminHttp.get<ListResponse<AdminUserSummary>>(
    "/users",
    { params },
  );
  return data;
}

/** 상세 */
export async function fetchAdminUserDetail(user_id: number) {
  const { data } = await adminHttp.get<AdminUserDetail>(`/users/${user_id}`);
  return data;
}

/** 제재 생성 */
export async function createSanction(
  user_id: number,
  payload: { end_at: string; reason: string; start_at?: string },
) {
  const { data } = await adminHttp.post<{
    message: string;
    sanction: UserSanction;
  }>(`/users/${user_id}/sanctions`, payload);
  return data;
}

/** 제재 수정(사유/기간/조기해제) */
export async function updateSanction(
  user_id: number,
  id: number,
  payload: { reason?: string; end_at?: string; early_release?: boolean },
) {
  const { data } = await adminHttp.patch<{
    message: string;
    sanction: UserSanction;
  }>(`/users/${user_id}/sanctions/${id}`, payload);
  return data;
}

/** 제재 삭제 */
export async function deleteSanction(user_id: number, id: number) {
  const { data } = await adminHttp.delete<{ message: string }>(
    `/users/${user_id}/sanctions/${id}`,
  );
  return data;
}

/** 강제탈퇴 */
export async function forceWithdrawal(user_id: number, reason: string) {
  const { data } = await adminHttp.post<{ message: string }>(
    `/users/${user_id}/force-withdrawal`,
    {
      reason,
      confirm: true,
    },
  );
  return data;
}
