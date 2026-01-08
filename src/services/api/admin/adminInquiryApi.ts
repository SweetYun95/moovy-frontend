// moovy-frontend/src/services/api/admin/adminInquiryApi.ts
import adminHttp from './adminHttp'

export type InquiryState = 'PENDING' | 'FULFILLED'

export type AdminInquirySummary = {
   qna_id: number
   user_id: number
   q_title: string
   q_contnet?: string
   q_content?: string
   a_title?: string | null
   a_content?: string | null
   state: InquiryState
   created_at?: string
   createdAt?: string
   updated_at?: string
   updatedAt?: string
   User?: {
      user_id: number
      name: string
      profile_img?: string | null
   }
   AdminUser?: {
      admin_id: number
      name: string
   }
}

export type AdminInquiryDetail = {
   qna: AdminInquirySummary
   qnaImg: Array<{ image_id?: number; img_url: string; order: number }>
}

export type ListParams = {
   page?: number
   size?: number
   userId?: number
   nickname?: string
   title?: string
   status?: '미완료' | '답변완료'
   createdDateStart?: string
   createdDateEnd?: string
   answeredDateStart?: string
   answeredDateEnd?: string
}

export type ListResponse<T> = {
   items: T[]
   page: number
   size: number
   total: number
   totalPages: number
}

type ApiEnvelope<T> = { success: true; data: T }

function normalizeYmd(value?: string) {
   if (!value) return undefined
   return String(value).slice(0, 10)
}

function mapListParams(params: ListParams) {
   const mapped: Record<string, any> = {
      page: params.page ?? 1,
      limit: params.size ?? 10,
   }

   if (params.userId != null && params.userId !== ('' as any)) mapped.user_id = Number(params.userId)
   if (params.nickname) mapped.nickname = params.nickname
   if (params.title) mapped.q_title = params.title

   if (params.status === '미완료') mapped.state = 'PENDING'
   if (params.status === '답변완료') mapped.state = 'FULFILLED'

   const start = normalizeYmd(params.createdDateStart)
   const end = normalizeYmd(params.createdDateEnd)
   if (start || end) {
      mapped.created_start = start ?? end
      mapped.created_end = end ?? start
   }

   const answeredStart = normalizeYmd(params.answeredDateStart)
   const answeredEnd = normalizeYmd(params.answeredDateEnd)
   if (answeredStart || answeredEnd) {
      mapped.answered_start = answeredStart ?? answeredEnd
      mapped.answered_end = answeredEnd ?? answeredStart
   }

   return mapped
}

/** 목록 */
export async function fetchAdminInquiries(params: ListParams = {}) {
   const { data } = await adminHttp.get<ApiEnvelope<{ pagination: { page: number; limit: number; total: number; totalPages: number }; list: AdminInquirySummary[] }>>('/qna/list', {
      params: mapListParams(params),
   })

   return {
      items: data.data.list,
      page: data.data.pagination.page,
      size: data.data.pagination.limit,
      total: data.data.pagination.total,
      totalPages: data.data.pagination.totalPages,
   } as ListResponse<AdminInquirySummary>
}

/** 상세 */
export async function fetchAdminInquiryDetail(qna_id: number) {
   const { data } = await adminHttp.get<ApiEnvelope<AdminInquiryDetail>>(`/qna/${qna_id}`)
   return data.data
}

/** 답변 등록 */
export async function postAdminInquiryAnswer(payload: { qna_id: number; a_title: string; a_content: string }) {
   const { data } = await adminHttp.post<ApiEnvelope<{ qna_id: number }>>('/qna', payload)
   return data
}
