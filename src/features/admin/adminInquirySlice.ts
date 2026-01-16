// moovy-frontend/src/features/admin/adminInquirySlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as api from '../../services/api/admin/adminInquiryApi'
import type { AdminInquiryDetail, AdminInquirySummary, ListParams, ListResponse } from '../../services/api/admin/adminInquiryApi'

export type AdminInquiryListBucket = {
   items: AdminInquirySummary[]
   page: number
   size: number
   total: number
   totalPages: number
   loading: boolean
   error: string | null
   params: ListParams
}

export type AdminInquiryDetailBucket = {
   item: AdminInquiryDetail | null
   loading: boolean
   error: string | null
}

export type AdminInquiryState = {
   list: AdminInquiryListBucket
   detailById: Record<number, AdminInquiryDetailBucket>
}

const initialState: AdminInquiryState = {
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
   detailById: {},
}

export const getAdminInquiries = createAsyncThunk('adminInquiry/getAdminInquiries', async (params: ListParams = {}, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminInquiries(params)
      return { res, params }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch inquiries')
   }
})

export const getAdminInquiryDetail = createAsyncThunk('adminInquiry/getAdminInquiryDetail', async (qna_id: number, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminInquiryDetail(qna_id)
      return { qna_id, res }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch inquiry detail')
   }
})

export const answerAdminInquiry = createAsyncThunk('adminInquiry/answerAdminInquiry', async (args: { qna_id: number; a_title: string; a_content: string }, { rejectWithValue }) => {
   try {
      await api.postAdminInquiryAnswer(args)
      return args
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to post answer')
   }
})

const adminInquirySlice = createSlice({
   name: 'adminInquiry',
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
         .addCase(getAdminInquiries.pending, (state) => {
            state.list.loading = true
            state.list.error = null
         })
         .addCase(getAdminInquiries.fulfilled, (state, action) => {
            const { res, params } = action.payload as { res: ListResponse<AdminInquirySummary>; params: ListParams }
            state.list.loading = false
            state.list.items = res.items
            state.list.page = res.page
            state.list.size = res.size
            state.list.total = res.total
            state.list.totalPages = res.totalPages
            state.list.params = params
         })
         .addCase(getAdminInquiries.rejected, (state, action) => {
            state.list.loading = false
            state.list.error = String(action.payload || action.error.message || 'Failed to fetch inquiries')
         })

      builder
         .addCase(getAdminInquiryDetail.pending, (state, action) => {
            const qna_id = action.meta.arg as number
            state.detailById[qna_id] ??= { item: null, loading: true, error: null }
            state.detailById[qna_id].loading = true
            state.detailById[qna_id].error = null
         })
         .addCase(getAdminInquiryDetail.fulfilled, (state, action) => {
            const { qna_id, res } = action.payload as { qna_id: number; res: AdminInquiryDetail }
            state.detailById[qna_id] = { item: res, loading: false, error: null }
         })
         .addCase(getAdminInquiryDetail.rejected, (state, action) => {
            const qna_id = action.meta.arg as number
            state.detailById[qna_id] ??= { item: null, loading: false, error: null }
            state.detailById[qna_id].loading = false
            state.detailById[qna_id].error = String(action.payload || action.error.message || 'Failed to fetch inquiry detail')
         })

      builder.addCase(answerAdminInquiry.fulfilled, (state, action) => {
         const { qna_id, a_title, a_content } = action.payload as { qna_id: number; a_title: string; a_content: string }

         const listItem = state.list.items.find((it) => it.qna_id === qna_id)
         if (listItem) {
            listItem.a_title = a_title
            listItem.a_content = a_content
            listItem.state = 'FULFILLED'
         }

         const detail = state.detailById[qna_id]?.item
         if (detail?.qna) {
            detail.qna.a_title = a_title
            detail.qna.a_content = a_content
            detail.qna.state = 'FULFILLED'
         }
      })
   },
})

export const { setListParams, resetList } = adminInquirySlice.actions
export default adminInquirySlice.reducer
