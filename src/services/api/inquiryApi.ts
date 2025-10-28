// moovy-frontend/src/services/api/inquiryApi.ts
import moovy from './http'
import type { SelectorOption } from '../../components/common/Selector/SelectorStyle'

export type Inquiry = {
  id: number
  category: string
  content: string
  status: 'pending' | 'processing' | 'completed'
  createdAt: string
  updatedAt: string
}

export type InquiryList = {
  list: Inquiry[]
  total: number
}

export type CreateInquiryRequest = {
  category: string
  content: string
}

export type UpdateInquiryStatusRequest = {
  status: 'pending' | 'processing' | 'completed'
}

/** 문의 목록 조회 */
export async function getInquiries() {
  const res = await moovy.get('/inquiry/list')
  return res.data as InquiryList
}

/** 문의 조회 */
export async function getInquiry(id: number) {
  const res = await moovy.get(`/inquiry/${id}`)
  return res.data as Inquiry
}

/** 문의 생성 (일반 사용자) */
export async function createInquiry(data: CreateInquiryRequest) {
  const res = await moovy.post('/inquiry', data)
  return res.data
}

/** 문의 상태 변경 (관리자) */
export async function updateInquiryStatus(id: number, data: UpdateInquiryStatusRequest) {
  const res = await moovy.put(`/inquiry/${id}/status`, data)
  return res.data
}

/** 문의 삭제 */
export async function deleteInquiry(id: number) {
  const res = await moovy.delete(`/inquiry/${id}`)
  return res.data
}

/** 문의 카테고리 목록 조회 */
export async function getInquiryCategories(): Promise<SelectorOption[]> {
  try {
    // TODO: API 엔드포인트가 준비되면 다음처럼 사용
    // const res = await moovy.get('/inquiry/categories')
    // return res.data
    
    // API가 없으면 기본값 반환
    return INQUIRY_CATEGORY_OPTIONS
  } catch (error) {
    // 에러 시 기본값 반환
    return INQUIRY_CATEGORY_OPTIONS
  }
}

// 기본 카테고리 옵션 (API 에러 시 폴백)
export const INQUIRY_CATEGORY_OPTIONS: SelectorOption[] = [
  { value: 'general', label: '일반 문의' },
  { value: 'technical', label: '기술 지원' },
  { value: 'account', label: '계정 문의' },
  { value: 'report', label: '신고' },
  { value: 'other', label: '기타' },
]

