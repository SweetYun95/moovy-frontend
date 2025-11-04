// 외부 라이브러리
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchContentsThunk } from '@/features/content/contentSlice';
import { PATHS } from '@/routes/paths';

// 컴포넌트
import { ContentCard } from '@/components/movies/ContentCard/ContentCard';
import Spinner from '@/components/common/Spinner';
import { Pagination } from '@/components/common/Pagination';
import './ContentsListPage.scss';

export default function ContentsListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { contents, loading } = useAppSelector((state) => state.content);
  
  // 검색어 가져오기 (URL 쿼리 파라미터에서)
  const searchQuery = searchParams.get('q');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchContentsThunk());
  }, [dispatch]);

  // 검색어가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 필터링 및 페이지네이션
  const filteredContents = useMemo(() => {
    // 검색어가 있으면 필터링 (제목, 장르, 카테고리로 검색)
    if (searchQuery) {
      return contents.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // 검색어가 없으면 모든 컨텐츠 표시
    return contents;
  }, [contents, searchQuery]);

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContents, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (contentId: string | number) => {
    navigate(PATHS.contentDetail(contentId));
  };

  if (loading) {
    return (
      <div className="contents-list-page">
        <div className="container py-4">
          <div className="text-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contents-list-page">
      <div className="container py-4">
        {/* 검색 결과 제목 또는 전체 작품 보기 제목 */}
        {searchQuery ? (
          <div className="contents-list-page__header mb-4">
            <h2 className="contents-list-page__title">
              '{searchQuery}'와 관련된 검색결과입니다.
            </h2>
          </div>
        ) : (
          <div className="contents-list-page__header mb-4">
            <h2 className="contents-list-page__title">
              MOOVY의 전체 작품 보기
            </h2>
          </div>
        )}

        {/* 콘텐츠 그리드 */}
        {paginatedContents.length > 0 ? (
          <>
            <div className="row g-4 mb-5">
              {paginatedContents.map((content) => (
                <div
                  key={content.id}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                >
                  <ContentCard
                    title={content.title}
                    year={content.year || ''}
                    category={content.category}
                    country={content.country}
                    rating={content.overallRating || 0}
                    imageUrl={content.imageUrl || content.images?.[0]}
                    imageAlt={content.title}
                    onClick={() => handleCardClick(content.id)}
                  />
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
