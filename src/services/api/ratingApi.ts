// moovy-frontend/src/services/api/ratingApi.ts
import moovy from "./http";

export type RatingSummary = {
  content_id: number;
  count: number;
  avg: number;
  myPoint: number | null;
};

export type UpsertResponse = RatingSummary & { created: boolean };
export type DeleteResponse = RatingSummary & { removed: boolean };

export async function getRatingSummary(contentId: number) {
  const res = await moovy.get<RatingSummary>(
    `/ratings/contents/${contentId}/rating`,
  );
  return res.data;
}

export async function upsertRating(contentId: number, point: number) {
  const res = await moovy.post<UpsertResponse>("/ratings", {
    content_id: contentId,
    point,
  });
  return res.data;
}

export async function deleteMyRating(contentId: number) {
  const res = await moovy.delete<DeleteResponse>(`/ratings/${contentId}`);
  return res.data;
}
