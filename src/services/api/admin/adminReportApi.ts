// moovy-frontend/src/services/api/admin/adminReportApi.ts
import adminHttp from './adminHttp'

export type AdminReportItem = {
  type: 'comment' | 'reply'
  report_id: number
  reporter: {
    user_id: number
    name: string
    profile_img?: string | null
  }
  reported: {
    user_id: number
    name: string
    profile_img?: string | null
  }
  post: {
    type: string
    id: number
    content: string
  }
  report_type: string
  category: string
  report_content: string
  created_at: string
  deleted_at?: string | null
  status: '대기중' | '처리완료'
  action?: string
  sanction?: {
    id: number
    start_at: string
    end_at: string
    reason: string
  }
}

export type AdminReportListParams = {
  page?: number
  limit?: number
  post_type?: 'comment' | 'reply'
  report_type?: string
  status?: 'PENDING' | 'COMPLETED'
  reporter?: string
  reported?: string
  created_start?: string
  created_end?: string
}

export type AdminReportListResponse = {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  list: AdminReportItem[]
}

type ApiSuccessEnvelope<T> = { success: true } & T
type ApiReportListResponse = ApiSuccessEnvelope<{ data: AdminReportListResponse }>

/** 관리자 신고 목록 조회 */
export async function fetchAdminReports(params: AdminReportListParams = {}) {
  const { data } = await adminHttp.get<ApiReportListResponse>('/reports/list', { params })
  return {
    items: data.data.list,
    page: data.data.pagination.page,
    size: data.data.pagination.limit,
    total: data.data.pagination.total,
  }
}

/** 관리자 신고 상세 조회 */
export async function fetchAdminReportDetail(type: 'comment' | 'reply', report_id: number) {
  const { data } = await adminHttp.get<{ success: true; data: AdminReportItem }>(`/reports/${type}/${report_id}`)
  return data.data
}

/** 관리자 신고 처리 완료 */
export async function completeAdminReport(
  type: 'comment' | 'reply',
  report_id: number,
  action?: string
) {
  const { data } = await adminHttp.delete<{ success: true; data: AdminReportItem }>(
    `/reports/${type}/${report_id}`,
    { params: { action } }
  )
  return data.data
}

