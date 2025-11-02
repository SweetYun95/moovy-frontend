// moovy-frontend/src/features/comments/commentCardsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getCommentCards,
  type CommentCard as CommentCardType,
} from "@/services/api/commentApi";

// 홈 카드 전용 상태
export type CommentCardsState = {
  loading: boolean;
  comments: CommentCardType[];
  error?: string | null;
};

const initialState: CommentCardsState = {
  loading: false,
  comments: [],
  error: null,
};

// 홈 카드 목록 로드 (레거시 /comment/list 사용)
export const fetchCommentCardsThunk = createAsyncThunk(
  "commentCards/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCommentCards();
      return data;
    } catch (error) {
      console.error("Comment API 호출 실패:", error);
      // 실패 시 임시 데이터 반환(기존 동작 유지)
      const tempData: CommentCardType[] = [
        {
          id: 1,
          username: "유저닉네임1",
          contentId: 1,
          comment:
            "정말 재미있는 영화였어요! 케이팝 아이돌들이 액션 히어로로 나오는 설정이 신선하고, 스토리도 탄탄해서 끝까지 몰입해서 봤습니다.",
          rating: 4.5,
          likes: 102,
          replies: 2,
        },
        {
          id: 2,
          username: "영화매니아",
          contentId: 2,
          comment:
            "예상보다 훨씬 재미있었습니다! 스토리 전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었어요.",
          rating: 4.0,
          likes: 89,
          replies: 5,
        },
        {
          id: 3,
          username: "드라마러버",
          contentId: 3,
          comment:
            "정치 드라마치고는 정말 현실적이고 몰입도가 높았습니다. 배우들의 연기도 훌륭하고, 스토리도 정치적 상황을 잘 반영한 것 같아요.",
          rating: 4.8,
          likes: 156,
          replies: 8,
        },
        {
          id: 4,
          username: "시네마팬",
          contentId: 5,
          comment:
            "지구가 위기에 처한 가운데, 우주를 탐험하는 과학자 팀이 새로운 행성을 찾아 인류를 구하기 위한 모험을 떠나는 SF 드라마.",
          rating: 4.7,
          likes: 234,
          replies: 15,
        },
        {
          id: 5,
          username: "액션러버",
          contentId: 6,
          comment:
            "배트맨이 조커의 완전한 무정부주의적 테러에 맞서 고담시티를 지키기 위한 치열한 싸움을 펼치는 슈퍼히어로 액션.",
          rating: 4.9,
          likes: 567,
          replies: 42,
        },
        {
          id: 6,
          username: "SF매니아",
          contentId: 7,
          comment:
            "꿈 속의 꿈 속으로 들어가 상대의 무의식에 아이디어를 심는 기술, 인셉션을 다룬 미래적 SF 스릴러 영화.",
          rating: 4.6,
          likes: 312,
          replies: 28,
        },
        {
          id: 7,
          username: "영화평론가",
          contentId: 9,
          comment:
            "반지하 주택에 살던 기택 가족이 상류층 박 사장 집에 취업하며 벌어지는 계급 간 갈등을 담은 블랙코미디 스릴러.",
          rating: 4.8,
          likes: 445,
          replies: 35,
        },
        {
          id: 8,
          username: "로맨스팬",
          contentId: 10,
          comment:
            "1912년 타이타닉 호에서 만난 상류층 레이디 로즈와 하층민 출신 잭의 금지된 사랑을 그린 로맨스 재난 영화.",
          rating: 4.4,
          likes: 289,
          replies: 19,
        },
        {
          id: 9,
          username: "애니메이션팬",
          contentId: 11,
          comment:
            "마법의 얼음 힘을 가진 엘사의 실수로 왕국이 겨울에 얼어붙자, 여동생 안나와 함께 왕국을 구하기 위해 떠나는 모험 이야기.",
          rating: 4.5,
          likes: 378,
          replies: 24,
        },
        {
          id: 10,
          username: "영화광유저",
          contentId: 4,
          comment:
            "토르의 묵직한 액션과 연출이 인상 깊었습니다. 마블 시네마틱 유니버스의 시작을 알리는 작품이라 더욱 의미가 있습니다.",
          rating: 4.2,
          likes: 156,
          replies: 8,
        },
        {
          id: 11,
          username: "액션중독",
          contentId: 6,
          comment:
            "하스 레저의 조کر 연기가 정말 압도적입니다. 영화사를 바꾼 최고의 악역 연기라고 생각합니다. 매번 봐도 새롭습니다.",
          rating: 5.0,
          likes: 789,
          replies: 67,
        },
        {
          id: 12,
          username: "SF마니아",
          contentId: 7,
          comment:
            "꿈 속의 꿈, 레이어별로 복잡하게 얽힌 스토리가 정말 놀랍습니다. 크리스토퍼 놀란 감독의 시그니처 영화네요!",
          rating: 4.7,
          likes: 423,
          replies: 31,
        },
      ];
      return tempData;
    }
  },
);

const commentCardsSlice = createSlice({
  name: "commentCards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentCardsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCommentCardsThunk.fulfilled,
        (state, action: PayloadAction<CommentCardType[]>) => {
          state.loading = false;
          state.comments = action.payload;
        },
      )
      .addCase(fetchCommentCardsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch comment cards";
      });
  },
});

export default commentCardsSlice.reducer;
