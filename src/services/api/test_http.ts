// moovy-frontend/src/services/api/test_http.ts
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

// 공용 Axios 인스턴스
const test_moovy = axios.create({
   baseURL: BASE_URL,
   headers: { 'Content-Type': 'application/json' },
   withCredentials: true,
})

export interface ApiResponse<T> {
   success: boolean
   data?: T
}

export default test_moovy
