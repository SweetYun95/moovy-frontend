// moovy-frontend/src/features/auth/test_authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Provider, User } from "@/services/api/test_authApi";
import {
  loginLocal,
  joinLocal,
  logout,
  meLocal,
  meGoogle,
  meKakao,
} from "@/services/api/test_authApi";

export type AuthState = {
  hydrated: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  provider: Provider | "none";
  error?: string | null;
};

const initialState: AuthState = {
  hydrated: false,
  loading: false,
  isAuthenticated: false,
  user: null,
  provider: "none",
  error: null,
};

/** ✅ 앱 부팅 시: 로컬/구글/카카오 중 하나라도 로그인되어 있으면 통과 */
export const test_hydrateAuthThunk = createAsyncThunk(
  "testAuth/hydrate",
  async (_: void, { rejectWithValue }) => {
    const checks = await Promise.allSettled([meLocal(), meGoogle(), meKakao()]);

    for (const r of checks) {
      if (r.status === "fulfilled") {
        return r.value;
      }
    }
    return rejectWithValue("NO_SESSION");
  },
);

/** ✅ 로컬 로그인 */
export const test_loginThunk = createAsyncThunk(
  "testAuth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginLocal(payload);
      return { ...res.user, provider: "local" as const };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "LOGIN_FAILED");
    }
  },
);

/** ✅ 회원가입 */
export const test_joinThunk = createAsyncThunk(
  "testAuth/join",
  async (
    payload: {
      email: string;
      password: string;
      name: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await joinLocal(payload);
      // 회원가입 후 자동 로그인 처리를 할지, 아니면 그냥 성공 리턴할지 결정
      // 여기서는 성공만 리턴
      return true;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "JOIN_FAILED");
    }
  },
);

/** ✅ 로그아웃 */
export const test_logoutThunk = createAsyncThunk(
  "testAuth/logout",
  async () => {
    await logout();
  },
);

const slice = createSlice({
  name: "testAuth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.provider = action.payload
        ? (action.payload.provider ?? "local")
        : "none";
    },
  },
  extraReducers: (b) => {
    // hydrate
    b.addCase(test_hydrateAuthThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(test_hydrateAuthThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.hydrated = true;
      s.user = a.payload as User;
      s.isAuthenticated = true;
      s.provider = (a.payload as any)?.provider ?? "local";
    });
    b.addCase(test_hydrateAuthThunk.rejected, (s) => {
      s.loading = false;
      s.hydrated = true;
      s.user = null;
      s.isAuthenticated = false;
      s.provider = "none";
    });

    // login
    b.addCase(test_loginThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(test_loginThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload as User;
      s.isAuthenticated = true;
      s.provider = "local";
    });
    b.addCase(test_loginThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? "LOGIN_FAILED";
    });

    // join
    b.addCase(test_joinThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(test_joinThunk.fulfilled, (s) => {
      s.loading = false;
      // 회원가입 성공 시 별도 상태 변경 없음 (로그인 페이지로 이동 등은 컴포넌트에서 처리)
    });
    b.addCase(test_joinThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? "JOIN_FAILED";
    });

    // logout
    b.addCase(test_logoutThunk.fulfilled, (s) => {
      s.user = null;
      s.isAuthenticated = false;
      s.provider = "none";
    });
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
