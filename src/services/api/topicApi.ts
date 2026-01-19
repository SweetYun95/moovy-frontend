// moovy-frontend/src/services/api/topicApi.ts
import moovy from './http'

export type Topic = {
  id: number
  images: string[]
  title: string
  englishTitle?: string  // 영어 타이틀
  runtime: string
  ageRating: 'all' | '12' | '15' | '18'
  synopsis: string
  releaseDate: string
  genre: string
  category?: string  // 영화, 드라마, 애니메이션 등
  country?: string   // 한국, 미국, 영국 등
  year?: string      // releaseDate에서 추출
  imageUrl?: string  // images[0]
  overallRating?: number  // 코멘트 평균
  createdAt: string
  updatedAt: string
}

export type TopicList = {
  list: Topic[]
  total: number
}

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
  category?: string  // 영화, 드라마, 애니메이션 등
  country?: string   // 한국, 미국, 영국 등
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
  category?: string  // 영화, 드라마, 애니메이션 등
  country?: string   // 한국, 미국, 영국 등
}

/** 토픽 목록 조회 (퍼블릭) */
// 백엔드에 /api/topic/list가 없으므로 인기 영화 API를 사용하도록 변경
// 이 함수는 더 이상 사용되지 않음 (contentSlice에서 직접 popularApi 사용)
export async function getTopics() {
  // 백엔드에 해당 엔드포인트가 없으므로 빈 배열 반환
  // 실제로는 contentSlice에서 getTodayPopularMovies를 사용
  return { list: [], total: 0 } as TopicList
}

/** 관리자 토픽 목록 조회 */
export async function getAdminTopics(params?: {
  main?: 'current' | 'past'
  filter?: 'all' | 'popular' | 'showing' | 'recommended'
  page?: number
  size?: number
  sort?: string
  order?: 'ASC' | 'DESC'
}) {
  const res = await moovy.get('/admin/topics', { params })
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

/** 토픽 조회 */
export async function getTopic(id: number) {
  const res = await moovy.get(`/topic/${id}`)
  return res.data as Topic
}

/** 토픽 생성 */
export async function createTopic(data: CreateTopicRequest) {
  const res = await moovy.post('/topic', data)
  return res.data as Topic
}

/** 토픽 수정 */
export async function updateTopic(id: number, data: UpdateTopicRequest) {
  const res = await moovy.put(`/topic/${id}`, data)
  return res.data as Topic
}

/** 토픽 삭제 (관리자용) */
export async function deleteAdminTopic(id: number) {
  const res = await moovy.delete(`/admin/topics/${id}`)
  return res.data as {
    success: boolean
    data: {
      topic_id: number
    }
  }
}

/** 토픽 삭제 (기존 - 호환성 유지) */
export async function deleteTopic(id: number) {
  const res = await moovy.delete(`/topic/${id}`)
  return res.data
}

/** 토픽 이미지 업로드 */
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

/** TMDB 영화 검색 */
export async function searchTmdbMovies(query: string, page: number = 1) {
  const res = await moovy.get('/admin/tmdb/search', {
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

/** TMDB 영화 상세 정보 조회 */
export async function getTmdbMovieDetails(tmdbId: number) {
  const res = await moovy.get(`/admin/tmdb/movies/${tmdbId}`)
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

/** 전체 인기작 스냅샷 조회 */
export async function getPopularSnapshot(params?: {
  source?: string
  date?: string
  limit?: number
}) {
  const res = await moovy.get('/admin/topics/popular', { params })
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

/** 현재 상영작 스냅샷 조회 */
export async function getNowPlayingSnapshot(params?: {
  date?: string
  limit?: number
}) {
  const res = await moovy.get('/admin/topics/now-playing', { params })
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
export async function createAdminTopic(data: {
  tmdb_id?: number
  content_id?: number
  start_at: string // ISO date string
  end_at: string // ISO date string
  is_admin_recommended?: boolean
}) {
  const res = await moovy.post('/admin/topics', data)
  return res.data as {
    success: boolean
    data: {
      topic_id: number
    }
  }
}

