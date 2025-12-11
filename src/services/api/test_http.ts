// moovy-frontend/src/services/api/test_http.ts
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL as string;

// 공용 Axios 인스턴스
const test_moovy = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ───────── 요청 인터셉터
test_moovy.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    const url = (config.url || "").toString();

    // 로그인/회원가입 계열은 토큰 생략
    const skipAuthHeader = /\/auth\/(login|login-admin|join)\b/i.test(url);

    if (token && !skipAuthHeader) {
      (config.headers as any).Authorization = `${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ───────── 응답 인터셉터
test_moovy.interceptors.response.use(
  (response: AxiosResponse) => {
    // /auth/me 는 401도 상위에서 처리하도록 통과
    if (response.config?.url?.includes("/auth/me") && response.status === 401) {
      return response;
    }

    if (response.status < 200 || response.status >= 300) {
      return Promise.reject(response);
    }
    return response;
  },
  (error: AxiosError) => Promise.reject(error),
);

export default test_moovy;
