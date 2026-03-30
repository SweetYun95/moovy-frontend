// moovy-frontend/src/services/api/topicApi.ts
import moovy from './http'
import adminHttp from './admin/adminHttp'

/**
 * ✅ 프론트 도메인 Topic 타입(기존 유지)
 * - topicSlice / UI가 이미 이 형태를 기대하고 있으니,
 *   백엔드 응답(Topic + VideoContent)을 여기서 "매핑"해서 맞춘다.
 */
export type Topic = {
   id: number
   images: string[]
   title: string
   englishTitle?: string
   runtime: string
   ageRating: 'all' | '12' | '15' | '18'
   synopsis: string
   releaseDate: string
   genre: string
   category?: string
   country?: string
   year?: string
   imageUrl?: string
   overallRating?: number
   createdAt: string
   updatedAt: string
}

export type TopicList = {
   list: Topic[]
   total: number
}

/**
 * ✅ 백엔드 퍼블릭 Topic 응답 타입
 * - GET /api/topics 응답: { page, limit, total, items }
 * - items는 Topic 모델 + include(VideoContent)
 */
type PublicTopicRow = {
   topic_id: number
   content_id: number
   is_admin_recommended: boolean
   start_at: string
   end_at: string
   created_at: string
   updated_at: string
   deleted_at?: string | null
   VideoContent?: {
      content_id: number
      tmdb_id: number
      title: string
      release_date: string | null
      poster_path: string | null
      backdrop_path: string | null
      views: number
      plot?: string | null
      genre?: string | null
      time?: number | null
      age_limit?: number | null
   } | null
}

type PublicTopicsResponse = {
   page: number
   limit: number
   total: number
   items: PublicTopicRow[]
}

/**
 * 백엔드 age_limit(숫자)을 프론트 ageRating('all'|'12'|'15'|'18')로 매핑
 */
function mapAgeLimit(ageLimit?: number | null): Topic['ageRating'] {
   if (!ageLimit || ageLimit <= 0) return 'all'
   if (ageLimit < 12) return 'all'
   if (ageLimit < 15) return '12'
   if (ageLimit < 18) return '15'
   return '18'
}

/**
 * time(분)을 프론트 runtime(string)으로 매핑
 */
function mapRuntime(time?: number | null): string {
   if (!time || time <= 0) return ''
   return `${time}분`
}

/**
 * release_date → releaseDate(문자열) + year
 */
function mapRelease(releaseDate?: string | null): { releaseDate: string; year?: string } {
   if (!releaseDate) return { releaseDate: '' }
   const year = releaseDate.slice(0, 4)
   return { releaseDate, year }
}

/**
 * PublicTopicRow → 프론트 Topic 도메인으로 변환
 */
function mapPublicTopicToTopic(row: PublicTopicRow): Topic {
   const v = row.VideoContent ?? null

   const title = v?.title ?? ''
   const synopsis = (v?.plot ?? '') || ''
   const genre = (v?.genre ?? '') || ''

   const { releaseDate, year } = mapRelease(v?.release_date ?? null)
   const runtime = mapRuntime(v?.time ?? null)
   const ageRating = mapAgeLimit(v?.age_limit ?? null)

   const images = [v?.poster_path, v?.backdrop_path].filter(Boolean) as string[]
   const imageUrl = images[0]

   const createdAt = row.created_at ?? ''
   const updatedAt = row.updated_at ?? ''

   return {
      id: row.topic_id,
      images,
      title,
      runtime,
      ageRating,
      synopsis,
      releaseDate,
      genre,
      year,
      imageUrl,
      createdAt,
      updatedAt,
   }
}

/** --------------------------------
 * ✅ 퍼블릭 토픽 API
 * --------------------------------*/

/** 토픽 목록 조회 (퍼블릭) */
export async function getTopics(params?: { main?: 'current' | 'past' | 'all'; page?: number; limit?: number }) {
   const res = await moovy.get('/topics', { params })
   const data = res.data as PublicTopicsResponse

   return {
      list: (data.items ?? []).map(mapPublicTopicToTopic),
      total: data.total ?? 0,
   } as TopicList
}

/** 토픽 조회 (퍼블릭 단건) */
export async function getTopic(id: number) {
   const res = await moovy.get(`/topics/${id}`)

   const row = res.data as PublicTopicRow & {
      comment_count?: number
      is_active?: boolean
   }

   return mapPublicTopicToTopic(row)
}

/** --------------------------------
 * 관리자 토픽 목록 조회
 * --------------------------------*/
export async function getAdminTopics(params?: { main?: 'current' | 'past'; filter?: 'all' | 'popular' | 'showing' | 'recommended'; page?: number; size?: number; sort?: string; order?: 'ASC' | 'DESC' }) {
   const res = await adminHttp.get('/topics', { params })
   return res.data as {
      success: boolean
      data: {
         items: Array<{
            topic_id: number
            content_id: number
            start_at: string
            end_at: string
            is_admin_recommended: boolean
            video: {
               content_id: number
               tmdb_id: number
               title: string
               synopsis: string
               poster_path: string | null
               backdrop_path: string | null
               views: number
               genre: string | null
               release_date: string | null
            } | null
         }>
         page: number
         size: number
         total: number
      }
   }
}

/** --------------------------------
 * 아래 레거시 CRUD는 "현재 퍼블릭 토픽 설계"랑 안 맞아서 일단 유지
 * --------------------------------*/

export type CreateTopicRequest = {
   images: string[]
   title: string
   runtime: string
   ageRating: string
   synopsis: string
   releaseDate: {
      year: string
      month: string
      day: string
   }
   genre: string
   category?: string
   country?: string
}

export type UpdateTopicRequest = {
   images?: string[]
   title?: string
   runtime?: string
   ageRating?: string
   synopsis?: string
   releaseDate?: {
      year: string
      month: string
      day: string
   }
   genre?: string
   category?: string
   country?: string
}

/** (레거시) 토픽 생성 */
export async function createTopic(data: CreateTopicRequest) {
   const res = await moovy.post('/topic', data)
   return res.data as Topic
}

/** (레거시) 토픽 수정 */
export async function updateTopic(id: number, data: UpdateTopicRequest) {
   const res = await moovy.put(`/topic/${id}`, data)
   return res.data as Topic
}

/** (레거시) 토픽 삭제 */
export async function deleteTopic(id: number) {
   const res = await moovy.delete(`/topic/${id}`)
   return res.data
}

/** 토픽 삭제 (관리자용) */
export async function deleteAdminTopic(id: number) {
   const res = await adminHttp.delete(`/topics/${id}`)
   return res.data as {
      success: boolean
      data: {
         topic_id: number
      }
   }
}

/** (레거시) 토픽 이미지 업로드 */
export async function uploadTopicImages(files: File[]) {
   const formData = new FormData()
   files.forEach((file) => {
      formData.append('images', file)
   })
   const res = await moovy.post('/topic/images', formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   })
   return res.data as { imageUrls: string[] }
}

/** TMDB 영화 검색 (관리자) */
export async function searchTmdbMovies(query: string, page: number = 1) {
   const res = await adminHttp.get('/tmdb/search', {
      params: { q: query, page },
   })
   return res.data as {
      success: boolean
      data: {
         page: number
         total_pages: number
         total_results: number
         results: Array<{
            id: number
            title: string
            original_title: string
            overview: string
            release_date: string
            poster_path: string | null
            backdrop_path: string | null
            genre_ids: number[]
            popularity: number
            vote_average: number
            vote_count: number
         }>
      }
   }
}

/** TMDB 영화 상세 정보 조회 (관리자) */
export async function getTmdbMovieDetails(tmdbId: number) {
   const res = await adminHttp.get(`/tmdb/movies/${tmdbId}`)
   return res.data as {
      success: boolean
      data: {
         id: number
         title: string
         original_title: string
         overview: string
         release_date: string
         poster_path: string | null
         backdrop_path: string | null
         genres: Array<{ id: number; name: string }>
         runtime: number
         vote_average: number
         vote_count: number
         popularity: number
      }
   }
}

/** 전체 인기작 스냅샷 조회 (관리자) */
export async function getPopularSnapshot(params?: { source?: string; date?: string; limit?: number }) {
   const res = await adminHttp.get('/topics/popular', { params })
   return res.data as {
      success: boolean
      data: {
         snapshot_date: string
         source: string
         items: Array<{
            rank: number
            content: {
               content_id: number
               tmdb_id: number
               title: string
               plot: string
               poster_path: string | null
               backdrop_path: string | null
               release_date: string | null
               genre: string | null
               views: number
            } | null
         }>
      }
   }
}

/** 현재 상영작 스냅샷 조회 (관리자) */
export async function getNowPlayingSnapshot(params?: { date?: string; limit?: number }) {
   const res = await adminHttp.get('/topics/now-playing', { params })
   return res.data as {
      success: boolean
      data: {
         snapshot_date: string
         source: string
         items: Array<{
            rank: number
            content: {
               content_id: number
               tmdb_id: number
               title: string
               plot: string
               poster_path: string | null
               backdrop_path: string | null
               release_date: string | null
               genre: string | null
               views: number
            } | null
         }>
      }
   }
}

/** 관리자 토픽 생성 (새로운 형식) */
export async function createAdminTopic(data: { tmdb_id?: number; content_id?: number; start_at: string; end_at: string; is_admin_recommended?: boolean }) {
   const res = await adminHttp.post('/topics', data)
   return res.data as {
      success: boolean
      data: {
         topic_id: number
      }
   }
}
