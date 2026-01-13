// moovy-frontend/src/features/comments/commentSlice.ts
//코멘트 전용 슬라이스
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as commentApi from '@/services/api/commentApi';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

// 홈페이지 코멘트 카드용 (레거시)
export type CommentCard = {
  id: number;
  username: string;
  contentId?: number;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
  created_at?: string; // 실시간 리뷰 정렬용
};

// 토픽별 코멘트용 (신규 API)
export type CommentAuthor = {
  user_id: number;
  name: string;
};

export type CommentItem = {
  comment_id: number;
  topic_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  User?: CommentAuthor;
  user?: CommentAuthor;
  rating?: number;
  likes?: number;
  replies?: number;
};

export type CommentBucket = {
  items: CommentItem[];
  loading: boolean;
  error: string | null;
};

// 초기 CommentBucket 객체 (메모이제이션용 상수)
const EMPTY_BUCKET: CommentBucket = {
  items: [],
  loading: false,
  error: null,
};

// 통합 상태 구조
export type CommentState = {
  // 토픽별 코멘트 목록 (모든 코멘트는 토픽별로 관리)
  byTopicId: Record<number, CommentBucket>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  topicError: string | null;
};

const initialState: CommentState = {
  byTopicId: {},
  creating: false,
  updating: false,
  deleting: false,
  topicError: null,
};

// ─────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────

export const fetchCommentsThunk = createAsyncThunk(
  'comments/fetchHome',
  async (_, { rejectWithValue }) => {
    try {
      const { getTodayPopularMovies } = await import('@/services/api/popularApi');
      const topics = await getTodayPopularMovies();
      
      if (!topics || topics.length === 0) {
        return {};
      }
      
      const commentPromises = topics.map(async (topic) => {
        try {
          const topicId = (topic as any).id || (topic as any).content_id || (topic as any).topic_id;
          if (!topicId) {
            return { topicId: null, comments: [] };
          }
          
          const comments = await commentApi.fetchComments(topicId, { limit: 10 });
          return { topicId, comments: comments || [] };
        } catch (err: any) {
          return { topicId: (topic as any).id || (topic as any).content_id || null, comments: [] };
        }
      });
      
      const results = await Promise.all(commentPromises);
      
      const groupedByTopic: Record<number, CommentItem[]> = {};
      results.forEach(({ topicId, comments }) => {
        if (topicId && comments && comments.length > 0) {
          const commentItems: CommentItem[] = comments.map((comment: any) => ({
            comment_id: comment.comment_id,
            topic_id: comment.topic_id || topicId,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            deleted_at: comment.deleted_at,
            User: comment.User || comment.user,
            likes: 0,
            replies: 0,
          }));
          
          groupedByTopic[topicId] = commentItems;
        }
      });
      
      return groupedByTopic;
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404 || status === 400) {
        return {};
      }
      console.error('Comment API 호출 실패:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch comments');
    }
  }
);

export const getCommentsByTopic = createAsyncThunk(
  'comments/getByTopic',
  async ({ topicId }: { topicId: number }, { rejectWithValue }) => {
    try {
      const data = await commentApi.fetchComments(topicId);
      return { topicId, items: data as CommentItem[] || [] };
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 400) {
        return { topicId, items: [] };
      }
      console.error('Comment API 호출 실패:', err);
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to fetch comments');
    }
  }
);

export const createCommentThunk = createAsyncThunk(
  'comments/create',
  async ({ topic_id, content }: { topic_id: number; content: string }, { rejectWithValue }) => {
    try {
      const data = await commentApi.createCommentV2({ topic_id, content });
      return data as CommentItem;
    } catch (err: any) {
      console.error('코멘트 작성 API 실패:', err);
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to create comment');
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  'comments/update',
  async ({ comment_id, content }: { comment_id: number; content: string }, { rejectWithValue }) => {
    try {
      const { comment } = await commentApi.updateCommentV2(comment_id, { content });
      return comment as CommentItem;
    } catch (err: any) {
      console.error('코멘트 수정 API 실패:', err);
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to update comment');
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  'comments/delete',
  async ({ comment_id }: { comment_id: number }, { rejectWithValue }) => {
    try {
      await commentApi.deleteCommentV2(comment_id);
      return { comment_id };
    } catch (err: any) {
      console.error('코멘트 삭제 API 실패:', err);
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to delete comment');
    }
  }
);

// ===== Slice =====
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments(state, action: PayloadAction<{ topicId?: number } | undefined>) {
      const topicId = action.payload?.topicId;
      if (typeof topicId === 'number') delete state.byTopicId[topicId];
      else state.byTopicId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        const groupedByTopic = action.payload as Record<number, CommentItem[]>;
        Object.entries(groupedByTopic).forEach(([topicId, comments]) => {
          const topicIdNum = Number(topicId);
          state.byTopicId[topicIdNum] = {
            items: comments,
            loading: false,
            error: null,
          };
        });
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        console.error('commentSlice - fetchCommentsThunk.rejected:', action.error);
        Object.keys(state.byTopicId).forEach((topicIdStr) => {
          const topicId = Number(topicIdStr);
          if (state.byTopicId[topicId]) {
            state.byTopicId[topicId].loading = false;
            state.byTopicId[topicId].error = action.error.message || '코멘트 조회 실패';
          }
        });
      });

    builder
      .addCase(getCommentsByTopic.pending, (state, action) => {
        const { topicId } = action.meta.arg;
        if (!state.byTopicId[topicId]) {
          state.byTopicId[topicId] = { items: [], loading: true, error: null };
        } else {
          state.byTopicId[topicId].loading = true;
          state.byTopicId[topicId].error = null;
        }
      })
      .addCase(getCommentsByTopic.fulfilled, (state, action) => {
        const { topicId, items } = action.payload;
        state.byTopicId[topicId] = {
          items,
          loading: false,
          error: null,
        };
      })
      .addCase(getCommentsByTopic.rejected, (state, action) => {
        const { topicId } = action.meta.arg;
        if (state.byTopicId[topicId]) {
          state.byTopicId[topicId].loading = false;
          state.byTopicId[topicId].error = action.error.message || '코멘트 조회 실패';
        }
      });

    builder
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        const newComment = action.payload;
        const topicId = newComment.topic_id;
        if (!state.byTopicId[topicId]) {
          state.byTopicId[topicId] = { items: [], loading: false, error: null };
        }
        state.byTopicId[topicId].items.unshift(newComment);
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        console.error('commentSlice - createCommentThunk.rejected:', action.error);
      });

    builder
      .addCase(updateCommentThunk.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const topicId = updatedComment.topic_id;
        if (state.byTopicId[topicId]) {
          const index = state.byTopicId[topicId].items.findIndex(
            (c) => c.comment_id === updatedComment.comment_id
          );
          if (index !== -1) {
            state.byTopicId[topicId].items[index] = updatedComment;
          }
        }
      })
      .addCase(updateCommentThunk.rejected, (state, action) => {
        console.error('commentSlice - updateCommentThunk.rejected:', action.error);
      });

    builder
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        const { comment_id } = action.payload;
        Object.keys(state.byTopicId).forEach((topicIdStr) => {
          const topicId = Number(topicIdStr);
          if (state.byTopicId[topicId]) {
            state.byTopicId[topicId].items = state.byTopicId[topicId].items.filter(
              (c) => c.comment_id !== comment_id
            );
          }
        });
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        console.error('commentSlice - deleteCommentThunk.rejected:', action.error);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

// ===== Selectors =====
export type RootCommentsState = { comments: CommentState };
export const selectCommentsState = (s: RootCommentsState) => s.comments;
export const selectCommentsBucketByTopic = createSelector(
  [selectCommentsState, (_: RootCommentsState, topicId: number) => topicId],
  (comments, topicId): CommentBucket =>
    comments.byTopicId[topicId] || EMPTY_BUCKET
);
export const selectCommentsByTopic = (s: RootCommentsState, topicId: number) =>
  s.comments.byTopicId[topicId]?.items || [];
export const selectCommentsLoading = (s: RootCommentsState, topicId: number) =>
  s.comments.byTopicId[topicId]?.loading || false;
export const selectCommentsError = (s: RootCommentsState, topicId: number) =>
  s.comments.byTopicId[topicId]?.error || null;
// 홈페이지용: 모든 토픽의 코멘트를 합쳐서 반환
export const selectAllComments = (s: RootCommentsState): CommentItem[] => {
  const allComments: CommentItem[] = [];
  Object.values(s.comments.byTopicId).forEach((bucket) => {
    allComments.push(...bucket.items);
  });
  return allComments;
};

// 홈페이지용: 모든 토픽의 코멘트 로딩 상태 (하나라도 로딩 중이면 true)
export const selectAllCommentsLoading = (s: RootCommentsState): boolean => {
  return Object.values(s.comments.byTopicId).some((bucket) => bucket.loading);
};
