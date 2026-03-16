// moovy-frontend/src/pages/Home/MainPage.tsx

// 외부 라이브러리
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// 내부 유틸/전역/서비스
import { useDisclosure } from '@/hooks/useDisclosure'
import { buildCommentDetailData } from '@/utils/modals'

// 컴포넌트
import HeroBanner from '@/components/Home/HeroBanner/HeroBanner'
import { ImageCommentCardSlider } from '@/components/Home/ImageCommentCard/ImageCommentCardSlider'
import { MovieCardSlider } from '@/components/Home/MovieCard/MovieCardSlider'
import { QuickMenu } from '@/components/Home/QuickMenu/QuickMenu'
import { CommentDetailModal } from '@/components/modals/CommentDetailModal/CommentDetailModal'
import type { SliderSection } from '@/components/Home/MovieCard/MovieCardSlider'

export default function MainPage() {
   const { isOpen: showCommentDetail, open: openCommentDetail, close: closeCommentDetail } = useDisclosure(false)

   const [commentDetailData, setCommentDetailData] = useState<{
      id: number
      username: string
      date: string
      content: string
      likes: number
      replies: number
      profileImageUrl?: string
   } | null>(null)

   const [movieSections, setMovieSections] = useState<SliderSection[]>([])

   const dispatch = useDispatch()

   useEffect(() => {}, [dispatch])

   return (
      <>
         {/* Hero Banner Section */}
         {movieSections.length > 0 && (
            <div className="container py-4">
               <HeroBanner movieSections={movieSections} />
            </div>
         )}

         <div className="container py-4">
            {/* Quick Menu */}
            <div className="mb-4">
               <QuickMenu />
            </div>

            {/* Movie sections */}
            <div className="mb-4">
               <MovieCardSlider onSectionsChange={setMovieSections} />
            </div>

            {/* Comment section */}
            <div className="mb-4">
               <ImageCommentCardSlider
                  onCardClick={(data) => {
                     setCommentDetailData(buildCommentDetailData(data))
                     openCommentDetail()
                  }}
               />
            </div>
         </div>

         {commentDetailData && <CommentDetailModal isOpen={showCommentDetail} onClose={closeCommentDetail} commentData={commentDetailData} />}
      </>
   )
}
