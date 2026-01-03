// moovy-frontend/src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'
import { loginLocal, logout, signUpLocal, checkAuth, requestPasswordReset, confirmPasswordReset } from '@/services/api/authApi'

const initialState: AuthState = {
   user: null,
   loading: false,
   error: null,
   isLoggedIn: false,

   // ✅ 비밀번호 재설정 플로우 상태(로그인 상태와 무관)
   resetLoading: false,
   resetRequestDone: false, // 메일 발송 요청 처리 완료 여부
   resetDone: false, // 비번 재설정 완료 여부
   resetError: null,
}

type AuthState = {
   user: AuthUser | null
   loading: boolean
   error: string | null
   isLoggedIn: boolean

   // ✅ reset state
   resetLoading: boolean
   resetRequestDone: boolean
   resetDone: boolean
   resetError: string | null
}

interface AuthUser {
   user_id: string
   email: string
   name: string
   google?: boolean
   kakao?: boolean
   googleId?: string
   kakaoId?: string
   state?: string
   profileImage?: string
}

// ─────────────────────────────
// 로컬 회원가입
// ─────────────────────────────
export const localSignUpThunk = createAsyncThunk('Auth/localsignup', async (payload: { email: string; password: string; name: string }, { rejectWithValue }) => {
   try {
      const response = await signUpLocal(payload)
      return response.data
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('알 수 없는 에러')
   }
})

// ─────────────────────────────
// 로컬 로그인
// ─────────────────────────────
export const localLoginThunk = createAsyncThunk('Auth/localLogin', async (payload: { email: string; password: string }, { rejectWithValue }) => {
   try {
      const response = await loginLocal(payload)
      return response.data
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('알 수 없는 에러')
   }
})

// ─────────────────────────────
// 로그아웃
// ─────────────────────────────
export const logoutThunk = createAsyncThunk('Auth/logout', async (_, { rejectWithValue }) => {
   try {
      await logout()
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('알 수 없는 에러')
   }
})

// ─────────────────────────────
// 인증 상태 확인
// ─────────────────────────────
export const checkAuthThunk = createAsyncThunk('Auth/checkAuth', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuth()
      return response.data
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('알 수 없는 에러')
   }
})

// ─────────────────────────────
// ✅ 비밀번호 재설정 요청(메일 발송)
// ─────────────────────────────
export const requestPasswordResetThunk = createAsyncThunk('Auth/requestPasswordReset', async (payload: { email: string }, { rejectWithValue }) => {
   try {
      const response = await requestPasswordReset(payload)
      return response
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('알 수 없는 에러')
   }
})

// ─────────────────────────────
// ✅ 비밀번호 재설정 확정(토큰 + 새 비밀번호)
// ─────────────────────────────
export const confirmPasswordResetThunk = createAsyncThunk('Auth/confirmPasswordReset', async (payload: { token: string; password: string }, { rejectWithValue }) => {
   try {
      const response = await confirmPasswordReset(payload)
      return response
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('알 수 없는 에러')
   }
})

const slice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      // ✅ reset UI에서 상태 초기화가 필요할 수 있어서 하나 넣어둠(선택)
      clearResetState: (state) => {
         state.resetLoading = false
         state.resetRequestDone = false
         state.resetDone = false
         state.resetError = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(localSignUpThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload?.newUser ?? null
         })
         .addCase(localLoginThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload?.user ?? null
            state.isLoggedIn = !!action.payload?.user
         })
         .addCase(logoutThunk.fulfilled, (state) => {
            state.loading = false
            state.user = null
            state.isLoggedIn = false
         })
         .addCase(checkAuthThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload?.user ?? null
            state.isLoggedIn = !!action.payload?.user
         })

      // ✅ reset - request
      builder.addCase(requestPasswordResetThunk.pending, (state) => {
         state.resetLoading = true
         state.resetError = null
         state.resetRequestDone = false
      })
      builder.addCase(requestPasswordResetThunk.fulfilled, (state) => {
         state.resetLoading = false
         state.resetRequestDone = true
      })
      builder.addCase(requestPasswordResetThunk.rejected, (state, action) => {
         state.resetLoading = false
         state.resetError = (action.payload as any)?.message ?? (action.payload as string) ?? '요청에 실패했습니다.'
      })

      // ✅ reset - confirm
      builder.addCase(confirmPasswordResetThunk.pending, (state) => {
         state.resetLoading = true
         state.resetError = null
         state.resetDone = false
      })
      builder.addCase(confirmPasswordResetThunk.fulfilled, (state) => {
         state.resetLoading = false
         state.resetDone = true
      })
      builder.addCase(confirmPasswordResetThunk.rejected, (state, action) => {
         state.resetLoading = false
         state.resetError = (action.payload as any)?.message ?? (action.payload as string) ?? '비밀번호 재설정에 실패했습니다.'
      })

      // ─────────────────────────────
      // 기존 pending / rejected (Auth 공통)
      // 주의: reset은 위에서 따로 처리했으니 공통 matcher가 덮어쓰지 않도록 reset thunk는 matcher에서 제외할 수 있는데,
      // 현재 matcher는 state.loading만 건드리니( resetLoading은 건드리지 않음 ) 충돌 없음.
      // ─────────────────────────────
      builder
         .addMatcher(isPending, (state, action) => {
            // reset 관련 thunk는 auth loading에 영향을 주지 않도록 제외(선택)
            if (String(action.type).includes('Auth/requestPasswordReset') || String(action.type).includes('Auth/confirmPasswordReset')) return
            state.loading = true
            state.error = null
         })
         .addMatcher(isRejected, (state, action) => {
            // reset 관련 thunk는 auth error에 영향을 주지 않도록 제외(선택)
            if (String(action.type).includes('Auth/requestPasswordReset') || String(action.type).includes('Auth/confirmPasswordReset')) return
            state.loading = false
            state.error = action.payload as string
         })
   },
})

export const { clearResetState } = slice.actions
export default slice.reducer
