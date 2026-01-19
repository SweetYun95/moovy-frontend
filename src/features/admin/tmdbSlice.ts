// moovy-frontend/src/features/admin/tmdbSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as tmdbApi from '@/services/api/admin/tmdbApi'
import type { TmdbMovieItem, TmdbMovieDetail } from '@/services/api/admin/tmdbApi'

export type TmdbState = {
   search: {
      items: TmdbMovieItem[]
      page: number
      totalPages: number
      loading: boolean
   }
   detail: {
      item: TmdbMovieDetail | null
      loading: boolean
   }
   error: string | null
}

const initialState: TmdbState = {
   search: {
      items: [],
      page: 1,
      totalPages: 1,
      loading: false,
   },
   detail: {
      item: null,
      loading: false,
   },
   error: null,
}

/** TMDB 검색 */
export const searchTmdbMoviesThunk = createAsyncThunk('tmdb/search', async (params: { q: string; page?: number }, { rejectWithValue }) => {
   try {
      return await tmdbApi.searchTmdbMovies(params)
   } catch (err: any) {
      return rejectWithValue(err?.message || 'TMDB 검색 실패')
   }
})

/** TMDB 상세 */
export const fetchTmdbMovieDetailThunk = createAsyncThunk('tmdb/detail', async (tmdb_id: number, { rejectWithValue }) => {
   try {
      return await tmdbApi.getTmdbMovieDetail(tmdb_id)
   } catch (err: any) {
      return rejectWithValue(err?.message || 'TMDB 상세 조회 실패')
   }
})

const tmdbSlice = createSlice({
   name: 'tmdb',
   initialState,
   reducers: {
      clearTmdbSearch(state) {
         state.search = { items: [], page: 1, totalPages: 1, loading: false }
         state.error = null
      },
      clearTmdbDetail(state) {
         state.detail.item = null
         state.detail.loading = false
      },
   },
   extraReducers: (builder) => {
      builder
         // 검색
         .addCase(searchTmdbMoviesThunk.pending, (state) => {
            state.search.loading = true
            state.error = null
         })
         .addCase(searchTmdbMoviesThunk.fulfilled, (state, action) => {
            state.search.loading = false
            state.search.items = action.payload.items
            state.search.page = action.payload.page
            state.search.totalPages = action.payload.totalPages
         })
         .addCase(searchTmdbMoviesThunk.rejected, (state, action) => {
            state.search.loading = false
            state.error = String(action.payload)
         })

         // 상세
         .addCase(fetchTmdbMovieDetailThunk.pending, (state) => {
            state.detail.loading = true
            state.error = null
         })
         .addCase(fetchTmdbMovieDetailThunk.fulfilled, (state, action) => {
            state.detail.loading = false
            state.detail.item = action.payload
         })
         .addCase(fetchTmdbMovieDetailThunk.rejected, (state, action) => {
            state.detail.loading = false
            state.error = String(action.payload)
         })
   },
})

export const { clearTmdbSearch, clearTmdbDetail } = tmdbSlice.actions
export default tmdbSlice.reducer