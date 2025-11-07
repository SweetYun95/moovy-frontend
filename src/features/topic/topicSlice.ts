// moovy-frontend/src/features/topic/topicSlice.ts
import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import * as topicApi from "@/services/api/topicApi";
import type {
  Topic,
  TopicList,
  CreateTopicRequest,
  UpdateTopicRequest,
} from "@/services/api/topicApi";

/** --------------------------------
 * State
 * --------------------------------*/
type ListQuery = {
  // 향후 필터/검색/페이지 추가 시 확장
  key: string; // 쿼리 캐시 키 (e.g. "default")
};

type ListBucket = {
  ids: number[]; // 정렬된 topic id 배열
  total: number;
  loading: boolean;
  error: string | null;
};

type TopicExtraState = {
  byQuery: Record<string, ListBucket>;
  currentId: number | null; // 상세 조회 중인 topic id
  loadingById: Record<number, boolean>;
  errorById: Record<number, string | null>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  uploading: boolean;
  lastCreatedId?: number | null;
};

// 명시적으로 Id 타입을 number로 지정
const topicsAdapter = createEntityAdapter<Topic, number>({
  selectId: (t) => t.id,
  // 문자열 날짜면 localeCompare가 안전하고 깔끔 (내림차순: 최신 우선)
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = topicsAdapter.getInitialState<TopicExtraState>({
  byQuery: {},
  currentId: null,
  loadingById: {},
  errorById: {},
  creating: false,
  updating: false,
  deleting: false,
  uploading: false,
  lastCreatedId: null,
});

/** --------------------------------
 * Thunks
 * --------------------------------*/

// 목록 조회 (간단 캐시 키로 구분)
export const fetchTopicsThunk = createAsyncThunk(
  "topics/fetchList",
  async ({ key = "default" }: Partial<ListQuery> = {}) => {
    const res: TopicList = await topicApi.getTopics();
    return { key, list: res.list, total: res.total };
  },
);

// 단건 조회
export const fetchTopicByIdThunk = createAsyncThunk(
  "topics/fetchById",
  async (id: number) => {
    const data = await topicApi.getTopic(id);
    return data;
  },
);

// 생성
export const createTopicThunk = createAsyncThunk(
  "topics/create",
  async (payload: CreateTopicRequest) => {
    const created = await topicApi.createTopic(payload);
    return created;
  },
);

// 수정
export const updateTopicThunk = createAsyncThunk(
  "topics/update",
  async ({ id, data }: { id: number; data: UpdateTopicRequest }) => {
    const updated = await topicApi.updateTopic(id, data);
    return updated;
  },
);

// 삭제
export const deleteTopicThunk = createAsyncThunk(
  "topics/delete",
  async (id: number) => {
    await topicApi.deleteTopic(id);
    return { id };
  },
);

// 이미지 업로드
export const uploadTopicImagesThunk = createAsyncThunk(
  "topics/uploadImages",
  async (files: File[]) => {
    const res = await topicApi.uploadTopicImages(files);
    return res.imageUrls; // string[]
  },
);

/** --------------------------------
 * Slice
 * --------------------------------*/
const topicSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    // 필요 시 선택된 상세 id 변경
    setCurrentTopicId(state, action: PayloadAction<number | null>) {
      state.currentId = action.payload;
    },
    // 목록 캐시 초기화/리셋 등
    clearTopics(state) {
      topicsAdapter.removeAll(state);
      state.byQuery = {};
      state.currentId = null;
      state.loadingById = {};
      state.errorById = {};
      state.lastCreatedId = null;
    },
  },
  extraReducers: (builder) => {
    // 목록
    builder
      .addCase(fetchTopicsThunk.pending, (state, action) => {
        const key = (action.meta.arg?.key ?? "default") as string;
        state.byQuery[key] ??= {
          ids: [],
          total: 0,
          loading: false,
          error: null,
        };
        state.byQuery[key].loading = true;
        state.byQuery[key].error = null;
      })
      .addCase(fetchTopicsThunk.fulfilled, (state, action) => {
        const { key, list, total } = action.payload as {
          key: string;
          list: Topic[];
          total: number;
        };
        topicsAdapter.upsertMany(state, list);
        state.byQuery[key] = {
          ids: list.map((t) => t.id),
          total,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchTopicsThunk.rejected, (state, action) => {
        const key = (action.meta.arg?.key ?? "default") as string;
        state.byQuery[key] ??= {
          ids: [],
          total: 0,
          loading: false,
          error: null,
        };
        state.byQuery[key].loading = false;
        state.byQuery[key].error =
          action.error.message || "토픽 목록 조회 실패";
      });

    // 단건
    builder
      .addCase(fetchTopicByIdThunk.pending, (state, action) => {
        const id = action.meta.arg;
        state.loadingById[id] = true;
        state.errorById[id] = null;
      })
      .addCase(fetchTopicByIdThunk.fulfilled, (state, action) => {
        topicsAdapter.upsertOne(state, action.payload);
        const id = action.payload.id;
        state.loadingById[id] = false;
        state.currentId = id;
      })
      .addCase(fetchTopicByIdThunk.rejected, (state, action) => {
        const id = action.meta.arg as number;
        state.loadingById[id] = false;
        state.errorById[id] = action.error.message || "토픽 조회 실패";
      });

    // 생성
    builder
      .addCase(createTopicThunk.pending, (state) => {
        state.creating = true;
      })
      .addCase(createTopicThunk.fulfilled, (state, action) => {
        state.creating = false;
        topicsAdapter.addOne(state, action.payload);
        state.lastCreatedId = action.payload.id;
      })
      .addCase(createTopicThunk.rejected, (state, action) => {
        state.creating = false;
      });

    // 수정
    builder
      .addCase(updateTopicThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTopicThunk.fulfilled, (state, action) => {
        state.updating = false;
        topicsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateTopicThunk.rejected, (state) => {
        state.updating = false;
      });

    // 삭제
    builder
      .addCase(deleteTopicThunk.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteTopicThunk.fulfilled, (state, action) => {
        state.deleting = false;
        topicsAdapter.removeOne(state, action.payload.id);
        // 모든 목록 캐시에서 제거
        Object.values(state.byQuery).forEach((bucket) => {
          bucket.ids = bucket.ids.filter((tid) => tid !== action.payload.id);
          bucket.total = Math.max(0, bucket.total - 1);
        });
      })
      .addCase(deleteTopicThunk.rejected, (state) => {
        state.deleting = false;
      });

    // 이미지 업로드
    builder
      .addCase(uploadTopicImagesThunk.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadTopicImagesThunk.fulfilled, (state) => {
        state.uploading = false;
      })
      .addCase(uploadTopicImagesThunk.rejected, (state) => {
        state.uploading = false;
      });
  },
});

export const { setCurrentTopicId, clearTopics } = topicSlice.actions;
export default topicSlice.reducer;

/** --------------------------------
 * Selectors
 * --------------------------------*/
const baseSelector = (s: RootState) => s.topics;

export const topicsSelectors = topicsAdapter.getSelectors<RootState>(
  (state) => state.topics,
);

// 목록(쿼리) 셀렉터
export const selectTopicIdsByQuery = (state: RootState, key = "default") =>
  baseSelector(state).byQuery[key]?.ids ?? [];

export const selectTopicsByQuery = (state: RootState, key = "default") =>
  selectTopicIdsByQuery(state, key)
    .map((id) => topicsSelectors.selectById(state, id))
    .filter(Boolean) as Topic[];

export const selectTopicsLoadingByQuery = (state: RootState, key = "default") =>
  baseSelector(state).byQuery[key]?.loading ?? false;

export const selectTopicsErrorByQuery = (state: RootState, key = "default") =>
  baseSelector(state).byQuery[key]?.error ?? null;

export const selectTopicsTotalByQuery = (state: RootState, key = "default") =>
  baseSelector(state).byQuery[key]?.total ?? 0;

// 단건
export const selectTopicById = (state: RootState, id: number) =>
  topicsSelectors.selectById(state, id);

export const selectTopicLoadingById = (state: RootState, id: number) =>
  baseSelector(state).loadingById[id] ?? false;

export const selectTopicErrorById = (state: RootState, id: number) =>
  baseSelector(state).errorById[id] ?? null;

export const selectTopicsCreating = (state: RootState) =>
  baseSelector(state).creating;
export const selectTopicsUpdating = (state: RootState) =>
  baseSelector(state).updating;
export const selectTopicsDeleting = (state: RootState) =>
  baseSelector(state).deleting;
export const selectTopicsUploading = (state: RootState) =>
  baseSelector(state).uploading;
export const selectLastCreatedTopicId = (state: RootState) =>
  baseSelector(state).lastCreatedId;
