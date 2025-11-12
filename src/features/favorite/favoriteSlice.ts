// moovy-frontend/src/features/favorite/favoriteSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store"; // 프로젝트 경로에 맞게 조정
import * as api from "@/services/api/favoriteApi";
import type {
  FavoriteItem,
  FavoriteListResponse,
} from "@/services/api/favoriteApi";

// ───────────────── Types
export type FavoriteState = {
  items: FavoriteItem[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;

  toggling: Record<number, boolean>; // contentId → 진행중 여부
  removing: Record<number, boolean>; // contentId → 진행중 여부
  invalidated: boolean; // 토글로 인해 목록 재조회가 필요함
};

const initialState: FavoriteState = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,

  toggling: {},
  removing: {},
  invalidated: false,
};

// ───────────────── Thunks
export const fetchFavorites = createAsyncThunk<
  FavoriteListResponse,
  { page?: number; limit?: number } | undefined
>("favorite/fetchFavorites", async (params) => {
  return await api.getFavorites(params);
});

export const toggleFavoriteThunk = createAsyncThunk<
  { contentId: number; isFavorite: boolean },
  number
>("favorite/toggleFavorite", async (contentId: number) => {
  const res = await api.toggleFavorite(contentId);
  return { contentId, isFavorite: res.isFavorite };
});

export const removeFavoriteThunk = createAsyncThunk<
  { contentId: number },
  number
>("favorite/removeFavorite", async (contentId: number) => {
  await api.removeFavorite(contentId);
  return { contentId };
});

// ───────────────── Slice
const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    resetFavorites(state) {
      Object.assign(state, initialState);
    },
    // 리스트 페이지 초점에서 토글 후 재조회가 필요할 때 사용
    clearInvalidation(state) {
      state.invalidated = false;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload || 1);
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.max(1, action.payload || 10);
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchFavorites.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFavorites.fulfilled, (state, action) => {
      const { page, limit, total, items } = action.payload;
      state.loading = false;
      state.page = page;
      state.limit = limit;
      state.total = total;
      state.items = items;
      state.invalidated = false;
    });
    builder.addCase(fetchFavorites.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.error?.message as string) || "FAILED_TO_FETCH_FAVORITES";
    });

    // toggle
    builder.addCase(toggleFavoriteThunk.pending, (state, action) => {
      const id = action.meta.arg;
      state.toggling[id] = true;
      state.error = null;
    });
    builder.addCase(toggleFavoriteThunk.fulfilled, (state, action) => {
      const { contentId, isFavorite } = action.payload;
      delete state.toggling[contentId];

      // 목록 화면에서의 UX 전략:
      // - 해제(false): 목록에 있으면 즉시 제거 (optimistic)
      // - 추가(true): 목록에 없을 수 있으므로 invalidated 플래그만 세팅 → 상단에서 재조회
      if (!isFavorite) {
        const idx = state.items.findIndex((it) => it.content_id === contentId);
        if (idx >= 0) {
          state.items.splice(idx, 1);
          state.total = Math.max(0, state.total - 1);
        }
      } else {
        state.invalidated = true;
      }
    });
    builder.addCase(toggleFavoriteThunk.rejected, (state, action) => {
      const id = action.meta.arg;
      delete state.toggling[id];
      state.error =
        (action.error?.message as string) || "FAILED_TO_TOGGLE_FAVORITE";
    });

    // remove
    builder.addCase(removeFavoriteThunk.pending, (state, action) => {
      const id = action.meta.arg;
      state.removing[id] = true;
      state.error = null;
    });
    builder.addCase(removeFavoriteThunk.fulfilled, (state, action) => {
      const { contentId } = action.payload;
      delete state.removing[contentId];
      const idx = state.items.findIndex((it) => it.content_id === contentId);
      if (idx >= 0) {
        state.items.splice(idx, 1);
        state.total = Math.max(0, state.total - 1);
      }
    });
    builder.addCase(removeFavoriteThunk.rejected, (state, action) => {
      const id = action.meta.arg;
      delete state.removing[id];
      state.error =
        (action.error?.message as string) || "FAILED_TO_REMOVE_FAVORITE";
    });
  },
});

export const { resetFavorites, clearInvalidation, setPage, setLimit } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;

// ───────────────── Selectors
export const selectFavorites = (s: RootState) => s.favorite.items;
export const selectFavoritesLoading = (s: RootState) => s.favorite.loading;
export const selectFavoritesError = (s: RootState) => s.favorite.error;
export const selectFavoritesPage = (s: RootState) => s.favorite.page;
export const selectFavoritesLimit = (s: RootState) => s.favorite.limit;
export const selectFavoritesTotal = (s: RootState) => s.favorite.total;
export const selectFavoriteToggling = (id: number) => (s: RootState) =>
  !!s.favorite.toggling[id];
export const selectFavoriteRemoving = (id: number) => (s: RootState) =>
  !!s.favorite.removing[id];
export const selectFavoritesInvalidated = (s: RootState) =>
  s.favorite.invalidated;
