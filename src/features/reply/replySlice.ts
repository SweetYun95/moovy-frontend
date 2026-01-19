// moovy-frontend/src/features/reply/replySlice.ts
//댓글 전용 슬라이스
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../services/api/replyApi";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface ReplyAuthor {
  user_id: number;
  name: string;
}

export interface Reply {
  reply_id: number;
  comment_id: number;
  user_id: number;
  content: string;
  // timestamps (underscored)
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  // include(User)로 들어오는 경우
  User?: ReplyAuthor;
  user?: ReplyAuthor; // 혹시 백엔드에서 소문자 키로 올 수 있으니 보강
}

export interface RepliesMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface RepliesBucket {
  items: Reply[];
  meta: RepliesMeta | null;
  loading: boolean;
  error: string | null;
}

export interface RepliesState {
  byCommentId: Record<number, RepliesBucket>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

// ─────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────
const initialState: RepliesState = {
  byCommentId: {},
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

// ─────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────
export const getRepliesByComment = createAsyncThunk(
  "replies/getByComment",
  async (
    {
      commentId,
      page = 1,
      size = 20,
    }: { commentId: number; page?: number; size?: number },
    { rejectWithValue },
  ) => {
    try {
      // api.fetchReplies는 res.data를 반환하도록 구현되어 있음
      const data: { items: Reply[]; meta: RepliesMeta } =
        await api.fetchReplies(commentId, { page, size });
      return { commentId, ...data };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || { message: "대댓글 조회 실패" },
      );
    }
  },
);

export const createReplyThunk = createAsyncThunk(
  "replies/create",
  async (
    { comment_id, content }: { comment_id: number; content: string },
    { rejectWithValue },
  ) => {
    try {
      const data: Reply = await api.createReply({ comment_id, content });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || { message: "대댓글 작성 실패" },
      );
    }
  },
);

export const updateReplyThunk = createAsyncThunk(
  "replies/update",
  async (
    { reply_id, content }: { reply_id: number; content: string },
    { rejectWithValue },
  ) => {
    try {
      // 백엔드 응답: { message, reply }
      const data: { message: string; reply: Reply } = await api.updateReply(
        reply_id,
        { content },
      );
      return data.reply;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || { message: "대댓글 수정 실패" },
      );
    }
  },
);

export const deleteReplyThunk = createAsyncThunk(
  "replies/delete",
  async ({ reply_id }: { reply_id: number }, { rejectWithValue }) => {
    try {
      await api.deleteReply(reply_id);
      return { reply_id };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || { message: "대댓글 삭제 실패" },
      );
    }
  },
);

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────
const repliesSlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    clearReplies(
      state,
      action: PayloadAction<{ commentId?: number } | undefined>,
    ) {
      const commentId = action.payload?.commentId;
      if (typeof commentId === "number") {
        delete state.byCommentId[commentId];
      } else {
        state.byCommentId = {};
      }
    },
  },
  extraReducers: (builder) => {
    // 조회
    builder
      .addCase(getRepliesByComment.pending, (state, action) => {
        const { commentId } = action.meta.arg;
        state.byCommentId[commentId] ??= {
          items: [],
          meta: null,
          loading: false,
          error: null,
        };
        state.byCommentId[commentId].loading = true;
        state.byCommentId[commentId].error = null;
      })
      .addCase(getRepliesByComment.fulfilled, (state, action) => {
        const { commentId, items, meta } = action.payload as {
          commentId: number;
          items: Reply[];
          meta: RepliesMeta;
        };
        state.byCommentId[commentId] = {
          items,
          meta,
          loading: false,
          error: null,
        };
      })
      .addCase(getRepliesByComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg as { commentId: number };
        state.byCommentId[commentId] ??= {
          items: [],
          meta: null,
          loading: false,
          error: null,
        };
        state.byCommentId[commentId].loading = false;
        state.byCommentId[commentId].error =
          (action.payload as any)?.message || "대댓글 조회 실패";
      });

    // 생성
    builder
      .addCase(createReplyThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(
        createReplyThunk.fulfilled,
        (state, action: PayloadAction<Reply>) => {
          state.creating = false;
          const reply = action.payload;
          const cId = reply.comment_id;
          state.byCommentId[cId] ??= {
            items: [],
            meta: null,
            loading: false,
            error: null,
          };
          state.byCommentId[cId].items.push(reply);
          if (state.byCommentId[cId].meta)
            state.byCommentId[cId].meta!.total += 1;
        },
      )
      .addCase(createReplyThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as any)?.message || "대댓글 작성 실패";
      });

    // 수정
    builder
      .addCase(updateReplyThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(
        updateReplyThunk.fulfilled,
        (state, action: PayloadAction<Reply>) => {
          state.updating = false;
          const updated = action.payload;
          const cId = updated.comment_id;
          const list = state.byCommentId[cId]?.items;
          if (list) {
            const idx = list.findIndex((r) => r.reply_id === updated.reply_id);
            if (idx !== -1) list[idx] = { ...list[idx], ...updated };
          }
        },
      )
      .addCase(updateReplyThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = (action.payload as any)?.message || "대댓글 수정 실패";
      });

    // 삭제
    builder
      .addCase(deleteReplyThunk.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(
        deleteReplyThunk.fulfilled,
        (state, action: PayloadAction<{ reply_id: number }>) => {
          state.deleting = false;
          const { reply_id } = action.payload;
          for (const cIdStr of Object.keys(state.byCommentId)) {
            const cId = Number(cIdStr);
            const bucket = state.byCommentId[cId];
            const before = bucket.items.length;
            bucket.items = bucket.items.filter((r) => r.reply_id !== reply_id);
            if (bucket.meta && bucket.items.length !== before) {
              bucket.meta.total = Math.max(0, bucket.meta.total - 1);
            }
          }
        },
      )
      .addCase(deleteReplyThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = (action.payload as any)?.message || "대댓글 삭제 실패";
      });
  },
});

export const { clearReplies } = repliesSlice.actions;
export default repliesSlice.reducer;

// ─────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────
// RootState는 app/store.ts에서 import 가능
import type { RootState } from "@/app/store";

export const selectRepliesState = (state: RootState) => state.replies;

export const selectRepliesByComment = (
  state: RootState,
  commentId: number,
): Reply[] => state.replies.byCommentId[commentId]?.items || [];

export const selectRepliesMeta = (
  state: RootState,
  commentId: number,
): RepliesMeta | null => state.replies.byCommentId[commentId]?.meta || null;

export const selectRepliesLoading = (
  state: RootState,
  commentId: number,
): boolean => state.replies.byCommentId[commentId]?.loading || false;
