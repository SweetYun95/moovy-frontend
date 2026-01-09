// moovy-frontend/src/features/admin/topicsSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import * as api from '@/services/api/admin/adminTopicApi'
import type { AdminPopularItem, AdminTopic, AdminTopicComment, CreateTopicPayload, ListResponse, ListTopicsParams, UpdateTopicPayload } from '@/services/api/admin/adminTopicApi'

export type AdminTopicsState = {
   list: ListResponse<AdminTopic>
   popular: AdminPopularItem[]
   commentsByTopicId: Record<number, ListResponse<AdminTopicComment>>

   selectedTopicId: number | null

   loading: {
      list: boolean
      popular: boolean
      comments: boolean
      mutate: boolean
   }
   error: string | null
   lastFetchedAt?: string
}

const emptyList = <T>(): ListResponse<T> => ({
   items: [],
   page: 1,
   size: 20,
   total: 0,
   totalPages: 0,
})

const initialState: AdminTopicsState = {
   list: emptyList<AdminTopic>(),
   popular: [],
   commentsByTopicId: {},
   selectedTopicId: null,
   loading: { list: false, popular: false, comments: false, mutate: false },
   error: null,
   lastFetchedAt: undefined,
}

// GET /api/admin/topics
export const getAdminTopics = createAsyncThunk('adminTopics/getAdminTopics', async (params: ListTopicsParams | undefined, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminTopics(params ?? {})
      return res
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch admin topics')
   }
})

// GET /api/admin/topics/popular
export const getAdminPopularTopics = createAsyncThunk('adminTopics/getAdminPopularTopics', async (params: { limit?: number } | undefined, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminPopularTopics(params)
      return res
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch popular topics')
   }
})

// GET /api/admin/topics/:topic_id/comments
export const getAdminTopicComments = createAsyncThunk('adminTopics/getAdminTopicComments', async (args: { topic_id: number; page?: number; size?: number }, { rejectWithValue }) => {
   try {
      const res = await api.fetchAdminTopicComments(args.topic_id, { page: args.page, size: args.size })
      return { topic_id: args.topic_id, ...res }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to fetch topic comments')
   }
})

// POST /api/admin/topics
export const postAdminTopic = createAsyncThunk('adminTopics/postAdminTopic', async (payload: CreateTopicPayload, { rejectWithValue }) => {
   try {
      const res = await api.createAdminTopic(payload)
      return res
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to create topic')
   }
})

// PATCH /api/admin/topics/:topic_id
export const patchAdminTopic = createAsyncThunk('adminTopics/patchAdminTopic', async (args: { topic_id: number; payload: UpdateTopicPayload }, { rejectWithValue }) => {
   try {
      const res = await api.updateAdminTopic(args.topic_id, args.payload)
      return res
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to update topic')
   }
})

// DELETE /api/admin/topics/:topic_id
export const deleteAdminTopic = createAsyncThunk('adminTopics/deleteAdminTopic', async (topic_id: number, { rejectWithValue }) => {
   try {
      await api.deleteAdminTopic(topic_id)
      return topic_id
   } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Failed to delete topic')
   }
})

const adminTopicsSlice = createSlice({
   name: 'adminTopics',
   initialState,
   reducers: {
      resetAdminTopics(state) {
         state.list = emptyList<AdminTopic>()
         state.popular = []
         state.commentsByTopicId = {}
         state.selectedTopicId = null
         state.loading = { list: false, popular: false, comments: false, mutate: false }
         state.error = null
         state.lastFetchedAt = undefined
      },
      setSelectedTopicId(state, action: PayloadAction<number | null>) {
         state.selectedTopicId = action.payload
      },
   },
   extraReducers: (builder) => {
      builder
         // list
         .addCase(getAdminTopics.pending, (state) => {
            state.loading.list = true
            state.error = null
         })
         .addCase(getAdminTopics.fulfilled, (state, action) => {
            state.loading.list = false
            state.list = action.payload as ListResponse<AdminTopic>
            state.lastFetchedAt = new Date().toISOString()
         })
         .addCase(getAdminTopics.rejected, (state, action) => {
            state.loading.list = false
            state.error = String(action.payload || action.error.message || 'Failed to fetch admin topics')
         })

         // popular
         .addCase(getAdminPopularTopics.pending, (state) => {
            state.loading.popular = true
            state.error = null
         })
         .addCase(getAdminPopularTopics.fulfilled, (state, action) => {
            state.loading.popular = false
            state.popular = action.payload as AdminPopularItem[]
         })
         .addCase(getAdminPopularTopics.rejected, (state, action) => {
            state.loading.popular = false
            state.error = String(action.payload || action.error.message || 'Failed to fetch popular topics')
         })

         // comments
         .addCase(getAdminTopicComments.pending, (state) => {
            state.loading.comments = true
            state.error = null
         })
         .addCase(getAdminTopicComments.fulfilled, (state, action) => {
            state.loading.comments = false
            const { topic_id, items, page, size, total, totalPages } = action.payload as any
            state.commentsByTopicId[topic_id] = { items, page, size, total, totalPages }
         })
         .addCase(getAdminTopicComments.rejected, (state, action) => {
            state.loading.comments = false
            state.error = String(action.payload || action.error.message || 'Failed to fetch topic comments')
         })

         // create/update/delete
         .addCase(postAdminTopic.pending, (state) => {
            state.loading.mutate = true
            state.error = null
         })
         .addCase(postAdminTopic.fulfilled, (state, action) => {
            state.loading.mutate = false
            // 리스트 1페이지 기준이면 프론트 UX상 prepend가 자연스러움(정렬 정책에 따라 조정)
            state.list.items = [action.payload as AdminTopic, ...state.list.items]
            state.list.total += 1
         })
         .addCase(postAdminTopic.rejected, (state, action) => {
            state.loading.mutate = false
            state.error = String(action.payload || action.error.message || 'Failed to create topic')
         })

         .addCase(patchAdminTopic.pending, (state) => {
            state.loading.mutate = true
            state.error = null
         })
         .addCase(patchAdminTopic.fulfilled, (state, action) => {
            state.loading.mutate = false
            const updated = action.payload as AdminTopic
            state.list.items = state.list.items.map((t) => (t.topic_id === updated.topic_id ? updated : t))
            if (state.selectedTopicId === updated.topic_id) {
               // 선택된 토픽이 있으면 유지(상세 UI에서 참조할 때)
               state.selectedTopicId = updated.topic_id
            }
         })
         .addCase(patchAdminTopic.rejected, (state, action) => {
            state.loading.mutate = false
            state.error = String(action.payload || action.error.message || 'Failed to update topic')
         })

         .addCase(deleteAdminTopic.pending, (state) => {
            state.loading.mutate = true
            state.error = null
         })
         .addCase(deleteAdminTopic.fulfilled, (state, action) => {
            state.loading.mutate = false
            const id = action.payload as number
            state.list.items = state.list.items.filter((t) => t.topic_id !== id)
            state.list.total = Math.max(0, state.list.total - 1)
            if (state.selectedTopicId === id) state.selectedTopicId = null
            delete state.commentsByTopicId[id]
         })
         .addCase(deleteAdminTopic.rejected, (state, action) => {
            state.loading.mutate = false
            state.error = String(action.payload || action.error.message || 'Failed to delete topic')
         })
   },
})

export const { resetAdminTopics, setSelectedTopicId } = adminTopicsSlice.actions
export default adminTopicsSlice.reducer
