// 외부 라이브러리
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { Icon } from '@iconify/react'
import 'swiper/css'

// 내부 유틸/전역/서비스
import { PATHS } from '@/routes/paths'
import { buildHeroSlides, type SliderSection } from '@/utils/homeSections'

// 컴포넌트
import { WideButton } from '@/components/common/Button/Button'
import './HeroBanner.scss'

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

export interface HeroBannerProps {
  movieSections?: SliderSection[]
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movieSections }) => {
  // movieSections를 기반으로 Hero 슬라이드 생성
  const slides = useMemo(() => {
    if (!movieSections || movieSections.length === 0) return [];
    return buildHeroSlides(movieSections);
  }, [movieSections]);

  if (!slides?.length) return null

  const navigate = useNavigate()
  const prevBtnId = 'hero-banner-prev-btn'
  const nextBtnId = 'hero-banner-next-btn'

  return (
    <div className="hero-banner border-0 overflow-hidden">
      <div className="hero-banner__wrapper">
        <button
          id={prevBtnId}
          className="hero-banner__nav-button hero-banner__nav-button--prev"
          aria-label="이전 슬라이드"
        >
          <Icon icon="mdi:chevron-left" width="24" height="24" />
        </button>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoHeight
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation={{ prevEl: `#${prevBtnId}`, nextEl: `#${nextBtnId}` }}
          onAfterInit={(swiper) => {
            swiper.navigation.init()
            swiper.navigation.update()
          }}
          className="hero-banner__swiper"
        >
          {slides.map((s, idx) => {
            const handleCtaClick = () => {
              console.log('HeroBanner button clicked, id:', s.id);
              if (s.onCtaClick) {
                s.onCtaClick();
              } else if (s.id) {
                navigate(PATHS.contentDetail(s.id));
              } else {
                console.warn('HeroBanner: No id or onCtaClick provided');
              }
            };
            
            return (
              <SwiperSlide key={idx}>
                <div className="hero-banner__slide">
                  <div
                    className="hero-banner__image"
                    style={{ backgroundImage: `url(${s.imageUrl})` }}
                  />
                  {(s.title || s.synopsis || s.ctaText || s.card) && (
                    <div className="hero-banner__content">
                      {s.title && <h2 className="hero-banner__title">{s.title}</h2>}
                      {s.synopsis && <p className="hero-banner__synopsis">{s.synopsis}</p>}
                      {s.ctaText && (
                        <WideButton 
                          buttonType="comment" 
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleCtaClick();
                          }}
                        >
                          {s.ctaText}
                        </WideButton>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          id={nextBtnId}
          className="hero-banner__nav-button hero-banner__nav-button--next"
          aria-label="다음 슬라이드"
        >
          <Icon icon="mdi:chevron-right" width="24" height="24" />
        </button>
      </div>
    </div>
  )
}

export default HeroBanner


