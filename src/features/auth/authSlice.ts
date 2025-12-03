// moovy-frontend/src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Provider, User } from "@/services/api/authApi";
import {
  loginLocal,
  logout,
  meLocal,
  meGoogle,
  meKakao,
} from "@/services/api/authApi";

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
export const hydrateAuthThunk = createAsyncThunk(
  "auth/hydrate",
  async (_: void, { rejectWithValue }) => {
    // 세 가지 체크를 병렬로 시도 → 성공한 것 하나라도 있으면 로그인 상태
    const checks = await Promise.allSettled([meLocal(), meGoogle(), meKakao()]);

    for (const r of checks) {
      if (r.status === "fulfilled") {
        return r.value; // { ...user, provider }
      }
    }
    // 모두 실패면 게스트
    return rejectWithValue("NO_SESSION");
  },
);

/** ✅ 로컬 로그인 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    payload: { idOrEmail: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await loginLocal(payload);
      // token 저장은 authApi에서 처리
      return { ...res.user, provider: "local" as const };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? "LOGIN_FAILED");
    }
  },
);

/** ✅ 로그아웃 */
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await logout();
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 필요 시 사용자 정보 일부 갱신
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
    b.addCase(hydrateAuthThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(hydrateAuthThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.hydrated = true;
      s.user = a.payload as User;
      s.isAuthenticated = true;
      s.provider = (a.payload as any)?.provider ?? "local";
    });
    b.addCase(hydrateAuthThunk.rejected, (s) => {
      s.loading = false;
      s.hydrated = true;
      s.user = null;
      s.isAuthenticated = false;
      s.provider = "none";
    });

    // login
    b.addCase(loginThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload as User;
      s.isAuthenticated = true;
      s.provider = "local";
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) ?? "LOGIN_FAILED";
    });

    // logout
    b.addCase(logoutThunk.fulfilled, (s) => {
      s.user = null;
      s.isAuthenticated = false;
      s.provider = "none";
    });
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
