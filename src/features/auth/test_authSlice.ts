// moovy-frontend/src/features/auth/test_authSlice.ts
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'
import { loginLocal, logout, signUpLocal } from '@/services/api/test_authApi'

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
}

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

const slice = createSlice({
   name: 'testAuth',
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
