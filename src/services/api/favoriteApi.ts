// moovy-frontend/src/services/api/favoriteApi.ts
import moovy from "./http";

export type FavoriteItem = {
  content_id: number;
  title: string;
  favorited_at: string; // ISO string
  poster: string | null;
};

export type FavoriteListResponse = {
  page: number;
  limit: number;
  total: number;
  items: FavoriteItem[];
};

/** 내 찜 목록 조회 (최신순) */
export async function getFavorites(params?: { page?: number; limit?: number }) {
  const res = await moovy.get<FavoriteListResponse>("/favorites", { params });
  return res.data;
}

/** 찜 토글 (추가/삭제) → { isFavorite } */
export async function toggleFavorite(contentId: number) {
  const res = await moovy.post<{ isFavorite: boolean }>(
    `/favorites/${contentId}/toggle`,
  );
  return res.data;
}

/** 단건 체크 → { isFavorite } */
export async function checkFavorite(contentId: number) {
  const res = await moovy.get<{ isFavorite: boolean }>(
    `/favorites/${contentId}/check`,
  );
  return res.data;
}

/** 찜 취소 (멱등 아님: 존재하지 않아도 204일 수 있음) */
export async function removeFavorite(contentId: number) {
  await moovy.delete(`/favorites/${contentId}`);
}
