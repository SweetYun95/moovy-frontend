// moovy-frontend/src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'
import { loginLocal, logout, signUpLocal, checkAuth } from '@/services/api/authApi'

const initialState: AuthState = {
   user: null,
   loading: false,
   error: null,
   isLoggedIn: false,
}

type AuthState = {
   user: AuthUser | null
   loading: boolean
   error: string | null
   isLoggedIn: boolean
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

// 로컬 회원가입
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

// 로컬 로그인
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

// 로그아웃
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

// 인증 상태 확인
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

const slice = createSlice({
   name: 'auth',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(localSignUpThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload?.newUser ?? null
         })
         .addCase(localLoginThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload?.user ?? null
         })
         .addCase(logoutThunk.fulfilled, (state) => {
            state.loading = false
            state.user = null
         })
         .addCase(checkAuthThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload?.user ?? null
         })
      builder
         .addMatcher(isPending, (state) => {
            state.loading = true
            state.error = null
         })
         .addMatcher(isRejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
         })
   },
})

export default slice.reducer
