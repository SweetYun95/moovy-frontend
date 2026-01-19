// moovy-frontend/src/services/api/admin/adminDashboardApi.ts
import adminHttp from './adminHttp'

/**
 * Admin Dashboard API
 * - 대시보드에서 필요한 통계/집계 데이터를 가져오는 전용 API 모듈
 * - User/Topic 등 CRUD 도메인과 분리해서 유지보수하기 쉽게 관리
 */

/** 월별 사용자 수(올해 vs 작년) */
export type DashboardUsersMonthly = {
   /** 예: "1월" 또는 "2025-01" 등 (백엔드 컨벤션에 맞춰 내려주기) */
   month: string
   /** 올해 사용자 수(누적 or 월간, 백엔드 정책에 맞춤) */
   thisYear: number
   /** 작년 사용자 수(누적 or 월간, 백엔드 정책에 맞춤) */
   lastYear: number
}

/** TOP 랭킹(조회수/코멘트 수 등) 공통 아이템 */
export type DashboardTopItem = {
   /** 영화/컨텐츠명(또는 표시 라벨) */
   label: string
   /** 지표 값(예: comments 또는 views) */
   value: number
   /** (옵션) 컨텐츠 id가 필요하면 백엔드에서 같이 내려주도록 확장 가능 */
   id?: number
}

/** 대시보드 응답 */
export type AdminDashboardResponse = {
   /** 월별 사용자 통계 */
   usersMonthly: DashboardUsersMonthly[]
   /** 코멘트 많은 컨텐츠 TOP N */
   topCommented: DashboardTopItem[]
   /** 조회수 많은 컨텐츠 TOP N */
   topViewed: DashboardTopItem[]
   /** (옵션) 기준일/기간 등 메타 정보가 필요하면 확장 */
   meta?: {
      generatedAt?: string // ISO string
      range?: { from: string; to: string }
   }
}

/**
 * 대시보드 데이터 조회
 * GET /admin/dashboard
 */
export async function fetchAdminDashboard(params?: {
   /** 예: 2025 (기간/연도 기준이 필요하면 백엔드에서 지원) */
   year?: number
   /** TOP 리스트 개수 (기본 9 같은 값) */
   topN?: number
}) {
   const { data } = await adminHttp.get<AdminDashboardResponse>('/dashboard', {
      params,
   })
   return data
}

/**
 * (선택) 사용자 월별 통계만 별도 조회
 * - 백엔드가 분리 엔드포인트를 제공할 때만 사용
 * GET /admin/dashboard/users-monthly
 */
export async function fetchDashboardUsersMonthly(params?: { year?: number }) {
   const { data } = await adminHttp.get<DashboardUsersMonthly[]>('/dashboard/users-monthly', { params })
   return data
}

/**
 * (선택) 코멘트 TOP만 별도 조회
 * - 백엔드가 분리 엔드포인트를 제공할 때만 사용
 * GET /admin/dashboard/top-commented
 */
export async function fetchDashboardTopCommented(params?: { topN?: number }) {
   const { data } = await adminHttp.get<DashboardTopItem[]>('/dashboard/top-commented', { params })
   return data
}

/**
 * (선택) 조회수 TOP만 별도 조회
 * - 백엔드가 분리 엔드포인트를 제공할 때만 사용
 * GET /admin/dashboard/top-viewed
 */
export async function fetchDashboardTopViewed(params?: { topN?: number }) {
   const { data } = await adminHttp.get<DashboardTopItem[]>('/dashboard/top-viewed', { params })
   return data
}
