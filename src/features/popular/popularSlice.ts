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
  nowPlaying: PopularMovieItem[]; // 현재 상영작
  loading: boolean;
  nowPlayingLoading: boolean;
  error: string | null;
  nowPlayingError: string | null;
  lastUpdatedAt: string | null; // 언제 가져왔는지 (선택)
};

const initialState: PopularState = {
  items: [],
  nowPlaying: [],
  loading: false,
  nowPlayingLoading: false,
  error: null,
  nowPlayingError: null,
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

// 현재 상영작 가져오기 (moovy-pipeline에서 수집한 데이터)
export const fetchNowPlayingMoviesThunk = createAsyncThunk(
  "popular/fetchNowPlaying",
  async () => {
    const list = await popularApi.getNowPlayingMovies();
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
    clearNowPlaying(state) {
      state.nowPlaying = [];
      state.nowPlayingLoading = false;
      state.nowPlayingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 인기 영화
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
      })
      // 현재 상영작
      .addCase(fetchNowPlayingMoviesThunk.pending, (state) => {
        state.nowPlayingLoading = true;
        state.nowPlayingError = null;
      })
      .addCase(
        fetchNowPlayingMoviesThunk.fulfilled,
        (state, action: PayloadAction<PopularMovieItem[]>) => {
          state.nowPlayingLoading = false;
          state.nowPlaying = action.payload;
        },
      )
      .addCase(fetchNowPlayingMoviesThunk.rejected, (state, action) => {
        state.nowPlayingLoading = false;
        state.nowPlayingError = action.error.message || "현재 상영작 조회 실패";
      });
  },
});

export const { clearPopular, clearNowPlaying } = popularSlice.actions;
export default popularSlice.reducer;

// Selectors
export const selectPopularItems = (state: RootState) => state.popular.items;
export const selectPopularLoading = (state: RootState) => state.popular.loading;
export const selectPopularError = (state: RootState) => state.popular.error;
export const selectPopularLastUpdatedAt = (state: RootState) =>
  state.popular.lastUpdatedAt;

// 현재 상영작 Selectors
export const selectNowPlayingItems = (state: RootState) => state.popular.nowPlaying;
export const selectNowPlayingLoading = (state: RootState) => state.popular.nowPlayingLoading;
export const selectNowPlayingError = (state: RootState) => state.popular.nowPlayingError;
