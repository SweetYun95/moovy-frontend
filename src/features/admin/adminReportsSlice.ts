// moovy-frontend/src/features/admin/adminReportsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as api from '../../services/api/admin/adminReportsApi'
import type { AdminReportItem, AdminReportType, ListParams, ListResponse } from '../../services/api/admin/adminReportsApi'

export type AdminReportsListBucket = {
   items: AdminReportItem[]
   page: number
   size: number
   total: number
   totalPages: number
   loading: boolean
   error: string | null
   params: ListParams
}

export type AdminReportDetailBucket = {
   item: AdminReportItem | null
   loading: boolean
   error: string | null
}

export type AdminReportsState = {
   list: AdminReportsListBucket
   detailByKey: Record<string, AdminReportDetailBucket>
}

const initialState: AdminReportsState = {
   list: {
      items: [],
      page: 1,
      size: 10,
      total: 0,
      totalPages: 0,
      loading: false,
      error: null,
      params: {},
   },
   detailByKey: {},
}

function makeKey(type: AdminReportType, report_id: number) {
   return `${type}:${report_id}`
}

export const getAdminReports = createAsyncThunk('adminReports/getAdminReports', async (params: ListParams = {}, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminReports(params)
      return { res, params }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch reports')
   }
})

export const getAdminReportDetail = createAsyncThunk('adminReports/getAdminReportDetail', async (args: { type: AdminReportType; report_id: number }, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminReportDetail(args.type, args.report_id)
      return { ...args, res }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch report detail')
   }
})

export const completeAdminReport = createAsyncThunk(
   'adminReports/completeAdminReport',
   async (args: { type: AdminReportType; report_id: number; action?: 'NONE' | 'SANCTION' }, { rejectWithValue }) => {
   try {
      const res = await api.completeAdminReport(args.type, args.report_id, args.action)
      return { ...args, res }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to complete report')
   }
   },
)

const adminReportsSlice = createSlice({
   name: 'adminReports',
   initialState,
   reducers: {
      setListParams(state, action: PayloadAction<Partial<ListParams>>) {
         state.list.params = { ...state.list.params, ...action.payload }
      },
      resetList(state) {
         state.list = { ...initialState.list }
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAdminReports.pending, (state) => {
            state.list.loading = true
            state.list.error = null
         })
         .addCase(getAdminReports.fulfilled, (state, action) => {
            const { res, params } = action.payload as { res: ListResponse<AdminReportItem>; params: ListParams }
            state.list.loading = false
            state.list.items = res.items
            state.list.page = res.page
            state.list.size = res.size
            state.list.total = res.total
            state.list.totalPages = res.totalPages
            state.list.params = params
         })
         .addCase(getAdminReports.rejected, (state, action) => {
            state.list.loading = false
            state.list.error = String(action.payload || action.error.message || 'Failed to fetch reports')
         })

      builder
         .addCase(getAdminReportDetail.pending, (state, action) => {
            const { type, report_id } = action.meta.arg as { type: AdminReportType; report_id: number }
            const key = makeKey(type, report_id)
            state.detailByKey[key] ??= { item: null, loading: true, error: null }
            state.detailByKey[key].loading = true
            state.detailByKey[key].error = null
         })
         .addCase(getAdminReportDetail.fulfilled, (state, action) => {
            const { type, report_id, res } = action.payload as { type: AdminReportType; report_id: number; res: AdminReportItem }
            const key = makeKey(type, report_id)
            state.detailByKey[key] = { item: res, loading: false, error: null }
         })
         .addCase(getAdminReportDetail.rejected, (state, action) => {
            const { type, report_id } = action.meta.arg as { type: AdminReportType; report_id: number }
            const key = makeKey(type, report_id)
            state.detailByKey[key] ??= { item: null, loading: false, error: null }
            state.detailByKey[key].loading = false
            state.detailByKey[key].error = String(action.payload || action.error.message || 'Failed to fetch report detail')
         })

      builder.addCase(completeAdminReport.fulfilled, (state, action) => {
         const { type, report_id } = action.payload as { type: AdminReportType; report_id: number }

         const listItem = state.list.items.find((it) => it.type === type && it.report_id === report_id)
         if (listItem) {
            listItem.status = '처리완료'
            listItem.deleted_at = new Date().toISOString()
         }

         const key = makeKey(type, report_id)
         const detail = state.detailByKey[key]?.item
         if (detail) {
            detail.status = '처리완료'
            detail.deleted_at = new Date().toISOString()
         }
      })
   },
})

export const { setListParams, resetList } = adminReportsSlice.actions
export default adminReportsSlice.reducer
