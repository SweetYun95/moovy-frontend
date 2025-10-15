// moovy-frontend/src/services/api/http.ts
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

// 공용 Axios 인스턴스
const moovy = axios.create({
   baseURL: BASE_URL,
   headers: { 'Content-Type': 'application/json' },
   withCredentials: true,
   // validateStatus 기본값 유지(200~299)
})

// ───────── 요청 인터셉터
moovy.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token')
      const url = (config.url || '').toString()

      // 로그인/회원가입 계열은 토큰 생략
      const skipAuthHeader = /\/auth\/(login|login-admin|join)\b/i.test(url)

      if (token && !skipAuthHeader) {
         // 서버 요구사항에 따라 Bearer 접두사 조정
         // (필요 시 아래 한 줄로 교체)
         // (config.headers as any).Authorization = `Bearer ${token}`
         ;(config.headers as any).Authorization = `${token}`
      }
      return config
   },
   (error: AxiosError) => Promise.reject(error)
)

// ───────── 응답 인터셉터
moovy.interceptors.response.use(
   (response: AxiosResponse) => {
      // /auth/me 는 401도 상위에서 처리하도록 통과
      if (response.config?.url?.includes('/auth/me') && response.status === 401) {
         return response
      }

      if (response.status < 200 || response.status >= 300) {
         return Promise.reject(response)
      }
      return response
   },
   (error: AxiosError) => Promise.reject(error)
)

export default moovy
