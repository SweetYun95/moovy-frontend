// moovy-frontend/src/services/api/admin/adminHistoryApi.ts
import adminHttp from './adminHttp'

export type AdminHistoryItem = {
   history_id: number
   action: string
   message: string
   created_at: string

   admin_id?: number | null
   user_id?: number | null

   admin?: {
      admin_id: number
      name: string
      role: string
   } | null

   user?: {
      user_id: number
      name: string
      profile_img?: string | null
      state: string
   } | null
}

export type AdminHistoryListResponse = {
   items: AdminHistoryItem[]
   total: number
   page: number
   limit: number
}

export type HistoryListParams = {
   page?: number
   limit?: number
   action?: string
   admin_id?: number
   user_id?: number
}

export async function fetchAdminHistories(params: HistoryListParams = {}) {
   const { data } = await adminHttp.get<AdminHistoryListResponse>('/histories', { params })
   return data
}