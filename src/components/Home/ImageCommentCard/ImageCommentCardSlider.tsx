import React, { useRef, useState, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Icon } from '@iconify/react';
import 'swiper/css';

import { ImageCommentCard } from './ImageCommentCard';

interface ImageCommentCardSliderProps {
  className?: string;
  sections: SliderSection[];
  contents: any[]; // 컨텐츠 배열 (id, title, imageUrl 등 포함)
  onCardClick?: (title: string) => void;
}

export interface SliderSection {
  title: string;
  comments: any[]; // 코멘트 배열 (id, username, comment, rating, likes, replies, contentId 등 포함)
}

export const ImageCommentCardSlider: React.FC<ImageCommentCardSliderProps> = ({
  className = '',
  sections,
  contents,
  onCardClick,
}) => {
  const swiperRef = useRef<any>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prevBtnId = 'image-comment-prev-btn';
  const nextBtnId = 'image-comment-next-btn';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일 섹션 전용 내부 컴포넌트: 섹션별 슬라이더 + 자체 네비게이션
  const MobileSectionSlider: React.FC<{ section: SliderSection; index: number }> = ({ section, index }) => {
    const prevId = `image-comment-inner-prev-${index}`;
    const nextId = `image-comment-inner-next-${index}`;

    return (
      <div className="image-comment-card-section">
        <h2 className="image-comment-card-section__title">{section.title}</h2>

        <div className="image-comment-card-slider__inner-wrapper">
          <button
            id={prevId}
            className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--prev"
            aria-label="이전 슬라이드"
          >
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
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="image-comment-card-slider__inner-swiper"
          >
            {section.comments.map((comment: any) => {
              const content = comment.contentId ? contents.find(c => c.id === comment.contentId) : null;
              return (
                <SwiperSlide key={comment.id}>
                  <div className="image-comment-card-section__grid">
                    <ImageCommentCard
                      username={comment.username}
                      movieTitle={content?.title || ''}
                      comment={comment.comment}
                      rating={comment.rating}
                      likes={comment.likes}
                      replies={comment.replies}
                      movieImageUrl={content?.imageUrl}
                      onLikeClick={() => onCardClick?.(content?.title || '')}
                      onReplyClick={() => onCardClick?.(content?.title || '')}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            id={nextId}
            className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--next"
            aria-label="다음 슬라이드"
          >
            <Icon icon="mdi:chevron-right" width="24" height="24" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`image-comment-card-slider ${className}`}>
      <div className="image-comment-card-slider__wrapper">
        {!isMobile && (
          <button
            id={prevBtnId}
            ref={prevButtonRef}
            className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--prev"
            aria-label="이전 슬라이드"
          >
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
                swiperRef.current = swiper;
              }}
              onAfterInit={(swiper) => {
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              className="image-comment-card-slider__swiper"
            >
              {sections.map((section, index) => (
                <SwiperSlide key={index}>
                  <div className="image-comment-card-section">
                    <h2 className="image-comment-card-section__title">{section.title}</h2>
                    <div className="image-comment-card-section__grid">
                      {section.comments.map((comment: any) => {
                        const content = comment.contentId ? contents.find(c => c.id === comment.contentId) : null;
                        return (
                          <ImageCommentCard
                            key={comment.id}
                            username={comment.username}
                            movieTitle={content?.title || ''}
                            comment={comment.comment}
                            rating={comment.rating}
                            likes={comment.likes}
                            replies={comment.replies}
                            movieImageUrl={content?.imageUrl}
                            onLikeClick={() => onCardClick?.(content?.title || '')}
                            onReplyClick={() => onCardClick?.(content?.title || '')}
                          />
                        );
                      })}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              id={nextBtnId}
              ref={nextButtonRef}
              className="image-comment-card-slider__nav-button image-comment-card-slider__nav-button--next"
              aria-label="다음 슬라이드"
            >
              <Icon icon="mdi:chevron-right" width="24" height="24" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCommentCardSlider;

