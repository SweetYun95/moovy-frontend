// moovy-frontend/src/services/api/admin/tmdbApi.ts
import adminHttp from './adminHttp'

/** TMDB 검색 결과 아이템 */
export type TmdbMovieItem = {
   tmdb_id: number
   title: string
   original_title?: string
   release_date?: string | null
   poster_path?: string | null
   backdrop_path?: string | null
   overview?: string | null
}

/** TMDB 검색 응답 */
export type TmdbSearchResponse = {
   items: TmdbMovieItem[]
   page: number
   totalPages: number
}

/** TMDB 상세 응답 */
export type TmdbMovieDetail = TmdbMovieItem & {
   genres?: { id: number; name: string }[]
   runtime?: number | null
   vote_average?: number
}

/**
 * GET /api/admin/tmdb/search?q=keyword&page=1
 */
export async function searchTmdbMovies(params: { q: string; page?: number }) {
   const { data } = await adminHttp.get('/tmdb/search', { params })
   return data?.data as TmdbSearchResponse
}

/**
 * GET /api/admin/tmdb/movies/:tmdb_id
 */
export async function getTmdbMovieDetail(tmdb_id: number) {
   const { data } = await adminHttp.get(`/tmdb/movies/${tmdb_id}`)
   return data?.data as TmdbMovieDetail
}
