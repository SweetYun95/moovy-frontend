// moovy-frontend/src/services/api/topicApi.ts
import moovy from './http'

export type Topic = {
  id: number
  images: string[]
  title: string
  runtime: string
  ageRating: 'all' | '12' | '15' | '18'
  synopsis: string
  releaseDate: string
  genre: string
  createdAt: string
  updatedAt: string
}

export type TopicList = {
  list: Topic[]
  total: number
}

export type CreateTopicRequest = {
  images: string[]
  title: string
  runtime: string
  ageRating: string
  synopsis: string
  releaseDate: {
    year: string
    month: string
    day: string
  }
  genre: string
}

export type UpdateTopicRequest = {
  images?: string[]
  title?: string
  runtime?: string
  ageRating?: string
  synopsis?: string
  releaseDate?: {
    year: string
    month: string
    day: string
  }
  genre?: string
}

/** 토픽 목록 조회 */
export async function getTopics() {
  const res = await moovy.get('/topic/list')
  return res.data as TopicList
}

/** 토픽 조회 */
export async function getTopic(id: number) {
  const res = await moovy.get(`/topic/${id}`)
  return res.data as Topic
}

/** 토픽 생성 */
export async function createTopic(data: CreateTopicRequest) {
  const res = await moovy.post('/topic', data)
  return res.data as Topic
}

/** 토픽 수정 */
export async function updateTopic(id: number, data: UpdateTopicRequest) {
  const res = await moovy.put(`/topic/${id}`, data)
  return res.data as Topic
}

/** 토픽 삭제 */
export async function deleteTopic(id: number) {
  const res = await moovy.delete(`/topic/${id}`)
  return res.data
}

/** 토픽 이미지 업로드 */
export async function uploadTopicImages(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })
  const res = await moovy.post('/topic/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data as { imageUrls: string[] }
}

