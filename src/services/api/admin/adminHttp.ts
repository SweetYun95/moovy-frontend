// moovy-frontend/src/services/api/admin/adminHttp.ts
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

// 관리자 전용 Axios 인스턴스
const adminHttp = axios.create({
   baseURL: `${BASE_URL}/api/admin`,
   headers: { 'Content-Type': 'application/json' },
   withCredentials: true,
})

// ───────── 요청 인터셉터
adminHttp.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('admin_token')
      const url = (config.url || '').toString()

      // 관리자 로그인 전용 API는 토큰 생략
      const skipAuthHeader = /\/auth\/(signin|signup)\b/i.test(url)

      if (token && !skipAuthHeader) {
         ;(config.headers as any).Authorization = `Bearer ${token}`
      }
      return config
   },
   (error: AxiosError) => Promise.reject(error),
)

// ───────── 응답 인터셉터
adminHttp.interceptors.response.use(
   (response: AxiosResponse) => {
      if (response.status >= 200 && response.status < 300) return response
      return Promise.reject(response)
   },
   (error: AxiosError) => {
      const status = error?.response?.status
      if (status === 419 || status === 401) {
         console.warn('🔒 관리자 인증 만료 또는 무효')
      }
      return Promise.reject(error)
   },
)

export default adminHttp
