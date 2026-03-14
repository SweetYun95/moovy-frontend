// moovy-frontend/src/utils/homeSections.ts
import type React from 'react'

// 홈 페이지 섹션/슬라이드 구성 유틸
// - 리스트를 일정 개수로 분할하고, 각 섹션 타이틀과 함께 반환합니다.

export function chunkArray<T>(array: T[], size: number): T[][] {
   const chunks: T[][] = []
   for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
   }
   return chunks
}

export function buildMovieSections<T extends { title?: string }>(contents: T[]) {
   const parts = chunkArray(contents, 3)
   return [
      { title: '요즘뜨는 신작 TOP : 토론 ON', movies: parts[0] || [] },
      { title: '현재 상영작 TOP : 이야기하러 가볼까?', movies: parts[1] || [] },
      { title: 'MOOVY 추천작 TOP : 언제봐도 명작이다..!', movies: parts[2] || [] },
   ]
}

export type CommentSortType = 'replies' | 'likes' | 'recent'

export function sortCommentsBy<T extends { replies?: number; likes?: number; created_at?: string }>(comments: T[], sortBy?: CommentSortType): T[] {
   if (!sortBy) return comments

   const sortedComments = [...comments]

   switch (sortBy) {
      case 'replies':
         return sortedComments.sort((a, b) => (b.replies ?? 0) - (a.replies ?? 0))
      case 'likes':
         return sortedComments.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
      case 'recent':
         return sortedComments.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
            return dateB - dateA
         })
      default:
         return sortedComments
   }
}

export function getCommentListTitle(topicTitle?: string | null, sortBy?: CommentSortType | null, count: number = 0): string {
   if (topicTitle) {
      return `${topicTitle} - 코멘트 (${count})`
   }

   switch (sortBy) {
      case 'replies':
         return `핫 토크 리뷰 (${count})`
      case 'likes':
         return `베스트 리뷰 (${count})`
      case 'recent':
         return `실시간 리뷰 (${count})`
      default:
         return `코멘트 목록 (${count})`
   }
}

export function buildCommentSections<T extends { replies?: number; likes?: number; created_at?: string }>(comments: T[], limitPerSection?: number) {
   const hotTalkComments = sortCommentsBy(comments, 'replies')
   const bestComments = sortCommentsBy(comments, 'likes')
   const recentComments = sortCommentsBy(comments, 'recent')

   const limit = limitPerSection || Infinity

   return [
      {
         title: '핫 토크 리뷰',
         comments: hotTalkComments.slice(0, limit),
         sortType: 'replies' as CommentSortType,
      },
      {
         title: '베스트 리뷰',
         comments: bestComments.slice(0, limit),
         sortType: 'likes' as CommentSortType,
      },
      {
         title: '실시간 리뷰',
         comments: recentComments.slice(0, limit),
         sortType: 'recent' as CommentSortType,
      },
   ]
}

export interface SliderSection {
   title: string
   movies: any[]
}

export interface HeroSlide {
   id?: string | number
   imageUrl: string
   title?: string
   subtitle?: string
   synopsis?: string
   ctaText?: string
   onCtaClick?: () => void
   card?: React.ReactNode
}

export function buildHeroSlides(sections: SliderSection[]): HeroSlide[] {
   return sections
      .filter((section) => section.movies && section.movies.length > 0)
      .map((section) => {
         const randomIndex = Math.floor(Math.random() * section.movies.length)
         const movie = section.movies[randomIndex]

         return {
            id: movie.id,
            imageUrl: movie.images?.[0] || movie.imageUrl || 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop',
            title: movie.title,
            synopsis: movie.synopsis,
            ctaText: '코멘트 작성하러 가기',
         }
      })
}
