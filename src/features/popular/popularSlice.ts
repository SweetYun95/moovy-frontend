// moovy-frontend/src/features/popular/popularSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import * as popularApi from "@/services/api/popularApi";
import type { PopularMovieItem } from "@/services/api/popularApi";

type PopularState = {
  items: PopularMovieItem[];
  loading: boolean;
  error: string | null;
  lastUpdatedAt: string | null; // 언제 가져왔는지 (선택)
};

const initialState: PopularState = {
  items: [],
  loading: false,
  error: null,
  lastUpdatedAt: null,
};

// 오늘자 인기 영화 가져오기
export const fetchTodayPopularMoviesThunk = createAsyncThunk(
  "popular/fetchToday",
  async () => {
    const list = await popularApi.getTodayPopularMovies();
    return list;
  },
);

const popularSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {
    clearPopular(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.lastUpdatedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayPopularMoviesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTodayPopularMoviesThunk.fulfilled,
        (state, action: PayloadAction<PopularMovieItem[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.lastUpdatedAt = new Date().toISOString();
        },
      )
      .addCase(fetchTodayPopularMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "인기 영화 조회 실패";
      });
  },
});

export const { clearPopular } = popularSlice.actions;
export default popularSlice.reducer;

// Selectors
export const selectPopularItems = (state: RootState) => state.popular.items;
export const selectPopularLoading = (state: RootState) => state.popular.loading;
export const selectPopularError = (state: RootState) => state.popular.error;
export const selectPopularLastUpdatedAt = (state: RootState) =>
  state.popular.lastUpdatedAt;
