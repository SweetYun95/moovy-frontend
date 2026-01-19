// moovy-frontend/src/features/admin/adminHistorySlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '@/services/api/admin/adminHistoryApi'
import type { AdminHistoryItem, HistoryListParams } from '@/services/api/admin/adminHistoryApi'

export type AdminHistoryState = {
   items: AdminHistoryItem[]
   page: number
   limit: number
   total: number
   loading: boolean
   error: string | null
   params: HistoryListParams
}

const initialState: AdminHistoryState = {
   items: [],
   page: 1,
   limit: 10,
   total: 0,
   loading: false,
   error: null,
   params: {},
}

export const getAdminHistories = createAsyncThunk('adminHistory/getAdminHistories', async (params: HistoryListParams = {}, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminHistories(params)
      return { res, params }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch admin histories')
   }
})

const adminHistorySlice = createSlice({
   name: 'adminHistory',
   initialState,
   reducers: {
      setHistoryParams(state, action) {
         state.params = { ...state.params, ...action.payload }
      },
      resetHistory(state) {
         return initialState
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAdminHistories.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getAdminHistories.fulfilled, (state, action) => {
            const { res, params } = action.payload
            state.loading = false
            state.items = res.items
            state.page = res.page
            state.limit = res.limit
            state.total = res.total
            state.params = params
         })
         .addCase(getAdminHistories.rejected, (state, action) => {
            state.loading = false
            state.error = String(action.payload || action.error.message || 'Failed')
         })
   },
})

export const { setHistoryParams, resetHistory } = adminHistorySlice.actions
export default adminHistorySlice.reducer
