// React
import React, { useEffect, useMemo, useState } from 'react'

// App hooks/state
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCommentsThunk } from '@/features/comments/commentSlice'
import { fetchContentsThunk } from '@/features/content/contentSlice'
import { useDisclosure } from '@/hooks/useDisclosure'

// UI components
import Spinner from '@/components/common/Spinner'
import HeroBanner from '@/components/Home/HeroBanner/HeroBanner'
import { ImageCommentCardSlider } from '@/components/Home/ImageCommentCard/ImageCommentCardSlider'
import { MovieCardSlider } from '@/components/Home/MovieCard/MovieCardSlider'
import { QuickMenu } from '@/components/Home/QuickMenu/QuickMenu'
import Footer from '@/components/layout/Footer/Footer'
import { Header } from '@/components/layout/Header/Header'
import { CommentDetailModal } from '@/components/modals/CommentDetailModal/CommentDetailModal'

// Utils
import { buildCommentSections, buildHeroSlides, buildMovieSections } from '@/utils/homeSections'
import { buildCommentDetailData } from '@/utils/modals'

export default function MainPage() {
  const dispatch = useAppDispatch()
  const { contents, loading: contentsLoading } = useAppSelector((s) => s.content)
  const { comments, loading: commentsLoading } = useAppSelector((s) => s.comment)
  const { isOpen: showCommentDetail, open: openCommentDetail, close: closeCommentDetail } = useDisclosure(false)
  const [commentDetailData, setCommentDetailData] = useState<{ username: string; date: string; content: string; likes: number; replies: number } | null>(null)

  // Hero 배너 슬라이드 데이터
  const heroSlides = useMemo(() => (contents.length ? buildHeroSlides(contents) : []), [contents])

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchContentsThunk())
    dispatch(fetchCommentsThunk())
  }, [dispatch])

  // 섹션 데이터 (영화/코멘트)
  const movieSections = useMemo(() => {
    if (contents.length === 0) return []
    return buildMovieSections(contents)
  }, [contents])

  const commentSections = useMemo(() => {
    if (comments.length === 0) return []
    return buildCommentSections(comments)
  }, [comments])

  const isLoading = contentsLoading || commentsLoading

  return (
    <>
      <Header 
        onSearchChange={(value) => console.log('검색:', value)}
        onSearch={(value) => console.log('검색 실행:', value)}
        onLoginClick={() => console.log('로그인 클릭')}
        onSignupClick={() => console.log('회원가입 클릭')}
      />
      {/* Hero Banner Section */}
      {heroSlides.length > 0 && (
        <div className="container mb-4">
          <HeroBanner slides={heroSlides} />
        </div>
      )}

      <div className="container py-4">
      {/* Quick Menu */}
      <div className="mb-4">
        <QuickMenu />
      </div>

      {isLoading ? (
        <div className="text-center py-5"><Spinner /></div>
      ) : (
        <>
          {/* Movie sections */}
          <div className="mb-4">
            <MovieCardSlider
              sections={movieSections}
              onCardClick={() => {}}
            />
          </div>

          {/* Comment section */}
          {commentSections.length > 0 && (
            <div className="mb-4">
              <ImageCommentCardSlider
                sections={commentSections}
                contents={contents}
                onCardClick={(data) => {
                  setCommentDetailData(buildCommentDetailData(data))
                  openCommentDetail()
                }}
              />
            </div>
          )}
        </>
      )}
      </div>
      <Footer/>
      {commentDetailData && (
        <CommentDetailModal
          isOpen={showCommentDetail}
          onClose={closeCommentDetail}
          commentData={commentDetailData}
        />
      )}
    </>
  )
}


