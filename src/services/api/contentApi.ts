// moovy-frontend/src/services/api/contentApi.ts
import moovy from './http'

export type ContentCard = {
  id: number
  title: string
  year: string
  country: string
  rating: number
  imageUrl?: string
}

export type MovieCard = {
  id: number
  title: string
  synopsis: string
  imageUrl?: string
  rating: number
}

// Content API
export async function getContentCards() {
  const res = await moovy.get('/content/list')
  return res.data as ContentCard[]
}

export async function getContentCard(id: number) {
  const res = await moovy.get(`/content/${id}`)
  return res.data as ContentCard
}

// Movie API
export async function getMovieCards() {
  const res = await moovy.get('/movie/list')
  return res.data as MovieCard[]
}

export async function getMovieCard(id: number) {
  const res = await moovy.get(`/movie/${id}`)
  return res.data as MovieCard
}


