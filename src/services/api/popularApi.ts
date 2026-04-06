// moovy-frontend/src/services/api/popularApi.ts
import moovy from './http'

// 백엔드 응답 형태에 맞춰 타입 정의
export type PopularMovieContent = {
   content_id: number
   tmdb_id: number
   title: string
   release_date: string | null
   genre: string | null
   time: number | null
   age_limit: number | null
   plot: string | null
   poster_path: string | null
   backdrop_path: string | null
}

export type PopularMovieItem = {
   rank: number
   snapshot_date: string
   source: string
   content: PopularMovieContent
}

export type PopularMovieListResponse = {
   success: boolean
   data: PopularMovieItem[]
}

export const getTodayPopularMovies = async (): Promise<PopularMovieItem[]> => {
   const res = await moovy.get<PopularMovieListResponse>('/api/popular/movies/today')
   if (!res.data.success) {
      throw new Error('인기 영화 조회 실패')
   }
   return res.data.data
}

export const getPopularMoviesByDate = async (params: { date: string; source?: string }): Promise<PopularMovieItem[]> => {
   const res = await moovy.get<PopularMovieListResponse>('/api/popular/movies/by-date', { params })
   if (!res.data.success) {
      throw new Error('인기 영화(특정 날짜) 조회 실패')
   }
   return res.data.data
}

/** 현재 상영작 조회 (moovy-pipeline에서 수집한 데이터) */
export const getNowPlayingMovies = async (): Promise<PopularMovieItem[]> => {
   const res = await moovy.get<PopularMovieListResponse>('/api/popular/movies/now-playing')
   if (!res.data.success) {
      throw new Error('현재 상영작 조회 실패')
   }
   return res.data.data
}
