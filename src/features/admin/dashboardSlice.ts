// moovy-frontend/src/features/admin/dashboardSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '@/services/api/admin/adminDashboardApi'
import type { AdminDashboardResponse } from '@/services/api/admin/adminDashboardApi'

export type AdminDashboardState = {
   data: AdminDashboardResponse | null
   loading: boolean
   error: string | null
   lastFetchedAt?: string
}

const initialState: AdminDashboardState = {
   data: null,
   loading: false,
   error: null,
   lastFetchedAt: undefined,
}

// GET /api/admin/dashboard
export const getAdminDashboard = createAsyncThunk('adminDashboard/getAdminDashboard', async (params: { year?: number; topN?: number } | undefined, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminDashboard(params)
      return res
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch dashboard')
   }
})

const adminDashboardSlice = createSlice({
   name: 'adminDashboard',
   initialState,
   reducers: {
      resetDashboard(state) {
         state.data = null
         state.loading = false
         state.error = null
         state.lastFetchedAt = undefined
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAdminDashboard.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getAdminDashboard.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload as AdminDashboardResponse
            state.lastFetchedAt = new Date().toISOString()
         })
         .addCase(getAdminDashboard.rejected, (state, action) => {
            state.loading = false
            state.error = String(action.payload || action.error.message || 'Failed to fetch dashboard')
         })
   },
})

export const { resetDashboard } = adminDashboardSlice.actions
export default adminDashboardSlice.reducer
