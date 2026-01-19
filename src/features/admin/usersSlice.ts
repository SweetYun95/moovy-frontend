// moovy-frontend/src/features/admin/usersSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as adminApi from "../../services/api/admin/adminUserApi";
import type {
  AdminUserSummary,
  AdminUserDetail,
  ListParams,
  ListResponse,
  UserSanction,
} from "../../services/api/admin/adminUserApi";

// ───────── 타입 정의
export type AdminUsersListBucket = {
  items: AdminUserSummary[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  params: ListParams;
};

export type AdminUserDetailBucket = {
  item: AdminUserDetail | null;
  loading: boolean;
  error: string | null;
};

export type AdminUsersState = {
  list: AdminUsersListBucket;
  detailById: Record<number, AdminUserDetailBucket>;
};

// ───────── 초기 상태
const initialState: AdminUsersState = {
  list: {
    items: [],
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0,
    loading: false,
    error: null,
    params: {},
  },
  detailById: {},
};

// ───────── Thunks
export const getAdminUsers = createAsyncThunk(
  "adminUsers/getAdminUsers",
  async (params: ListParams = {}, { rejectWithValue }) => {
    try {
      const res = await adminApi.fetchAdminUsers(params);
      return { res, params };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch users",
      );
    }
  },
);

export const getAdminUserDetail = createAsyncThunk(
  "adminUsers/getAdminUserDetail",
  async (user_id: number, { rejectWithValue }) => {
    try {
      const res = await adminApi.fetchAdminUserDetail(user_id);
      return { user_id, res };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch user detail",
      );
    }
  },
);

export const postSanction = createAsyncThunk(
  "adminUsers/postSanction",
  async (
    args: {
      user_id: number;
      end_at: string;
      reason: string;
      start_at?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { sanction } = await adminApi.createSanction(args.user_id, {
        end_at: args.end_at,
        reason: args.reason,
        start_at: args.start_at,
      });
      return { user_id: args.user_id, sanction };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create sanction",
      );
    }
  },
);

export const patchSanction = createAsyncThunk(
  "adminUsers/patchSanction",
  async (
    args: {
      user_id: number;
      id: number;
      reason?: string;
      end_at?: string;
      early_release?: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const { sanction } = await adminApi.updateSanction(
        args.user_id,
        args.id,
        {
          reason: args.reason,
          end_at: args.end_at,
          early_release: args.early_release,
        },
      );
      return { user_id: args.user_id, sanction };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update sanction",
      );
    }
  },
);

export const removeSanction = createAsyncThunk(
  "adminUsers/removeSanction",
  async (args: { user_id: number; id: number }, { rejectWithValue }) => {
    try {
      await adminApi.deleteSanction(args.user_id, args.id);
      return { user_id: args.user_id, id: args.id };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete sanction",
      );
    }
  },
);

export const postForceWithdrawal = createAsyncThunk(
  "adminUsers/postForceWithdrawal",
  async (args: { user_id: number; reason: string }, { rejectWithValue }) => {
    try {
      await adminApi.forceWithdrawal(args.user_id, args.reason);
      return { user_id: args.user_id };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to force withdrawal",
      );
    }
  },
);

// ───────── Slice
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setListParams(state, action: PayloadAction<Partial<ListParams>>) {
      state.list.params = { ...state.list.params, ...action.payload };
    },
    resetList(state) {
      state.list = { ...initialState.list };
    },
  },
  extraReducers: (builder) => {
    // 목록
    builder
      .addCase(getAdminUsers.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        const { res, params } = action.payload as {
          res: ListResponse<AdminUserSummary>;
          params: ListParams;
        };
        state.list.loading = false;
        state.list.items = res.items;
        state.list.page = res.page;
        state.list.size = res.size;
        state.list.total = res.total;
        state.list.totalPages = res.totalPages;
        state.list.params = params;
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = String(
          action.payload || action.error.message || "Failed to fetch users",
        );
      });

    // 상세
    builder
      .addCase(getAdminUserDetail.pending, (state, action) => {
        const user_id = action.meta.arg as number;
        state.detailById[user_id] ??= {
          item: null,
          loading: true,
          error: null,
        };
        state.detailById[user_id].loading = true;
        state.detailById[user_id].error = null;
      })
      .addCase(getAdminUserDetail.fulfilled, (state, action) => {
        const { user_id, res } = action.payload as {
          user_id: number;
          res: AdminUserDetail;
        };
        state.detailById[user_id] = { item: res, loading: false, error: null };
      })
      .addCase(getAdminUserDetail.rejected, (state, action) => {
        const user_id = action.meta.arg as number;
        state.detailById[user_id] ??= {
          item: null,
          loading: false,
          error: null,
        };
        state.detailById[user_id].loading = false;
        state.detailById[user_id].error = String(
          action.payload || action.error.message || "Failed to fetch detail",
        );
      });

    // 제재 생성
    builder.addCase(postSanction.fulfilled, (state, action) => {
      const { user_id, sanction } = action.payload as {
        user_id: number;
        sanction: UserSanction;
      };
      const b = state.detailById[user_id];
      if (b?.item) {
        b.item.sanctions = [sanction, ...(b.item.sanctions ?? [])];
        b.item.state = "SUSPENDED";
      }
    });

    // 제재 수정
    builder.addCase(patchSanction.fulfilled, (state, action) => {
      const { user_id, sanction } = action.payload as {
        user_id: number;
        sanction: UserSanction;
      };
      const b = state.detailById[user_id];
      if (b?.item?.sanctions) {
        const idx = b.item.sanctions.findIndex((s) => s.id === sanction.id);
        if (idx >= 0) b.item.sanctions[idx] = sanction;
      }
    });

    // 제재 삭제
    builder.addCase(removeSanction.fulfilled, (state, action) => {
      const { user_id, id } = action.payload as { user_id: number; id: number };
      const b = state.detailById[user_id];
      if (b?.item?.sanctions) {
        b.item.sanctions = b.item.sanctions.filter((s) => s.id !== id);
      }
    });

    // 강제 탈퇴
    builder.addCase(postForceWithdrawal.fulfilled, (state, action) => {
      const { user_id } = action.payload as { user_id: number };
      const b = state.detailById[user_id];
      if (b?.item) {
        b.item.state = "DELETED";
        b.item.deleted_at = new Date().toISOString();
      }
    });
  },
});

export const { setListParams, resetList } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
