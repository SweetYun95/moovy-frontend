// moovy-frontend/src/services/api/popularApi.ts
import moovy from "./http";

// 백엔드 응답 형태에 맞춰 타입 정의
export type PopularMovieContent = {
  content_id: number;
  tmdb_id: number;
  title: string;
  release_date: string | null;
  genre: string | null;
  time: number | null;
  age_limit: number | null;
  plot: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type PopularMovieItem = {
  rank: number;
  snapshot_date: string; // "2025-12-04"
  source: string; // "TMDB_TRENDING_DAILY"
  content: PopularMovieContent;
};

export type PopularMovieListResponse = {
  success: boolean;
  data: PopularMovieItem[];
};

export const getTodayPopularMovies = async (): Promise<PopularMovieItem[]> => {
  const res = await moovy.get<PopularMovieListResponse>(
    "/popular/movies/today",
  );
  if (!res.data.success) {
    throw new Error("인기 영화 조회 실패");
  }
  return res.data.data;
};

// 날짜별 조회도 쓸 거면
export const getPopularMoviesByDate = async (params: {
  date: string; // "2025-12-04"
  source?: string;
}): Promise<PopularMovieItem[]> => {
  const res = await moovy.get<PopularMovieListResponse>(
    "/popular/movies/by-date",
    { params },
  );
  if (!res.data.success) {
    throw new Error("인기 영화(특정 날짜) 조회 실패");
  }
  return res.data.data;
};
