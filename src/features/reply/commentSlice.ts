// moovy-frontend/src/features/reply/commentSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as commentApi from '../../services/api/commentApi'

// ── Types
export type CommentAuthor = {
   user_id: number
   name: string
}

export type CommentItem = {
   comment_id: number
   topic_id: number
   user_id: number
   content: string
   created_at?: string
   updated_at?: string
   deleted_at?: string | null
   User?: CommentAuthor
   user?: CommentAuthor
}

export type CommentBucket = {
   items: CommentItem[]
   loading: boolean
   error: string | null
}

export type CommentState = {
   byTopicId: Record<number, CommentBucket>
   creating: boolean
   updating: boolean
   deleting: boolean
   error: string | null
}

const initialState: CommentState = {
   byTopicId: {},
   creating: false,
   updating: false,
   deleting: false,
   error: null,
}

// ── Thunks (신규 /api/comments/* 사용)
export const getCommentsByTopic = createAsyncThunk('comments/getByTopic', async ({ topicId }: { topicId: number }, { rejectWithValue }) => {
   try {
      const data = await commentApi.fetchComments(topicId)
      return { topicId, items: data as CommentItem[] }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 조회 실패' })
   }
})

export const createCommentThunk = createAsyncThunk('comments/create', async ({ topic_id, content }: { topic_id: number; content: string }, { rejectWithValue }) => {
   try {
      const data = await commentApi.createCommentV2({ topic_id, content })
      return data as CommentItem
   } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 작성 실패' })
   }
})

export const updateCommentThunk = createAsyncThunk('comments/update', async ({ comment_id, content }: { comment_id: number; content: string }, { rejectWithValue }) => {
   try {
      const { comment } = await commentApi.updateCommentV2(comment_id, { content })
      return comment as CommentItem
   } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 수정 실패' })
   }
})

export const deleteCommentThunk = createAsyncThunk('comments/delete', async ({ comment_id }: { comment_id: number }, { rejectWithValue }) => {
   try {
      await commentApi.deleteCommentV2(comment_id)
      return { comment_id }
   } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 삭제 실패' })
   }
})

// ── Slice
const commentSlice = createSlice({
   name: 'comments',
   initialState,
   reducers: {
      clearComments(state, action: PayloadAction<{ topicId?: number } | undefined>) {
         const topicId = action.payload?.topicId
         if (typeof topicId === 'number') delete state.byTopicId[topicId]
         else state.byTopicId = {}
      },
   },
   extraReducers: (builder) => {
      // 조회
      builder
         .addCase(getCommentsByTopic.pending, (state, action) => {
            const { topicId } = action.meta.arg as { topicId: number }
            state.byTopicId[topicId] ??= { items: [], loading: false, error: null }
            state.byTopicId[topicId].loading = true
            state.byTopicId[topicId].error = null
         })
         .addCase(getCommentsByTopic.fulfilled, (state, action) => {
            const { topicId, items } = action.payload as { topicId: number; items: CommentItem[] }
            state.byTopicId[topicId] = { items, loading: false, error: null }
         })
         .addCase(getCommentsByTopic.rejected, (state, action) => {
            const { topicId } = action.meta.arg as { topicId: number }
            state.byTopicId[topicId] ??= { items: [], loading: false, error: null }
            state.byTopicId[topicId].loading = false
            state.byTopicId[topicId].error = (action.payload as any)?.message || '코멘트 조회 실패'
         })

      // 작성
      builder
         .addCase(createCommentThunk.pending, (state) => {
            state.creating = true
            state.error = null
         })
         .addCase(createCommentThunk.fulfilled, (state, action: PayloadAction<CommentItem>) => {
            state.creating = false
            const item = action.payload
            const tId = item.topic_id
            state.byTopicId[tId] ??= { items: [], loading: false, error: null }
            state.byTopicId[tId].items.unshift(item) // 최신 우선
         })
         .addCase(createCommentThunk.rejected, (state, action) => {
            state.creating = false
            state.error = (action.payload as any)?.message || '코멘트 작성 실패'
         })

      // 수정
      builder
         .addCase(updateCommentThunk.pending, (state) => {
            state.updating = true
            state.error = null
         })
         .addCase(updateCommentThunk.fulfilled, (state, action: PayloadAction<CommentItem>) => {
            state.updating = false
            const updated = action.payload
            const tId = updated.topic_id
            const list = state.byTopicId[tId]?.items
            if (list) {
               const idx = list.findIndex((c) => c.comment_id === updated.comment_id)
               if (idx !== -1) list[idx] = { ...list[idx], ...updated }
            }
         })
         .addCase(updateCommentThunk.rejected, (state, action) => {
            state.updating = false
            state.error = (action.payload as any)?.message || '코멘트 수정 실패'
         })

      // 삭제
      builder
         .addCase(deleteCommentThunk.pending, (state) => {
            state.deleting = true
            state.error = null
         })
         .addCase(deleteCommentThunk.fulfilled, (state, action: PayloadAction<{ comment_id: number }>) => {
            state.deleting = false
            const { comment_id } = action.payload
            // 어떤 topicId인지 모를 수 있으므로 전체 스캔(간단/안전)
            for (const tIdStr of Object.keys(state.byTopicId)) {
               const bucket = state.byTopicId[Number(tIdStr)]
               bucket.items = bucket.items.filter((c) => c.comment_id !== comment_id)
            }
         })
         .addCase(deleteCommentThunk.rejected, (state, action) => {
            state.deleting = false
            state.error = (action.payload as any)?.message || '코멘트 삭제 실패'
         })
   },
})

export const { clearComments } = commentSlice.actions
export default commentSlice.reducer

// ── Selectors
export type RootCommentsState = { comments: CommentState }
export const selectCommentsState = (s: RootCommentsState) => s.comments
export const selectCommentsByTopic = (s: RootCommentsState, topicId: number) => s.comments.byTopicId[topicId]?.items || []
export const selectCommentsLoading = (s: RootCommentsState, topicId: number) => s.comments.byTopicId[topicId]?.loading || false
export const selectCommentsError = (s: RootCommentsState, topicId: number) => s.comments.byTopicId[topicId]?.error || null
