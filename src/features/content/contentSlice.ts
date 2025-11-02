// moovy-frontend/src/features/content/contentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getTopics,
  type Topic as ContentCardType,
} from "@/services/api/topicApi";
import { getCommentCards } from "@/services/api/commentApi";

// ------------------------------------------------------------
// State 타입 정의
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// AsyncThunk: 컨텐츠 + 코멘트 평점 병렬 로드
// ------------------------------------------------------------
export const fetchContentsThunk = createAsyncThunk(
  "contents/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // 컨텐츠 목록과 코멘트 카드 목록을 병렬로 호출
      const [topicsResult, commentsResult] = await Promise.allSettled([
        getTopics(),
        getCommentCards(),
      ]);

      // Topics 결과 처리
      const topicsList =
        topicsResult.status === "fulfilled"
          ? (topicsResult.value.list as ContentCardType[])
          : [];

      // Comments 결과 처리
      const commentCards =
        commentsResult.status === "fulfilled" ? commentsResult.value : [];

      // 컨텐츠별 평균 평점 계산
      const contentsWithRating = topicsList.map((content) => {
        const related = commentCards.filter((c) => c.contentId === content.id);

        if (related.length === 0) {
          return { ...content, overallRating: 0 };
        }

        const avg =
          related.reduce((sum, c) => sum + c.rating, 0) / related.length;
        return { ...content, overallRating: Number(avg.toFixed(1)) };
      });

      return contentsWithRating;
    } catch (error) {
      console.error("콘텐츠 로드 실패:", error);
      return rejectWithValue(
        "콘텐츠 및 코멘트 데이터를 불러오는 중 오류가 발생했습니다.",
      );
    }
  },
);

// ------------------------------------------------------------
// Slice 정의
// ------------------------------------------------------------
const contentsSlice = createSlice({
  name: "contents", // ✅ 이름 통일 (복수형)
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
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "콘텐츠 데이터를 불러오지 못했습니다.";
      });
  },
});

export default contentsSlice.reducer;
