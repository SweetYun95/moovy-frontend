// 외부 라이브러리
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Icon } from '@iconify/react';
import 'swiper/css';

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchContentsThunk } from '@/features/content/contentSlice';
import { buildMovieSections } from '@/utils/homeSections';

// 컴포넌트
import { MovieCard } from './MovieCard';

interface MovieCardSliderProps {
  className?: string;
  onCardClick?: (title: string) => void;
  onSectionsChange?: (sections: SliderSection[]) => void;
}

export interface SliderSection {
  title: string;
  movies: any[]; // 무비 배열 (id, title, synopsis, imageUrl, overallRating 등 포함)
}

export const MovieCardSlider: React.FC<MovieCardSliderProps> = ({
  className = '',
  onCardClick,
  onSectionsChange,
}) => {
  const dispatch = useAppDispatch();
  const { contents, loading } = useAppSelector((s) => s.content);

  // 섹션 데이터 생성
  const sections = useMemo(() => {
    if (contents.length === 0) return [];
    return buildMovieSections(contents);
  }, [contents]);

  // 섹션 변경 시 콜백 호출 (HeroBanner에 전달)
  useEffect(() => {
    if (sections.length > 0 && onSectionsChange) {
      onSectionsChange(sections);
    }
  }, [sections, onSectionsChange]);

  // 초기 데이터 로드
  useEffect(() => {
    if (contents.length === 0) {
      dispatch(fetchContentsThunk());
    }
  }, [dispatch, contents.length]);
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
      <div className="movie-card-section mb-4">
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
                    id={movie.id}
                    title={movie.title}
                    synopsis={movie.synopsis}
                    imageUrl={movie.imageUrl}
                    rating={movie.overallRating}
                    onCommentClick={onCardClick ? () => onCardClick?.(movie.title) : undefined}
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
              loop={sections.length > 1}
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
                <SwiperSlide key={`section-${index}`}>
                  <div className="movie-card-section">
                    <h2 className="movie-card-section__title">{section.title}</h2>
                    <div className="movie-card-section__grid">
                      {section.movies.map((movie: any) => (
                        <MovieCard
                          key={movie.id}
                          id={movie.id}
                          title={movie.title}
                          synopsis={movie.synopsis}
                          imageUrl={movie.imageUrl}
                          rating={movie.overallRating}
                          onCommentClick={onCardClick ? () => onCardClick?.(movie.title) : undefined}
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

