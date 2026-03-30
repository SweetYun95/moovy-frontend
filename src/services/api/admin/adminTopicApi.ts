// moovy-frontend/src/services/api/admin/adminTopicApi.ts
import adminHttp from './adminHttp'

/**
 * Admin Topics API
 * baseURL = {VITE_APP_API_URL}/api/admin (adminHttp)
 *
 * 백엔드 엔드포인트
 * - GET    /topics
 * - POST   /topics
 * - PATCH  /topics/:topic_id
 * - DELETE /topics/:topic_id
 * - GET    /topics/:topic_id/comments
 * - GET    /topics/popular
 */

/** VideoContent(표시용) */
export type AdminTopicContent = {
   content_id: number
   tmdb_id?: number
   title: string
   release_date?: string | null
   genre?: string | null
   time?: number | null
   age_limit?: number | null
   plot?: string | null
   poster_path?: string | null
   backdrop_path?: string | null
   views?: number
}

/** Topic row (프론트 표준) */
export type AdminTopic = {
   topic_id: number
   content_id: number
   is_admin_recommended?: boolean
   start_at: string
   end_at: string
   created_at?: string
   updated_at?: string
   deleted_at?: string | null
   VideoContent?: AdminTopicContent
}

/** 토픽 생성/수정 payload */
export type CreateTopicPayload = {
   content_id: number
   start_at: string
   end_at: string
   is_admin_recommended?: boolean
}

export type UpdateTopicPayload = Partial<CreateTopicPayload>

/** Paging 응답(프론트 표준) */
export type ListResponse<T> = {
   items: T[]
   page: number
   size: number
   total: number
   totalPages: number
}

/** 토픽 리스트 params(프론트 사용 편의) */
export type ListTopicsParams = {
   page?: number
   size?: number
   q?: string
   state?: 'current' | 'past' | 'showing'
   sort?: 'start_at' | 'end_at' | 'created_at' | 'views'
   order?: 'ASC' | 'DESC'
   main?: 'current' | 'past' | 'all'
   filter?: 'all' | 'popular' | 'showing' | 'recommended'
}

/** 토픽 댓글(프론트 표준) */
export type AdminTopicComment = {
   comment_id: number
   topic_id: number
   user_id: number
   content: string
   created_at: string
   updated_at?: string
   deleted_at?: string | null
   User?: {
      user_id: number
      name?: string
      email?: string
      profile_img?: string | null
   }
}

/** 인기작 스냅샷(프론트 표준) */
export type AdminPopularItem = {
   rank: number
   content_id: number
   title: string
   poster_path?: string | null
   backdrop_path?: string | null
   release_date?: string | null
   views?: number
}

type ApiEnvelope = {
   success?: boolean
   message?: string
   data?: any
}

function unwrapData<T = any>(res: any): T {
   if (res && typeof res === 'object' && 'data' in res) return res.data as T
   return res as T
}

function calcTotalPages(total: number, size: number) {
   const s = Number(size || 20)
   if (!s) return 0
   return Math.max(0, Math.ceil(Number(total || 0) / s))
}

function normalizeVideoContent(raw: any): AdminTopicContent | undefined {
   if (!raw) return undefined
   const v = raw.VideoContent ?? raw.video ?? raw
   if (!v) return undefined
   if (!v.content_id && !v.tmdb_id && !v.title) return undefined

   return {
      content_id: Number(v.content_id),
      tmdb_id: v.tmdb_id ?? undefined,
      title: String(v.title ?? ''),
      release_date: v.release_date ?? null,
      genre: v.genre ?? null,
      time: v.time ?? null,
      age_limit: v.age_limit ?? null,
      plot: v.plot ?? v.synopsis ?? null,
      poster_path: v.poster_path ?? null,
      backdrop_path: v.backdrop_path ?? null,
      views: v.views ?? undefined,
   }
}

function normalizeTopic(raw: any): AdminTopic {
   return {
      topic_id: Number(raw.topic_id),
      content_id: Number(raw.content_id),
      start_at: raw.start_at,
      end_at: raw.end_at,
      is_admin_recommended: raw.is_admin_recommended ?? false,
      created_at: raw.created_at ?? undefined,
      updated_at: raw.updated_at ?? undefined,
      deleted_at: raw.deleted_at ?? null,
      VideoContent: normalizeVideoContent(raw),
   }
}

function normalizeTopicList(raw: any): ListResponse<AdminTopic> {
   const items = Array.isArray(raw?.items) ? raw.items : []
   const page = Number(raw?.page ?? 1)
   const size = Number(raw?.size ?? 20)
   const total = Number(raw?.total ?? 0)

   const normalized = items.map(normalizeTopic)
   return {
      items: normalized,
      page,
      size,
      total,
      totalPages: Number(raw?.totalPages ?? calcTotalPages(total, size)),
   }
}

function normalizeTopicComment(raw: any): AdminTopicComment {
   const u = raw?.User ?? raw?.user ?? null

   return {
      comment_id: Number(raw.comment_id),
      topic_id: Number(raw.topic_id),
      user_id: Number(raw.user_id),
      content: raw.content,
      created_at: raw.created_at,
      updated_at: raw.updated_at ?? undefined,
      deleted_at: raw.deleted_at ?? null,
      User: u
         ? {
              user_id: Number(u.user_id),
              name: u.name ?? undefined,
              email: u.email ?? undefined,
              profile_img: u.profile_img ?? null,
           }
         : undefined,
   }
}

function normalizeCommentList(raw: any): ListResponse<AdminTopicComment> {
   const items = Array.isArray(raw?.items) ? raw.items : []
   const page = Number(raw?.page ?? 1)
   const size = Number(raw?.size ?? 20)
   const total = Number(raw?.total ?? 0)

   return {
      items: items.map(normalizeTopicComment),
      page,
      size,
      total,
      totalPages: Number(raw?.totalPages ?? calcTotalPages(total, size)),
   }
}

function normalizePopularItems(raw: any): AdminPopularItem[] {
   const items = Array.isArray(raw?.items) ? raw.items : []

   return items
      .map((row: any) => {
         const c = row?.content ?? row?.VideoContent ?? row?.video ?? null
         if (!c) return null

         return {
            rank: Number(row.rank),
            content_id: Number(c.content_id),
            title: String(c.title ?? ''),
            poster_path: c.poster_path ?? null,
            backdrop_path: c.backdrop_path ?? null,
            release_date: c.release_date ?? null,
            views: c.views ?? undefined,
         } as AdminPopularItem
      })
      .filter(Boolean) as AdminPopularItem[]
}

function buildListParams(params: ListTopicsParams) {
   const next: any = { ...params }

   if (params.state) {
      if (params.state === 'current') next.main = 'current'
      if (params.state === 'past') next.main = 'past'
      if (params.state === 'showing') next.filter = 'showing'
      delete next.state
   }

   if ('q' in next) delete next.q

   return next
}

export async function fetchAdminTopics(params: ListTopicsParams = {}) {
   const { data } = await adminHttp.get<ApiEnvelope>('/topics', { params: buildListParams(params) })
   const inner = unwrapData<any>(data)
   return normalizeTopicList(inner)
}

export async function createAdminTopic(payload: CreateTopicPayload) {
   const { data } = await adminHttp.post<ApiEnvelope>('/topics', payload)
   const inner = unwrapData<any>(data)

   const topic_id = Number(inner?.topic_id)

   return {
      topic_id,
      content_id: payload.content_id,
      start_at: payload.start_at,
      end_at: payload.end_at,
      is_admin_recommended: payload.is_admin_recommended ?? false,
   } as AdminTopic
}

export async function updateAdminTopic(topic_id: number, payload: UpdateTopicPayload) {
   const { data } = await adminHttp.patch<ApiEnvelope>(`/topics/${topic_id}`, payload)
   const inner = unwrapData<any>(data)

   const id = Number(inner?.topic_id ?? topic_id)

   return {
      topic_id: id,
      content_id: Number(payload.content_id ?? (payload as any).content_id ?? NaN),
      start_at: String(payload.start_at ?? ''),
      end_at: String(payload.end_at ?? ''),
      is_admin_recommended: payload.is_admin_recommended,
   } as AdminTopic
}

export async function deleteAdminTopic(topic_id: number) {
   const { data } = await adminHttp.delete<ApiEnvelope>(`/topics/${topic_id}`)
   return unwrapData<any>(data)
}

export async function fetchAdminTopicComments(topic_id: number, params?: { page?: number; size?: number; q?: string; order?: 'ASC' | 'DESC' }) {
   const { data } = await adminHttp.get<ApiEnvelope>(`/topics/${topic_id}/comments`, { params })
   const inner = unwrapData<any>(data)
   return normalizeCommentList(inner)
}

export async function fetchAdminPopularTopics(params?: { source?: string; date?: string; limit?: number }) {
   const { data } = await adminHttp.get<ApiEnvelope>('/topics/popular', { params })
   const inner = unwrapData<any>(data)
   return normalizePopularItems(inner)
}
