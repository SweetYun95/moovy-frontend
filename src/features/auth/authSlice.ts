// moovy-frontend/src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'
import { loginLocal, logout, signUpLocal, checkAuth, requestPasswordReset, confirmPasswordReset } from '@/services/api/authApi'

export interface AuthUser {
   user_id: string
   email: string
   name: string
   google?: boolean
   kakao?: boolean
   googleId?: string
   kakaoId?: string
   state?: string
   profileImage?: string
   role?: string
}

export type AuthState = {
   user: AuthUser | null
   loading: boolean
   error: string | null
   isLoggedIn: boolean

   resetLoading: boolean
   resetRequestDone: boolean
   resetDone: boolean
   resetError: string | null
}

const initialState: AuthState = {
   user: null,
   loading: false,
   error: null,
   isLoggedIn: false,

   resetLoading: false,
   resetRequestDone: false,
   resetDone: false,
   resetError: null,
}

// 공통 에러 메시지 파서
const getErrorMessage = (payload: any): string => {
   if (!payload) return '요청에 실패했습니다.'
   if (typeof payload === 'string') return payload

   return payload?.errors?.fieldErrors?.name?.[0] || payload?.errors?.fieldErrors?.email?.[0] || payload?.errors?.fieldErrors?.password?.[0] || payload?.message || '요청에 실패했습니다.'
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
// 비밀번호 재설정 요청
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
// 비밀번호 재설정 확정
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
         state.resetError = getErrorMessage(action.payload)
      })

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
         state.resetError = getErrorMessage(action.payload)
      })

      builder
         .addMatcher(isPending, (state, action) => {
            if (String(action.type).includes('Auth/requestPasswordReset') || String(action.type).includes('Auth/confirmPasswordReset')) return
            state.loading = true
            state.error = null
         })
         .addMatcher(isRejected, (state, action) => {
            if (String(action.type).includes('Auth/requestPasswordReset') || String(action.type).includes('Auth/confirmPasswordReset')) return
            state.loading = false
            state.error = getErrorMessage(action.payload)
         })
   },
})

export const { clearResetState } = slice.actions
export default slice.reducer
