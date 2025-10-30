import React, { useRef, useState, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Icon } from '@iconify/react';
import 'swiper/css';

import { MovieCard } from './MovieCard';

interface MovieCardSliderProps {
  className?: string;
  sections: SliderSection[];
  onCardClick?: (title: string) => void;
}

export interface SliderSection {
  title: string;
  movies: any[]; // 무비 배열 (id, title, synopsis, imageUrl, overallRating 등 포함)
}


export const MovieCardSlider: React.FC<MovieCardSliderProps> = ({
  className = '',
  sections,
  onCardClick,
}) => {
  const swiperRef = useRef<any>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prevBtnId = 'movie-card-prev-btn';
  const nextBtnId = 'movie-card-next-btn';

  // 모바일 섹션 전용 내부 컴포넌트: 섹션별 슬라이더 + 자체 네비게이션
  const MobileSectionSlider: React.FC<{ section: SliderSection; index: number }> = ({ section, index }) => {
    const prevId = `movie-card-inner-prev-${index}`;
    const nextId = `movie-card-inner-next-${index}`;

    return (
      <div className="movie-card-section">
        <h2 className="movie-card-section__title">{section.title}</h2>

        <div className="movie-card-slider__inner-wrapper">
          <button
            id={prevId}
            className="movie-card-slider__nav-button movie-card-slider__nav-button--prev"
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
            className="movie-card-slider__inner-swiper"
          >
            {section.movies.map((movie: any) => (
              <SwiperSlide key={movie.id}>
                <div className="movie-card-section__grid">
                  <MovieCard
                    title={movie.title}
                    synopsis={movie.synopsis}
                    imageUrl={movie.imageUrl}
                    rating={movie.overallRating}
                    onCommentClick={() => onCardClick?.(movie.title)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            id={nextId}
            className="movie-card-slider__nav-button movie-card-slider__nav-button--next"
            aria-label="다음 슬라이드"
          >
            <Icon icon="mdi:chevron-right" width="24" height="24" />
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일: 카드 개별 슬라이드 (9개 카드 = 9개 슬라이드)
  // PC: 섹션 단위 슬라이드 (3개 섹션 = 3개 슬라이드)
  const slides = isMobile
    ? sections.flatMap((section) =>
        section.movies.map((movie) => ({
          ...movie,
          sectionTitle: section.title,
        }))
      )
    : sections;

  return (
    <div className={`movie-card-slider ${className}`}>
      <div className="movie-card-slider__wrapper">
        {!isMobile && (
          <button
            id={prevBtnId}
            ref={prevButtonRef}
            className="movie-card-slider__nav-button movie-card-slider__nav-button--prev"
            aria-label="이전 슬라이드"
          >
            <Icon icon="mdi:chevron-left" width="24" height="24" />
          </button>
        )}

        {isMobile ? (
          // 모바일: 타이틀별(섹션별) 세로 스택 + 내부 카드 슬라이더(개별 네비 포함)
          <div className="movie-card-slider__mobile-stack">
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
              className="movie-card-slider__swiper"
            >
              {sections.map((section, index) => (
                <SwiperSlide key={index}>
                  <div className="movie-card-section">
                    <h2 className="movie-card-section__title">{section.title}</h2>
                    <div className="movie-card-section__grid">
                      {section.movies.map((movie: any) => (
                        <MovieCard
                          key={movie.id}
                          title={movie.title}
                          synopsis={movie.synopsis}
                          imageUrl={movie.imageUrl}
                          rating={movie.overallRating}
                          onCommentClick={() => onCardClick?.(movie.title)}
                        />
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              id={nextBtnId}
              ref={nextButtonRef}
              className="movie-card-slider__nav-button movie-card-slider__nav-button--next"
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

export default MovieCardSlider;

