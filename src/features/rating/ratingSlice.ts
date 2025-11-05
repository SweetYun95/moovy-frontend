// moovy-frontend/src/features/rating/ratingSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootReducer } from "@/app/rootReducer";
import * as api from "@/services/api/ratingApi";

export type RatingBucket = {
  content_id: number;
  count: number;
  avg: number;
  myPoint: number | null;
  loading: boolean;
  error: string | null;
};

export type RatingState = {
  byContentId: Record<number, RatingBucket>;
};

const initialState: RatingState = {
  byContentId: {},
};

// ── Thunks
export const fetchRatingSummary = createAsyncThunk(
  "rating/fetchRatingSummary",
  async (contentId: number) => {
    const data = await api.getRatingSummary(contentId);
    return data;
  },
);

export const upsertMyRating = createAsyncThunk(
  "rating/upsertMyRating",
  async ({ contentId, point }: { contentId: number; point: number }) => {
    const data = await api.upsertRating(contentId, point);
    return data;
  },
);

export const deleteMyRating = createAsyncThunk(
  "rating/deleteMyRating",
  async (contentId: number) => {
    const data = await api.deleteMyRating(contentId);
    return data;
  },
);

// ── Slice
const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    // (옵션) 낙관적 업데이트 훅
    setMyPointOptimistic(
      state,
      action: PayloadAction<{ contentId: number; point: number | null }>,
    ) {
      const { contentId, point } = action.payload;
      const bucket = state.byContentId[contentId];
      if (bucket) bucket.myPoint = point;
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchRatingSummary.pending, (state, action) => {
        const contentId = action.meta.arg;
        const prev = state.byContentId[contentId];
        state.byContentId[contentId] = {
          content_id: contentId,
          count: prev?.count ?? 0,
          avg: prev?.avg ?? 0,
          myPoint: prev?.myPoint ?? null,
          loading: true,
          error: null,
        };
      })
      .addCase(fetchRatingSummary.fulfilled, (state, action) => {
        const d = action.payload;
        state.byContentId[d.content_id] = {
          content_id: d.content_id,
          count: d.count,
          avg: d.avg,
          myPoint: d.myPoint,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchRatingSummary.rejected, (state, action) => {
        const contentId = action.meta.arg;
        const bucket = state.byContentId[contentId];
        if (bucket) {
          bucket.loading = false;
          bucket.error =
            (action.error?.message as string) ?? "FAILED_TO_FETCH_RATING";
        }
      });

    // upsert
    builder
      .addCase(upsertMyRating.pending, (state, action) => {
        const { contentId } = action.meta.arg;
        const bucket = state.byContentId[contentId];
        if (bucket) bucket.loading = true;
      })
      .addCase(upsertMyRating.fulfilled, (state, action) => {
        const d = action.payload;
        state.byContentId[d.content_id] = {
          content_id: d.content_id,
          count: d.count,
          avg: d.avg,
          myPoint: d.myPoint,
          loading: false,
          error: null,
        };
      })
      .addCase(upsertMyRating.rejected, (state, action) => {
        const { contentId } = action.meta.arg;
        const bucket = state.byContentId[contentId];
        if (bucket) {
          bucket.loading = false;
          bucket.error =
            (action.error?.message as string) ?? "FAILED_TO_UPSERT_RATING";
        }
      });

    // delete
    builder
      .addCase(deleteMyRating.pending, (state, action) => {
        const contentId = action.meta.arg;
        const bucket = state.byContentId[contentId];
        if (bucket) bucket.loading = true;
      })
      .addCase(deleteMyRating.fulfilled, (state, action) => {
        const d = action.payload;
        state.byContentId[d.content_id] = {
          content_id: d.content_id,
          count: d.count,
          avg: d.avg,
          myPoint: d.myPoint, // 보통 null
          loading: false,
          error: null,
        };
      })
      .addCase(deleteMyRating.rejected, (state, action) => {
        const contentId = action.meta.arg;
        const bucket = state.byContentId[contentId];
        if (bucket) {
          bucket.loading = false;
          bucket.error =
            (action.error?.message as string) ?? "FAILED_TO_DELETE_RATING";
        }
      });
  },
});

export const { setMyPointOptimistic } = ratingSlice.actions;
export default ratingSlice.reducer;

// ── Selectors
export const selectRatingBucket =
  (contentId: number) =>
  (state: RootReducer): RatingBucket | undefined =>
    state.rating.byContentId[contentId];
