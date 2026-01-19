// 외부 라이브러리
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { Icon } from '@iconify/react'
import 'swiper/css'

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCommentsThunk, type CommentItem } from '@/features/comments/commentSlice'
import { fetchContentsThunk } from '@/features/content/contentSlice'
import { buildCommentSections, type CommentSortType } from '@/utils/homeSections'
import { convertCommentItemToCard } from '@/utils/contentUtils'
import { PATHS } from '@/routes/paths'

// 컴포넌트
import { ImageCommentCard } from './ImageCommentCard'
import Spinner from '@/components/common/Spinner'

interface ImageCommentCardSliderProps {
   className?: string
   onCardClick?: (data: { id?: number; title: string; likes: number; replies: number; comment: string; username: string }) => void
}

export interface SliderSection {
   title: string
   comments: any[] // 코멘트 배열 (id, username, comment, rating, likes, replies, contentId 등 포함)
   sortType?: CommentSortType
}

export const ImageCommentCardSlider: React.FC<ImageCommentCardSliderProps> = ({ className = '', onCardClick }) => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()
   const { contents } = useAppSelector((s) => s.content)
   const comments = useAppSelector((s) => {
      // 모든 토픽의 코멘트를 합쳐서 반환
      const allComments: any[] = []
      Object.values(s.comments.byTopicId).forEach((bucket) => {
         allComments.push(...bucket.items)
      })
      return allComments
   })
   const loading = useAppSelector((s) => {
      // 모든 토픽의 코멘트 로딩 상태 (하나라도 로딩 중이면 true)
      return Object.values(s.comments.byTopicId).some((bucket) => bucket.loading)
   })

   // 섹션 클릭 핸들러 (정렬 기준으로 코멘트 리스트 페이지로 이동)
   const handleSectionClick = (sortType: CommentSortType) => {
      navigate(`${PATHS.comments}?sortBy=${sortType}`)
   }

   // 섹션 데이터 생성 (CommentItem[]를 CommentCard[]로 변환하여 사용)
   const sections = useMemo(() => {
      // console.log('ImageCommentCardSlider - useMemo - comments:', comments);
      // console.log('ImageCommentCardSlider - useMemo - comments.length:', comments.length);
      // if (!comments || comments.length === 0) {
      //   console.log('ImageCommentCardSlider - useMemo - no comments, returning empty array');
      //   return [];
      // }
      // CommentItem[]를 CommentCard[]로 변환
      const commentCards = comments.map(convertCommentItemToCard)
      // 슬라이더는 한 섹션당 3개 표시 (가로 2개씩 나열될 때 2행 2열로 4개 표시)
      const result = buildCommentSections(commentCards, 4)
      // console.log('ImageCommentCardSlider - useMemo - sections result:', result);
      // console.log('ImageCommentCardSlider - useMemo - sections length:', result.length);
      // result.forEach((section, idx) => {
      //   console.log(`ImageCommentCardSlider - useMemo - section ${idx}:`, {
      //     title: section.title,
      //     commentsCount: section.comments?.length || 0,
      //     sortType: section.sortType,
      //   });
      // });
      return result
   }, [comments])

   // 초기 데이터 로드
   useEffect(() => {
      // console.log('ImageCommentCardSlider - useEffect - comments.length:', comments.length, 'loading:', loading)
      if (comments.length === 0 && !loading) {
         //  console.log('ImageCommentCardSlider - fetching comments...')
         dispatch(fetchCommentsThunk())
      }
      if (contents.length === 0) {
         dispatch(fetchContentsThunk())
      }
   }, [dispatch, comments.length, contents.length, loading])
   const swiperRef = useRef<any>(null)
   const prevButtonRef = useRef<HTMLButtonElement>(null)
   const nextButtonRef = useRef<HTMLButtonElement>(null)
   const [isMobile, setIsMobile] = useState(false)
   const prevBtnId = 'image-comment-prev-btn'
   const nextBtnId = 'image-comment-next-btn'

   useEffect(() => {
      const checkMobile = () => {
         setIsMobile(window.innerWidth <= 767)
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
   }, [])

   // 모바일 섹션 전용 내부 컴포넌트: 섹션별 슬라이더 + 자체 네비게이션
   const MobileSectionSlider: React.FC<{ section: SliderSection; index: number }> = ({ section, index }) => {
      const prevId = `image-comment-inner-prev-${index}`
      const nextId = `image-comment-inner-next-${index}`

      return (
         <div className="image-comment-card-section mb-4">
            <div className="image-comment-card-section__header">
               <h2 className="image-comment-card-section__title">{section.title}</h2>
               {section.sortType && (
                  <button className="image-comment-card-section__arrow-button" onClick={() => handleSectionClick(section.sortType!)} aria-label={`${section.title} 더보기`}>
                     <Icon icon="mdi:chevron-right" width="24" height="24" />
                  </button>
               )}
            </div>

            <div className="image-comment-card-slider__inner-wrapper">
               <button id={prevId} className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--prev" aria-label="이전 슬라이드">
                  <Icon icon="mdi:chevron-left" width="24" height="24" />
               </button>

               <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  loop={true}
                  navigation={{
                     prevEl: `#${prevId}`,
                     nextEl: `#${nextId}`,
                  }}
                  autoplay={{
                     delay: 5000,
                     disableOnInteraction: false,
                     pauseOnMouseEnter: true,
                  }}
                  onSwiper={(swiper) => {
                     // 내부 슬라이더 초기화
                     swiper.navigation.init()
                     swiper.navigation.update()
                  }}
                  className="image-comment-card-slider__inner-swiper"
               >
                  {section.comments.map((comment: any) => {
                     const content = comment.contentId ? contents.find((c) => c.id === comment.contentId) : null
                     // 원본 CommentItem 찾기 (comment.id는 comment_id)
                     const originalCommentItem = comments.find((item: CommentItem) => item.comment_id === comment.id)

                     return (
                        <SwiperSlide key={comment.id}>
                           <div className="image-comment-card-section__grid">
                              <ImageCommentCard
                                 username={comment.username || '익명'}
                                 movieTitle={content?.title || ''}
                                 comment={comment.comment || ''}
                                 rating={comment.rating ?? 0}
                                 likes={comment.likes ?? 0}
                                 replies={comment.replies ?? 0}
                                 movieImageUrl={content?.imageUrl}
                                 commentItem={originalCommentItem}
                                 onClick={(commentItem) => {
                                    if (commentItem && onCardClick) {
                                       onCardClick({
                                          id: commentItem.comment_id,
                                          title: content?.title || '',
                                          likes: commentItem.likes ?? 0,
                                          replies: commentItem.replies ?? 0,
                                          comment: commentItem.content || '',
                                          username: comment.username || '익명',
                                       })
                                    } else if (onCardClick) {
                                       onCardClick({
                                          id: comment.id,
                                          title: content?.title || '',
                                          likes: comment.likes ?? 0,
                                          replies: comment.replies ?? 0,
                                          comment: comment.comment || '',
                                          username: comment.username || '익명',
                                       })
                                    }
                                 }}
                              />
                           </div>
                        </SwiperSlide>
                     )
                  })}
               </Swiper>

               <button id={nextId} className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--next" aria-label="다음 슬라이드">
                  <Icon icon="mdi:chevron-right" width="24" height="24" />
               </button>
            </div>
         </div>
      )
   }

   // 로딩 중이거나 데이터가 없을 때
   if (loading && comments.length === 0) {
      return (
         <div className={`image-comment-card-slider ${className}`}>
            <div className="text-center py-5">
               <Spinner />
            </div>
         </div>
      )
   }

   if (sections.length === 0) {
      // console.log('ImageCommentCardSlider - sections.length is 0, returning null')
      // console.log('ImageCommentCardSlider - current state:', {
      //    commentsLength: comments.length,
      //    loading: loading,
      //    sectionsLength: sections.length,
      // })
      return null
   }

   //  console.log('ImageCommentCardSlider - rendering with sections:', sections.length)

   return (
      <div className={`image-comment-card-slider ${className}`}>
         <div className="image-comment-card-slider__wrapper">
            {!isMobile && (
               <button id={prevBtnId} ref={prevButtonRef} className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--prev" aria-label="이전 슬라이드">
                  <Icon icon="mdi:chevron-left" width="24" height="24" />
               </button>
            )}

            {isMobile ? (
               // 모바일: 타이틀별(섹션별) 세로 스택 + 내부 카드 슬라이더(개별 네비 포함)
               <div className="image-comment-card-slider__mobile-stack">
                  {sections.map((section, index) => (
                     <MobileSectionSlider section={section} index={index} key={index} />
                  ))}
               </div>
            ) : (
               <>
                  <Swiper
                     modules={[Navigation, Autoplay]}
                     spaceBetween={40}
                     slidesPerView={1}
                     loop={true}
                     navigation={{
                        prevEl: `#${prevBtnId}`,
                        nextEl: `#${nextBtnId}`,
                     }}
                     autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                     }}
                     onSwiper={(swiper) => {
                        swiperRef.current = swiper
                     }}
                     onAfterInit={(swiper) => {
                        swiper.navigation.init()
                        swiper.navigation.update()
                     }}
                     className="image-comment-card-slider__swiper"
                  >
                     {sections.map((section, index) => (
                        <SwiperSlide key={index}>
                           <div className="image-comment-card-section">
                              <div className="image-comment-card-section__header">
                                 <h2 className="image-comment-card-section__title">{section.title}</h2>
                                 {section.sortType && (
                                    <button className="image-comment-card-section__arrow-button" onClick={() => handleSectionClick(section.sortType!)} aria-label={`${section.title} 더보기`}>
                                       <Icon icon="mdi:chevron-right" width="24" height="24" />
                                    </button>
                                 )}
                              </div>
                              <div className="image-comment-card-section__grid">
                                 {section.comments.map((comment: any) => {
                                    const content = comment.contentId ? contents.find((c) => c.id === comment.contentId) : null
                                    // 원본 CommentItem 찾기 (comment.id는 comment_id)
                                    const originalCommentItem = comments.find((item: CommentItem) => item.comment_id === comment.id)

                                    return (
                                       <ImageCommentCard
                                          key={comment.id}
                                          username={comment.username || '익명'}
                                          movieTitle={content?.title || ''}
                                          comment={comment.comment || ''}
                                          rating={comment.rating ?? 0}
                                          likes={comment.likes ?? 0}
                                          replies={comment.replies ?? 0}
                                          movieImageUrl={content?.imageUrl}
                                          commentItem={originalCommentItem}
                                          onClick={(commentItem) => {
                                             if (commentItem && onCardClick) {
                                                onCardClick({
                                                   id: commentItem.comment_id,
                                                   title: content?.title || '',
                                                   likes: commentItem.likes ?? 0,
                                                   replies: commentItem.replies ?? 0,
                                                   comment: commentItem.content || '',
                                                   username: comment.username || '익명',
                                                })
                                             } else if (onCardClick) {
                                                onCardClick({
                                                   id: comment.id,
                                                   title: content?.title || '',
                                                   likes: comment.likes ?? 0,
                                                   replies: comment.replies ?? 0,
                                                   comment: comment.comment || '',
                                                   username: comment.username || '익명',
                                                })
                                             }
                                          }}
                                       />
                                    )
                                 })}
                              </div>
                           </div>
                        </SwiperSlide>
                     ))}
                  </Swiper>

                  <button id={nextBtnId} ref={nextButtonRef} className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--next" aria-label="다음 슬라이드">
                     <Icon icon="mdi:chevron-right" width="24" height="24" />
                  </button>
               </>
            )}
         </div>
      </div>
   )
}

export default ImageCommentCardSlider
