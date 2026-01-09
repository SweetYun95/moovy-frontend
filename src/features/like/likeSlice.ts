// moovy-frontend/src/features/like/likeSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import * as api from '@/services/api/likeApi'

// ───────────────── Types
export type LikeTarget = 'comment' | 'reply'

export type LikeEntry = {
   count: number
   liked: boolean
   loading: boolean
   error: string | null
}

export type LikeState = {
   // target별 캐시
   byCommentId: Record<number, LikeEntry>
   byReplyId: Record<number, LikeEntry>

   // 토글 중 상태 (중복 클릭 방지용)
   togglingComment: Record<number, boolean>
   togglingReply: Record<number, boolean>
}

const initialEntry: LikeEntry = {
   count: 0,
   liked: false,
   loading: false,
   error: null,
}

const initialState: LikeState = {
   byCommentId: {},
   byReplyId: {},
   togglingComment: {},
   togglingReply: {},
}

// ───────────────── Helpers
const ensureEntry = (bucket: Record<number, LikeEntry>, id: number) => {
   if (!bucket[id]) bucket[id] = { ...initialEntry }
   return bucket[id]
}

const getBucket = (state: LikeState, target: LikeTarget) => (target === 'comment' ? state.byCommentId : state.byReplyId)

const getTogglingBucket = (state: LikeState, target: LikeTarget) => (target === 'comment' ? state.togglingComment : state.togglingReply)

// ───────────────── Thunks

/**
 * 좋아요 카운트 조회
 * - 공개 API라 토큰 없어도 됨
 */
export const fetchLikeCountThunk = createAsyncThunk<{ target: LikeTarget; id: number; count: number }, { target: LikeTarget; id: number }>('like/fetchCount', async ({ target, id }) => {
   if (target === 'comment') {
      const res = await api.fetchCommentLikeCount(id)
      return { target, id, count: res.count }
   }
   const res = await api.fetchReplyLikeCount(id)
   return { target, id, count: res.count }
})

/**
 * 내가 좋아요 눌렀는지 체크
 * - requireAuth 걸려있어서 토큰 없으면 401/403 날 수 있음
 * - 컴포넌트에서 로그인 상태일 때만 호출하는 걸 추천
 */
export const checkLikeThunk = createAsyncThunk<{ target: LikeTarget; id: number; liked: boolean }, { target: LikeTarget; id: number }>('like/check', async ({ target, id }) => {
   if (target === 'comment') {
      const res = await api.checkCommentLike(id)
      return { target, id, liked: res.liked }
   }
   const res = await api.checkReplyLike(id)
   return { target, id, liked: res.liked }
})

/**
 * 좋아요 토글
 * - optimistic update(즉시 반영) + 실패 시 롤백
 */
export const toggleLikeThunk = createAsyncThunk<{ target: LikeTarget; id: number; liked: boolean }, { target: LikeTarget; id: number }>('like/toggle', async ({ target, id }) => {
   if (target === 'comment') {
      const res = await api.toggleCommentLike(id)
      return { target, id, liked: res.liked }
   }
   const res = await api.toggleReplyLike(id)
   return { target, id, liked: res.liked }
})

// ───────────────── Slice
const likeSlice = createSlice({
   name: 'like',
   initialState,
   reducers: {
      resetLikes(state) {
         Object.assign(state, initialState)
      },
      // 특정 타겟 캐시만 지우고 싶을 때(예: 페이지 이동 시)
      clearLikeCache(state, action: PayloadAction<{ target?: LikeTarget; id?: number } | undefined>) {
         const target = action.payload?.target
         const id = action.payload?.id

         // 전체 삭제
         if (!target && typeof id !== 'number') {
            state.byCommentId = {}
            state.byReplyId = {}
            state.togglingComment = {}
            state.togglingReply = {}
            return
         }

         // 타겟 전체 삭제
         if (target && typeof id !== 'number') {
            if (target === 'comment') {
               state.byCommentId = {}
               state.togglingComment = {}
            } else {
               state.byReplyId = {}
               state.togglingReply = {}
            }
            return
         }

         // 특정 id만 삭제
         if (target && typeof id === 'number') {
            const bucket = getBucket(state, target)
            const tBucket = getTogglingBucket(state, target)
            delete bucket[id]
            delete tBucket[id]
         }
      },
   },
   extraReducers: (builder) => {
      // ── fetch count
      builder.addCase(fetchLikeCountThunk.pending, (state, action) => {
         const { target, id } = action.meta.arg
         const bucket = getBucket(state, target)
         const entry = ensureEntry(bucket, id)
         entry.loading = true
         entry.error = null
      })
      builder.addCase(fetchLikeCountThunk.fulfilled, (state, action) => {
         const { target, id, count } = action.payload
         const bucket = getBucket(state, target)
         const entry = ensureEntry(bucket, id)
         entry.count = count
         entry.loading = false
         entry.error = null
      })
      builder.addCase(fetchLikeCountThunk.rejected, (state, action) => {
         const { target, id } = action.meta.arg
         const bucket = getBucket(state, target)
         const entry = ensureEntry(bucket, id)
         entry.loading = false
         entry.error = (action.error?.message as string) || 'FAILED_TO_FETCH_LIKE_COUNT'
      })

      // ── check like
      builder.addCase(checkLikeThunk.pending, (state, action) => {
         const { target, id } = action.meta.arg
         const bucket = getBucket(state, target)
         const entry = ensureEntry(bucket, id)
         entry.loading = true
         entry.error = null
      })
      builder.addCase(checkLikeThunk.fulfilled, (state, action) => {
         const { target, id, liked } = action.payload
         const bucket = getBucket(state, target)
         const entry = ensureEntry(bucket, id)
         entry.liked = liked
         entry.loading = false
         entry.error = null
      })
      builder.addCase(checkLikeThunk.rejected, (state, action) => {
         const { target, id } = action.meta.arg
         const bucket = getBucket(state, target)
         const entry = ensureEntry(bucket, id)
         entry.loading = false
         // 로그인 안 된 상태에서 호출하면 401/403이 날 수 있으니 에러는 남기되 UX는 컴포넌트에서 조절
         entry.error = (action.error?.message as string) || 'FAILED_TO_CHECK_LIKE'
      })

      // ── toggle like (optimistic)
      builder.addCase(toggleLikeThunk.pending, (state, action) => {
         const { target, id } = action.meta.arg
         const bucket = getBucket(state, target)
         const toggling = getTogglingBucket(state, target)

         toggling[id] = true

         const entry = ensureEntry(bucket, id)
         entry.error = null

         // optimistic: 현재 상태 기반으로 먼저 뒤집기
         const nextLiked = !entry.liked
         entry.liked = nextLiked
         entry.count = Math.max(0, entry.count + (nextLiked ? 1 : -1))
      })
      builder.addCase(toggleLikeThunk.fulfilled, (state, action) => {
         const { target, id, liked } = action.payload
         const bucket = getBucket(state, target)
         const toggling = getTogglingBucket(state, target)

         delete toggling[id]

         const entry = ensureEntry(bucket, id)
         // 서버 응답을 최종 진실로 동기화
         // (낙관적 업데이트와 동일하면 변화 없음)
         if (entry.liked !== liked) {
            // 불일치면 count도 보정
            entry.count = Math.max(0, entry.count + (liked ? 1 : -1))
            entry.liked = liked
         }
         entry.error = null
      })
      builder.addCase(toggleLikeThunk.rejected, (state, action) => {
         const { target, id } = action.meta.arg
         const bucket = getBucket(state, target)
         const toggling = getTogglingBucket(state, target)

         delete toggling[id]

         const entry = ensureEntry(bucket, id)
         // rollback: pending에서 뒤집었던 걸 되돌리기
         const rolledBackLiked = !entry.liked
         entry.liked = rolledBackLiked
         entry.count = Math.max(0, entry.count + (rolledBackLiked ? 1 : -1))

         entry.error = (action.error?.message as string) || 'FAILED_TO_TOGGLE_LIKE'
      })
   },
})

export const { resetLikes, clearLikeCache } = likeSlice.actions
export default likeSlice.reducer

// ───────────────── Selectors

export const selectLikeState = (s: RootState) => s.like

export const selectCommentLikeEntry = (commentId: number) => (s: RootState) => s.like.byCommentId[commentId] ?? initialEntry

export const selectReplyLikeEntry = (replyId: number) => (s: RootState) => s.like.byReplyId[replyId] ?? initialEntry

export const selectIsTogglingCommentLike = (commentId: number) => (s: RootState) => !!s.like.togglingComment[commentId]

export const selectIsTogglingReplyLike = (replyId: number) => (s: RootState) => !!s.like.togglingReply[replyId]
