// moovy-frontend/src/services/api/inquiryApi.ts
import moovy from './http'

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

