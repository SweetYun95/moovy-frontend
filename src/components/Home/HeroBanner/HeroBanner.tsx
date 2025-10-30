import React from 'react'
import './HeroBanner.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import { WideButton } from '@/components/common/Button/Button'
import { Icon } from '@iconify/react'

export interface HeroSlide {
  imageUrl: string
  title?: string
  subtitle?: string
  synopsis?: string
  ctaText?: string
  onCtaClick?: () => void
  card?: React.ReactNode
}

export interface HeroBannerProps {
  slides: HeroSlide[]
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ slides }) => {
  if (!slides?.length) return null

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
          {slides.map((s, idx) => (
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
                      <WideButton buttonType="comment" onClick={s.onCtaClick}>
                        {s.ctaText}
                      </WideButton>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
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


