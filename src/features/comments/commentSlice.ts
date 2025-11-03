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
  // 홈페이지 코멘트 카드 목록
  homeComments: CommentCard[];
  homeLoading: boolean;
  homeError: string | null;

  // 토픽별 코멘트 목록
  byTopicId: Record<number, CommentBucket>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  topicError: string | null;
};

const initialState: CommentState = {
  homeComments: [],
  homeLoading: false,
  homeError: null,
  byTopicId: {},
  creating: false,
  updating: false,
  deleting: false,
  topicError: null,
};

// ─────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────

// 홈페이지 코멘트 카드 조회
export const fetchCommentsThunk = createAsyncThunk(
  'comments/fetchHome',
  async (_, { rejectWithValue }) => {
    try {
      const data = await commentApi.getCommentCards();
      return data as CommentCard[];
    } catch (error) {
      console.error('Comment API 호출 실패:', error);
      const tempData: CommentCard[] = [
        {
          id: 1,
          username: '유저닉네임1',
          contentId: 1,
          comment: '정말 재미있는 영화였어요! 케이팝 아이돌들이 액션 히어로로 나오는 설정이 신선하고, 스토리도 탄탄해서 끝까지 몰입해서 봤습니다.',
          rating: 4.5,
          likes: 102,
          replies: 2,
        },
        {
          id: 2,
          username: '영화매니아',
          contentId: 2,
          comment: '예상보다 훨씬 재미있었습니다! 스토리 전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었어요.',
          rating: 4.0,
          likes: 89,
          replies: 5,
        },
        {
          id: 3,
          username: '드라마러버',
          contentId: 3,
          comment: '정치 드라마치고는 정말 현실적이고 몰입도가 높았습니다. 배우들의 연기도 훌륭하고, 스토리도 정치적 상황을 잘 반영한 것 같아요.',
          rating: 4.8,
          likes: 156,
          replies: 8,
        },
        {
          id: 4,
          username: '시네마팬',
          contentId: 5,
          comment: '지구가 위기에 처한 가운데, 우주를 탐험하는 과학자 팀이 새로운 행성을 찾아 인류를 구하기 위한 모험을 떠나는 SF 드라마.',
          rating: 4.7,
          likes: 234,
          replies: 15,
        },
        {
          id: 5,
          username: '액션러버',
          contentId: 6,
          comment: '배트맨이 조커의 완전한 무정부주의적 테러에 맞서 고담시티를 지키기 위한 치열한 싸움을 펼치는 슈퍼히어로 액션.',
          rating: 4.9,
          likes: 567,
          replies: 42,
        },
        {
          id: 6,
          username: 'SF매니아',
          contentId: 7,
          comment: '꿈 속의 꿈 속으로 들어가 상대의 무의식에 아이디어를 심는 기술, 인셉션을 다룬 미래적 SF 스릴러 영화.',
          rating: 4.6,
          likes: 312,
          replies: 28,
        },
        {
          id: 7,
          username: '영화평론가',
          contentId: 9,
          comment: '반지하 주택에 살던 기택 가족이 상류층 박 사장 집에 취업하며 벌어지는 계급 간 갈등을 담은 블랙코미디 스릴러.',
          rating: 4.8,
          likes: 445,
          replies: 35,
        },
        {
          id: 8,
          username: '로맨스팬',
          contentId: 10,
          comment: '1912년 타이타닉 호에서 만난 상류층 레이디 로즈와 하층민 출신 잭의 금지된 사랑을 그린 로맨스 재난 영화.',
          rating: 4.4,
          likes: 289,
          replies: 19,
        },
        {
          id: 9,
          username: '애니메이션팬',
          contentId: 11,
          comment: '마법의 얼음 힘을 가진 엘사의 실수로 왕국이 겨울에 얼어붙자, 여동생 안나와 함께 왕국을 구하기 위해 떠나는 모험 이야기.',
          rating: 4.5,
          likes: 378,
          replies: 24,
        },
        {
          id: 10,
          username: '영화광유저',
          contentId: 4,
          comment: '토르의 묵직한 액션과 연출이 인상 깊었습니다. 마블 시네마틱 유니버스의 시작을 알리는 작품이라 더욱 의미가 있습니다.',
          rating: 4.2,
          likes: 156,
          replies: 8,
        },
        {
          id: 11,
          username: '액션중독',
          contentId: 6,
          comment: '하스 레저의 조커 연기가 정말 압도적입니다. 영화사를 바꾼 최고의 악역 연기라고 생각합니다. 매번 봐도 새롭습니다.',
          rating: 5.0,
          likes: 789,
          replies: 67,
        },
        {
          id: 12,
          username: 'SF마니아',
          contentId: 7,
          comment: '꿈 속의 꿈, 레이어별로 복잡하게 얽힌 스토리가 정말 놀랍습니다. 크리스토퍼 놀란 감독의 시그니처 영화네요!',
          rating: 4.7,
          likes: 423,
          replies: 31,
        },
      ];
      return tempData;
    }
  }
);

// 토픽별 코멘트 조회
export const getCommentsByTopic = createAsyncThunk(
  'comments/getByTopic',
  async ({ topicId }: { topicId: number }, { rejectWithValue }) => {
    try {
      const data = await commentApi.fetchComments(topicId);
      return { topicId, items: data as CommentItem[] };
    } catch (err: any) {
      console.error('Comment API 호출 실패:', err);
      // 목업 데이터 반환
      const tempData: CommentItem[] = [
        {
          comment_id: 1,
          topic_id: 1,
          user_id: 1,
          content: '이 영화 정말 재미있어요! 케이팝 아이돌들이 액션 히어로로 나오는 설정이 신선하고, 스토리도 탄탄해서 끝까지 몰입해서 봤습니다.',
          created_at: '2025-01-20',
          User: { user_id: 1, name: '유저닉네임1' },
        },
        {
          comment_id: 2,
          topic_id: 2,
          user_id: 2,
          content: '예상보다 훨씬 재미있었습니다! 스토리 전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었어요.',
          created_at: '2025-01-19',
          User: { user_id: 2, name: '영화매니아' },
        },
        {
          comment_id: 3,
          topic_id: 3,
          user_id: 3,
          content: '정치 드라마치고는 정말 현실적이고 몰입도가 높았습니다. 배우들의 연기도 훌륭하고, 스토리도 정치적 상황을 잘 반영한 것 같아요.',
          created_at: '2025-01-18',
          User: { user_id: 3, name: '드라마러버' },
        },
        {
          comment_id: 4,
          topic_id: 1,
          user_id: 4,
          content: '배우들의 연기력이 정말 대단했습니다. 감동적인 스토리와 함께 완벽한 시너지를 이루어 보는 내내 몰입할 수 있었어요.',
          created_at: '2025-01-17',
          User: { user_id: 4, name: '시네마팬' },
        },
        {
          comment_id: 5,
          topic_id: 4,
          user_id: 5,
          content: '정말 재밌게 봤어요! 스토리가 탄탄하고 배우들의 연기도 훌륭했습니다. 특히 마지막 반전이 인상적이었어요.',
          created_at: '2025-01-16',
          User: { user_id: 5, name: '영화마니아' },
        },
        {
          comment_id: 6,
          topic_id: 2,
          user_id: 6,
          content: '기대했던 것만큼은 아니었지만 괜찮은 영화였습니다. 액션 장면들이 인상적이었어요.',
          created_at: '2025-01-15',
          User: { user_id: 6, name: '액션러버' },
        },
        {
          comment_id: 7,
          topic_id: 5,
          user_id: 7,
          content: '감동적인 스토리와 아름다운 영상미가 인상적이었습니다. 눈물이 났어요.',
          created_at: '2025-01-14',
          User: { user_id: 7, name: '감성파' },
        },
        {
          comment_id: 8,
          topic_id: 1,
          user_id: 8,
          content: '시간 가는 줄 몰랐습니다. 몰입도가 정말 높았어요. 두 번 봐도 재밌을 것 같아요!',
          created_at: '2025-01-13',
          User: { user_id: 8, name: '시네필' },
        },
        {
          comment_id: 9,
          topic_id: 3,
          user_id: 9,
          content: '연출이 훌륭하고 배우들의 호연이 일품이었습니다. OST도 너무 좋았어요.',
          created_at: '2025-01-12',
          User: { user_id: 9, name: 'OST매니아' },
        },
        {
          comment_id: 10,
          topic_id: 6,
          user_id: 10,
          content: '약간 아쉬운 부분이 있지만 전반적으로 만족스러운 작품이었습니다.',
          created_at: '2025-01-11',
          User: { user_id: 10, name: '평론가' },
        },
        {
          comment_id: 11,
          topic_id: 2,
          user_id: 11,
          content: '다른 장르와는 차별화된 독특한 스타일이 매력적이었습니다. 추천해요!',
          created_at: '2025-01-10',
          User: { user_id: 11, name: '독립영화애호가' },
        },
        {
          comment_id: 12,
          topic_id: 4,
          user_id: 12,
          content: '엔딩이 너무 예상 밖이어서 충격이었습니다. 여러 번 생각해볼 수 있는 작품이네요.',
          created_at: '2025-01-09',
          User: { user_id: 12, name: '플로터' },
        },
        {
          comment_id: 13,
          topic_id: 1,
          user_id: 13,
          content: '캐릭터 설정이 정말 매력적이었어요. 각 인물의 배경 스토리가 잘 그려져 있어서 더 몰입할 수 있었습니다.',
          created_at: '2025-01-08',
          User: { user_id: 13, name: '스토리텔러' },
        },
        {
          comment_id: 14,
          topic_id: 1,
          user_id: 14,
          content: '영상미가 정말 대단했습니다. 색감과 조명이 영화의 분위기를 완벽하게 살려줬어요. 감독의 연출이 인상적이었습니다.',
          created_at: '2025-01-07',
          User: { user_id: 14, name: '비주얼러버' },
        },
        {
          comment_id: 15,
          topic_id: 1,
          user_id: 15,
          content: '액션 시퀀스가 정말 짜릿했어요! 전투 장면 하나하나가 다 신중하게 기획된 것 같아서 보는 내내 긴장감이 유지되었습니다.',
          created_at: '2025-01-06',
          User: { user_id: 15, name: '액션키퍼' },
        },
        {
          comment_id: 16,
          topic_id: 1,
          user_id: 16,
          content: 'OST가 너무 좋아서 영화를 보고 나서 계속 찾아서 듣고 있어요. 영화의 감정선을 더욱 돋보이게 해주는 음악이었습니다.',
          created_at: '2025-01-05',
          User: { user_id: 16, name: '음악애호가' },
        },
        {
          comment_id: 17,
          topic_id: 1,
          user_id: 17,
          content: '다시 봐도 재미있는 작품이에요. 두 번째 보니까 처음에 놓쳤던 디테일들을 발견할 수 있어서 더욱 즐거웠습니다.',
          created_at: '2025-01-04',
          User: { user_id: 17, name: '리와처' },
        },
      ];
      // 요청한 topicId에 맞는 코멘트만 필터링
      const filteredData = tempData.filter(item => item.topic_id === topicId);
      return { topicId, items: filteredData };
    }
  }
);

// 코멘트 작성
export const createCommentThunk = createAsyncThunk(
  'comments/create',
  async ({ topic_id, content }: { topic_id: number; content: string }, { rejectWithValue }) => {
    try {
      const data = await commentApi.createCommentV2({ topic_id, content });
      return data as CommentItem;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 작성 실패' });
    }
  }
);

// 코멘트 수정
export const updateCommentThunk = createAsyncThunk(
  'comments/update',
  async ({ comment_id, content }: { comment_id: number; content: string }, { rejectWithValue }) => {
    try {
      const { comment } = await commentApi.updateCommentV2(comment_id, { content });
      return comment as CommentItem;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 수정 실패' });
    }
  }
);

// 코멘트 삭제
export const deleteCommentThunk = createAsyncThunk(
  'comments/delete',
  async ({ comment_id }: { comment_id: number }, { rejectWithValue }) => {
    try {
      await commentApi.deleteCommentV2(comment_id);
      return { comment_id };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: '코멘트 삭제 실패' });
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
    // 홈페이지 코멘트 조회
    builder
      .addCase(fetchCommentsThunk.pending, (state) => {
        state.homeLoading = true;
        state.homeError = null;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        state.homeLoading = false;
        state.homeComments = action.payload;
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        state.homeLoading = false;
        state.homeError = action.error.message || null;
      });

    // 토픽별 코멘트 조회
    builder
      .addCase(getCommentsByTopic.pending, (state, action) => {
        const { topicId } = action.meta.arg as { topicId: number };
        state.byTopicId[topicId] ??= { items: [], loading: false, error: null };
        state.byTopicId[topicId].loading = true;
        state.byTopicId[topicId].error = null;
      })
      .addCase(getCommentsByTopic.fulfilled, (state, action) => {
        const { topicId, items } = action.payload as { topicId: number; items: CommentItem[] };
        state.byTopicId[topicId] = { items, loading: false, error: null };
      })
      .addCase(getCommentsByTopic.rejected, (state, action) => {
        const { topicId } = action.meta.arg as { topicId: number };
        state.byTopicId[topicId] ??= { items: [], loading: false, error: null };
        state.byTopicId[topicId].loading = false;
        state.byTopicId[topicId].error = (action.payload as any)?.message || '코멘트 조회 실패';
      });

    // 코멘트 작성
    builder
      .addCase(createCommentThunk.pending, (state) => {
        state.creating = true;
        state.topicError = null;
      })
      .addCase(createCommentThunk.fulfilled, (state, action: PayloadAction<CommentItem>) => {
        state.creating = false;
        const item = action.payload;
        const tId = item.topic_id;
        state.byTopicId[tId] ??= { items: [], loading: false, error: null };
        state.byTopicId[tId].items.unshift(item); // 최신 우선
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.creating = false;
        state.topicError = (action.payload as any)?.message || '코멘트 작성 실패';
      });

    // 코멘트 수정
    builder
      .addCase(updateCommentThunk.pending, (state) => {
        state.updating = true;
        state.topicError = null;
      })
      .addCase(updateCommentThunk.fulfilled, (state, action: PayloadAction<CommentItem>) => {
        state.updating = false;
        const updated = action.payload;
        const tId = updated.topic_id;
        const list = state.byTopicId[tId]?.items;
        if (list) {
          const idx = list.findIndex((c) => c.comment_id === updated.comment_id);
          if (idx !== -1) list[idx] = { ...list[idx], ...updated };
        }
      })
      .addCase(updateCommentThunk.rejected, (state, action) => {
        state.updating = false;
        state.topicError = (action.payload as any)?.message || '코멘트 수정 실패';
      });

    // 코멘트 삭제
    builder
      .addCase(deleteCommentThunk.pending, (state) => {
        state.deleting = true;
        state.topicError = null;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action: PayloadAction<{ comment_id: number }>) => {
        state.deleting = false;
        const { comment_id } = action.payload;
        // 어떤 topicId인지 모를 수 있으므로 전체 스캔
        for (const tIdStr of Object.keys(state.byTopicId)) {
          const bucket = state.byTopicId[Number(tIdStr)];
          bucket.items = bucket.items.filter((c) => c.comment_id !== comment_id);
        }
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.deleting = false;
        state.topicError = (action.payload as any)?.message || '코멘트 삭제 실패';
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
export const selectHomeComments = (s: RootCommentsState) => s.comments.homeComments;
export const selectHomeLoading = (s: RootCommentsState) => s.comments.homeLoading;
export const selectHomeError = (s: RootCommentsState) => s.comments.homeError;
