// moovy-frontend/src/features/content/contentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Topic as ContentCardType } from "@/services/api/topicApi";

export type ContentState = {
  loading: boolean;
  contents: ContentCardType[];
  error?: string | null;
};

const initialState: ContentState = {
  loading: false,
  contents: [],
  error: null,
};

export const fetchContentsThunk = createAsyncThunk(
  "content/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { getAdminTopics } = await import('@/services/api/topicApi');
      const topicsResponse = await getAdminTopics({
        main: 'current',
        filter: 'all',
        page: 1,
        size: 100,
      });
      
      const contents: ContentCardType[] = topicsResponse.data.items
        .filter(item => item.video)
        .map((item) => {
          const video = item.video!;
          const posterPath = video.poster_path || '';
          const imageUrl = posterPath && !posterPath.startsWith('http')
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : posterPath;

          return {
            id: video.content_id,
            title: video.title || '',
            englishTitle: '',
            images: imageUrl ? [imageUrl] : [],
            runtime: '',
            ageRating: 'all',
            synopsis: video.synopsis || '',
            releaseDate: video.release_date || '',
            genre: video.genre || '',
            category: '영화',
            country: '',
            year: video.release_date ? new Date(video.release_date).getFullYear().toString() : '',
            imageUrl,
            overallRating: 0,
            createdAt: item.start_at || '',
            updatedAt: item.end_at || '',
          };
        });
      
      return contents;
    } catch (error) {
      console.error("Content API 호출 실패:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch contents");
    }
  },
);

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContentsThunk.fulfilled,
        (state, action: PayloadAction<ContentCardType[]>) => {
          state.loading = false;
          state.contents = action.payload;
        },
      )
      .addCase(fetchContentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contents";
      });
  },
});

// Selectors
export const selectContents = (state: RootState) => state.content.contents;
export const selectContentsLoading = (state: RootState) => state.content.loading;
export const selectContentsError = (state: RootState) => state.content.error;

export default contentSlice.reducer;
