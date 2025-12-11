// moovy-frontend/src/services/api/test_authApi.ts
import test_moovy from "./test_http";

export type Role = "USER" | "ADMIN";
export type Provider = "local" | "google" | "kakao";

export type User = {
  id: number;
  name: string;
  nickname?: string;
  email?: string;
  role: Role;
  provider?: Provider;
  avatarUrl?: string;
};

/** ✅ 로컬 로그인 */
export async function loginLocal(payload: { email: string; password: string }) {
  const res = await test_moovy.post("/auth/login", payload);
  const token = (res.data?.token ?? "") as string;
  if (token) localStorage.setItem("token", token);
  return res.data as { user: User; token?: string };
}

/** ✅ 회원가입 */
export async function joinLocal(payload: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await test_moovy.post("/auth/signup", payload);
  return res.data;
}

/** ✅ 로그아웃 */
export async function logout() {
  try {
    await test_moovy.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
  }
}

/** ✅ 로컬 세션 확인 (/auth/me) */
export async function meLocal() {
  const res = await test_moovy.get("/auth/me");
  if (res.status !== 200) throw new Error("NOT_AUTHED");
  const user = res.data as User;
  return { ...user, provider: "local" as const };
}

/** ✅ 구글 세션 확인 (/auth/google/me) */
export async function meGoogle() {
  const res = await test_moovy.get("/auth/google/me");
  if (res.status !== 200) throw new Error("NOT_AUTHED");
  const user = res.data as User;
  return { ...user, provider: "google" as const };
}

/** ✅ 카카오 세션 확인 (/auth/kakao/me) */
export async function meKakao() {
  const res = await test_moovy.get("/auth/kakao/me");
  if (res.status !== 200) throw new Error("NOT_AUTHED");
  const user = res.data as User;
  return { ...user, provider: "kakao" as const };
}
