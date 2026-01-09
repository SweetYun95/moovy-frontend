// src/components/profile/CalendarSection.tsx
import { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Icon } from "@iconify/react";
import { fetchFavorites, selectFavorites } from "@/features/favorite/favoriteSlice";
import { selectContents } from "@/features/content/contentSlice";
import "./CalendarSection.scss";

interface CalendarDay {
  date: Date | null;
  contentId?: number;
  contentImage?: string;
  contentTitle?: string;
  badgeCount?: number;
}

export const CalendarSection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [currentPage, setCurrentPage] = useState(0);
  const ratingState = useAppSelector((state) => state.rating.byContentId);
  const contents = useAppSelector(selectContents);
  const favorites = useAppSelector(selectFavorites);

  // 보관한 영화 데이터 로드
  useEffect(() => {
    dispatch(fetchFavorites({ page: 1, limit: 1000 }));
  }, [dispatch]);

  // 보관한 영화 목록 (날짜별로 그룹화)
  const bookmarkedContentsByDate = useMemo(() => {
    const map = new Map<string, Array<{
      id: number;
      title: string;
      imageUrl: string | null;
      bookmarkedAt: string;
    }>>();
    
    // 실제 보관한 영화 데이터를 날짜별로 그룹화
    favorites.forEach((favorite) => {
      if (favorite.favorited_at) {
        const date = new Date(favorite.favorited_at);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        
        const content = contents.find((c) => c.id === favorite.content_id);
        map.get(dateKey)!.push({
          id: favorite.content_id,
          title: favorite.title,
          imageUrl: favorite.poster || content?.poster || null,
          bookmarkedAt: favorite.favorited_at,
        });
      }
    });
    
    return map;
  }, [favorites, contents]);
  
  // 선택된 날짜의 보관한 영화 목록
  const selectedDateBookmarks = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    return bookmarkedContentsByDate.get(dateKey) || [];
  }, [selectedDate, bookmarkedContentsByDate]);

  // 현재 페이지에 표시할 영화 카드 (9개씩)
  const displayedBookmarks = useMemo(() => {
    const startIndex = currentPage * 9;
    return selectedDateBookmarks.slice(startIndex, startIndex + 9);
  }, [selectedDateBookmarks, currentPage]);

  // 총 페이지 수
  const totalPages = Math.ceil(selectedDateBookmarks.length / 9);

  // 날짜가 변경되면 페이지를 0으로 리셋
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setCurrentPage(0);
  };

  // 최근 평가한 작품 목록 (오른쪽 포스터용)
  const recentRatedContents = useMemo(() => {
    // 목업 데이터
    const mockContents = [
      {
        id: 1,
        title: "다 이루어질 지니",
        imageUrl: "https://picsum.photos/200/300?random=1",
        releaseDate: "2020-10-03",
        platform: "NETFLIX",
        createdAt: "2020-10-09",
        myRating: 4.5,
      },
      {
        id: 2,
        title: "사마귀",
        imageUrl: "https://picsum.photos/200/300?random=2",
        releaseDate: "2020-09-26",
        platform: "NETFLIX",
        createdAt: "2020-10-16",
        myRating: 4.0,
      },
      {
        id: 3,
        title: "마담",
        imageUrl: "https://picsum.photos/200/300?random=3",
        year: "2025",
        country: "대한민국",
        createdAt: "2020-10-16",
        myRating: 3.5,
      },
    ] as any[];
    
    // 실제 데이터와 목업 데이터 합치기
    const allContents = [
      ...mockContents,
      ...contents
        .filter((content) => {
          const bucket = ratingState[content.id];
          return bucket && bucket.myPoint !== null && bucket.myPoint !== undefined;
        })
        .map((content) => {
          const bucket = ratingState[content.id];
          return {
            ...content,
            myRating: bucket.myPoint!,
          };
        }),
    ];
    
    return allContents
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 9); // 최대 9개 (3개 표시 + 9개 플레이스홀더)
  }, [ratingState, contents]);

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null });
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateKey = `${year}-${month}-${day}`;
      const bookmarkedContentsForDate = bookmarkedContentsByDate.get(dateKey) || [];
      const firstContent = bookmarkedContentsForDate[0];

      days.push({
        date: currentDate,
        contentId: firstContent?.id,
        contentImage: firstContent?.imageUrl,
        contentTitle: firstContent?.title,
        badgeCount: bookmarkedContentsForDate.length > 0 ? bookmarkedContentsForDate.length : undefined,
      });
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarDays = getDaysInMonth(currentMonth);

  const handleContentClick = (contentId: number) => {
    navigate(PATHS.contentDetail(contentId));
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.date) {
      // 같은 날짜를 다시 클릭하면 선택 해제
      if (selectedDate && 
          selectedDate.getFullYear() === day.date.getFullYear() &&
          selectedDate.getMonth() === day.date.getMonth() &&
          selectedDate.getDate() === day.date.getDate()) {
        handleDateChange(null);
      } else {
        handleDateChange(day.date);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const isDateSelected = (day: CalendarDay) => {
    if (!day.date || !selectedDate) return false;
    return (
      day.date.getFullYear() === selectedDate.getFullYear() &&
      day.date.getMonth() === selectedDate.getMonth() &&
      day.date.getDate() === selectedDate.getDate()
    );
  };

  return (
    <div className="row mt-5 mb-5 calendar-section">
      {/* 왼쪽: 캘린더 */}
      <div className="col-12 col-md-6">
        <div className="calendar-wrapper">
          {/* 월 네비게이션 */}
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={goToPreviousMonth}
              aria-label="이전 달"
            >
              <Icon icon="mdi:chevron-left" width="24" height="24" />
            </button>
            <span className="calendar-month-year">
              {currentMonth.getFullYear()} {monthNames[currentMonth.getMonth()]}
            </span>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={goToNextMonth}
              aria-label="다음 달"
            >
              <Icon icon="mdi:chevron-right" width="24" height="24" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="calendar-weekdays">
            {dayNames.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day.date ? "has-date" : "empty"} ${isDateSelected(day) ? "active" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                {day.date && (
                  <>
                    <span className="calendar-day-number">{day.date.getDate()}</span>
                    {day.contentImage && (
                      <div className="calendar-day-content">
                        <img
                          src={day.contentImage}
                          alt={day.contentTitle}
                          className="calendar-day-poster"
                        />
                        {day.badgeCount && day.badgeCount > 0 && (
                          <span className="calendar-day-badge">{day.badgeCount}</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 오른쪽: 영화 포스터 목록 */}
      <div className="col-12 col-md-6">
        <div className="content-posters-wrapper">
          <div className="content-posters">
            {selectedDate ? (
              // 선택된 날짜의 보관한 영화 카드 표시
              <>
                {selectedDateBookmarks.length > 0 ? (
                  <>
                    {displayedBookmarks.map((content) => {
                      const fullContent = contents.find((c) => c.id === content.id);
                      return (
                        <div
                          key={content.id}
                          className="content-poster-item"
                          onClick={() => handleContentClick(content.id)}
                        >
                          {content.imageUrl && (
                            <img
                              src={content.imageUrl}
                              alt={content.title}
                              className="content-poster-image"
                            />
                          )}
                          <div className="content-poster-info">
                            <h6 className="content-poster-title">{content.title}</h6>
                            <p className="content-poster-meta">
                              {fullContent?.releaseDate
                                ? `ONLY ON NETFLIX | ${new Date(fullContent.releaseDate).toLocaleDateString("ko-KR", {
                                    month: "long",
                                    day: "numeric",
                                  })} 공개`
                                : fullContent?.year
                                  ? `${fullContent.year}년${fullContent.country ? ` | ${fullContent.country}` : ""}`
                                  : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {/* 빈 플레이스홀더 (9개 중 남은 개수) */}
                    {Array.from({ length: Math.max(0, 9 - displayedBookmarks.length) }).map((_, index) => (
                      <div key={`placeholder-${index}`} className="content-poster-placeholder" />
                    ))}
                  </>
                ) : (
                  <>
                    {/* 높이 유지를 위한 숨겨진 플레이스홀더 9개 */}
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={`hidden-placeholder-${index}`} className="content-poster-placeholder" style={{ visibility: "hidden" }} />
                    ))}
                    {/* 안내 메시지 (그리드 밖에 절대 위치) */}
                    <div className="content-poster-empty-message">
                      <p className="text-muted">이 날짜에 보관한 영화가 없습니다.</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              // 선택된 날짜가 없을 때는 아무것도 표시하지 않음
              <>
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={`placeholder-${index}`} className="content-poster-placeholder" />
                ))}
              </>
            )}
          </div>
          {/* 화살표 네비게이션 (9개 이상일 때만 표시) */}
          {selectedDate && selectedDateBookmarks.length > 9 && (
            <>
              <button
                className="content-posters-nav content-posters-nav--prev"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                aria-label="이전 페이지"
              >
                <Icon icon="mdi:chevron-left" width="24" height="24" />
              </button>
              <button
                className="content-posters-nav content-posters-nav--next"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                aria-label="다음 페이지"
              >
                <Icon icon="mdi:chevron-right" width="24" height="24" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
