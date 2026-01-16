// moovy-frontend/src/services/api/admin/adminReportsApi.ts
import adminHttp from './adminHttp'

export type AdminReportType = 'comment' | 'reply'

export type AdminReportCategoryKorean = '스팸' | '스포일러' | '도배' | '부적절한 언행' | '기타'
export type AdminReportStatusKorean = '대기중' | '처리완료'

export type AdminReportItem = {
   type: AdminReportType
   report_id: number
   reporter: { user_id: number; name: string; profile_img?: string | null }
   reported: { user_id: number; name: string; profile_img?: string | null }
   post: { type: '코멘트' | '댓글'; id: number; content: string }
   report_type: string
   category: AdminReportCategoryKorean
   report_content: string
   created_at: string
   deleted_at?: string | null
   status: AdminReportStatusKorean
   action?: '제재' | '조치 안함'
   sanction?: { id: number; start_at: string; end_at: string; reason: string }
}

export type ListParams = {
   page?: number
   size?: number
   reporter?: string
   reported?: string
   postType?: '코멘트' | '댓글'
   postId?: number | string
   category?: AdminReportCategoryKorean
   status?: AdminReportStatusKorean
   createdDateStart?: string
   createdDateEnd?: string
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

function toReportTypeCode(category?: AdminReportCategoryKorean) {
   switch (category) {
      case '스팸':
         return 'SPAM'
      case '스포일러':
         return 'SPOILER'
      case '부적절한 언행':
         return 'ABUSE'
      case '도배':
         return 'HARASSMENT'
      case '기타':
         return 'OTHER'
      default:
         return undefined
   }
}

function mapListParams(params: ListParams) {
   const mapped: Record<string, any> = {
      page: params.page ?? 1,
      limit: params.size ?? 10,
   }

   if (params.reporter) mapped.reporter = params.reporter
   if (params.reported) mapped.reported = params.reported

   if (params.postType === '코멘트') mapped.post_type = 'comment'
   if (params.postType === '댓글') mapped.post_type = 'reply'

   if (params.postId != null && params.postId !== ('' as any)) mapped.post_id = Number(params.postId)

   const reportType = toReportTypeCode(params.category)
   if (reportType) mapped.report_type = reportType

   if (params.status === '대기중') mapped.status = 'PENDING'
   if (params.status === '처리완료') mapped.status = 'COMPLETED'

   const start = normalizeYmd(params.createdDateStart)
   const end = normalizeYmd(params.createdDateEnd)
   if (start || end) {
      mapped.created_start = start ?? end
      mapped.created_end = end ?? start
   }

   return mapped
}

/** 목록 */
export async function fetchAdminReports(params: ListParams = {}) {
   const { data } = await adminHttp.get<ApiEnvelope<{ pagination: { page: number; limit: number; total: number; totalPages: number }; list: AdminReportItem[] }>>('/reports/list', {
      params: mapListParams(params),
   })

   return {
      items: data.data.list,
      page: data.data.pagination.page,
      size: data.data.pagination.limit,
      total: data.data.pagination.total,
      totalPages: data.data.pagination.totalPages,
   } as ListResponse<AdminReportItem>
}

/** 상세 */
export async function fetchAdminReportDetail(type: AdminReportType, report_id: number) {
   const { data } = await adminHttp.get<ApiEnvelope<AdminReportItem>>(`/reports/${type}/${report_id}`)
   return data.data
}

/** 처리완료(soft delete) */
export async function completeAdminReport(type: AdminReportType, report_id: number, action?: 'NONE' | 'SANCTION') {
   const { data } = await adminHttp.delete<ApiEnvelope<{ type: AdminReportType; report_id: number; deleted_at: string; action?: 'NONE' | 'SANCTION' }>>(`/reports/${type}/${report_id}`, {
      params: action ? { action } : undefined,
   })
   return data.data
}
