// moovy-frontend/src/services/api/admin/adminQnaApi.ts
import adminHttp from './adminHttp'

export type AdminQnaItem = {
  qna_id: number
  user_id: number
  q_title: string
  q_content: string
  state: 'PENDING' | 'FULFILLED' | 'CANCELLED'
  created_at: string
  updated_at: string
  User?: {
    user_id: number
    name: string
    profile_img?: string | null
  }
  a_title?: string | null
  a_content?: string | null
  admin_id?: number | null
}

export type AdminQnaListParams = {
  page?: number
  limit?: number
  user_id?: number
  state?: 'PENDING' | 'FULFILLED' | 'CANCELLED'
  q_title?: string
  nickname?: string
  created_start?: string
  created_end?: string
  answered_start?: string
  answered_end?: string
}

export type AdminQnaListResponse = {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  list: AdminQnaItem[]
}

type ApiSuccessEnvelope<T> = { success: true } & T
type ApiQnaListResponse = ApiSuccessEnvelope<{ data: AdminQnaListResponse }>

/** 관리자 QnA 목록 조회 */
export async function fetchAdminQnas(params: AdminQnaListParams = {}) {
  const { data } = await adminHttp.get<ApiQnaListResponse>('/qna/list', { params })
  return {
    items: data.data.list,
    page: data.data.pagination.page,
    size: data.data.pagination.limit,
    total: data.data.pagination.total,
  }
}

/** 관리자 QnA 상세 조회 */
export async function fetchAdminQnaDetail(qna_id: number) {
  const { data } = await adminHttp.get<{ success: true; data: AdminQnaItem }>(`/qna/${qna_id}`)
  return data.data
}

