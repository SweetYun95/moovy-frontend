// moovy-frontend/src/services/api/admin/adminHttp.ts
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL as string;

// 관리자 전용 Axios 인스턴스
const adminHttp = axios.create({
  baseURL: `${BASE_URL}/admin`, // 어드민 네임스페이스 고정
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ───────── 요청 인터셉터
adminHttp.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("admin_token");
    const url = (config.url || "").toString();

    // 관리자 로그인 전용 API는 토큰 생략
    const skipAuthHeader = /\/auth\/login-admin\b/i.test(url);

    if (token && !skipAuthHeader) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ───────── 응답 인터셉터
adminHttp.interceptors.response.use(
  (response: AxiosResponse) => {
    // 정상 응답
    if (response.status >= 200 && response.status < 300) return response;

    // 범위 밖 상태는 에러 처리
    return Promise.reject(response);
  },
  (error: AxiosError) => {
    const status = error?.response?.status;
    if (status === 419 || status === 401) {
      console.warn("🔒 관리자 인증 만료 또는 무효");
      // 필요 시 전역 이벤트나 슬라이스로 연결
      // window.dispatchEvent(new Event('admin:logout'))
    }
    return Promise.reject(error);
  },
);

export default adminHttp;
