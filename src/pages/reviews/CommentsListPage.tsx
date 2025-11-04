// 외부 라이브러리
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useContentDetail } from '@/hooks/useContentDetail';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { fetchCommentsThunk, getCommentsByTopic, type CommentCard as CommentCardType, type CommentItem } from '@/features/comments/commentSlice';
import { fetchContentsThunk } from '@/features/content/contentSlice';
import { convertCommentItemToCard, getCommentUsername } from '@/utils/contentUtils';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatDateDot } from '@/utils/format';
import { sortCommentsBy, getCommentListTitle, type CommentSortType } from '@/utils/homeSections';

// 컴포넌트
import { ImageCommentCard } from '@/components/Home/ImageCommentCard/ImageCommentCard';
import Spinner from '@/components/common/Spinner';
import { CommentDetailModal } from '@/components/modals/CommentDetailModal/CommentDetailModal';
import { Pagination } from '@/components/common/Pagination';

// 스타일
import './CommentsListPage.scss';

export default function CommentsListPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('contentId');
  const sortBy = searchParams.get('sortBy') as CommentSortType | null;
  const topicId = contentId ? parseInt(contentId, 10) : 0;

  // 콘텐츠 상세 데이터 훅 (contentId가 있을 때만)
  const contentDetailResult = useContentDetail({ topicId });
  const { topic, commentsState: contentCommentsState, contentsLoading } = contentId ? contentDetailResult : { topic: null, commentsState: { items: [], loading: false }, contentsLoading: false };

  // 전체 코멘트 데이터 (sortBy가 있을 때 - 모든 토픽의 코멘트를 합쳐서 사용)
  const homeComments = useAppSelector((s) => {
    const allComments: any[] = [];
    Object.values(s.comments.byTopicId).forEach((bucket) => {
      allComments.push(...bucket.items);
    });
    return allComments;
  });
  const homeLoading = useAppSelector((s) => {
    return Object.values(s.comments.byTopicId).some((bucket) => bucket.loading);
  });
  
  // 영화 목록 데이터 (ImageCommentCard에서 영화 이미지와 제목을 가져오기 위함)
  const { contents } = useAppSelector((s) => s.content);

  // 사용할 코멘트 데이터 결정 및 CommentCard 형식으로 통일
  const commentsState = useMemo(() => {
    if (contentId) {
      // CommentItem을 CommentCard로 변환
      const convertedItems: CommentCardType[] = contentCommentsState.items.map(convertCommentItemToCard);
      return { items: convertedItems, loading: contentCommentsState.loading };
    } else {
      // homeComments도 CommentItem[]이므로 CommentCard로 변환
      const convertedItems: CommentCardType[] = homeComments.map(convertCommentItemToCard);
      return { items: convertedItems, loading: homeLoading };
    }
  }, [contentId, contentCommentsState, homeComments, homeLoading]);

  // 정렬된 코멘트 리스트 (모두 CommentCard 형식)
  const sortedComments = useMemo(() => {
    return sortCommentsBy(commentsState.items, sortBy || undefined);
  }, [commentsState.items, sortBy]);

  // 초기 데이터 로드 (sortBy가 있고 contentId가 없을 때)
  useEffect(() => {
    if (sortBy && !contentId && homeComments.length === 0 && !homeLoading) {
      dispatch(fetchCommentsThunk());
    }
    // 영화 목록이 없으면 가져오기 (ImageCommentCard에서 영화 이미지 표시를 위해)
    if (contents.length === 0) {
      dispatch(fetchContentsThunk());
    }
  }, [dispatch, sortBy, contentId, homeComments.length, homeLoading, contents.length]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedComments.length / itemsPerPage);
  const paginatedComments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedComments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedComments, currentPage]);

  // sortBy 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // 페이지 진입 시 스크롤 맨 위로 (뒤로가기 시에도 적용)
  useScrollToTop([contentId, sortBy]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 코멘트 상세 모달
  const { isOpen: showCommentDetail, open: openCommentDetail, close: closeCommentDetail } = useDisclosure(false);
  const [commentDetailData, setCommentDetailData] = useState<{ id?: number; username: string; date: string; content: string; likes: number; replies: number } | null>(null);

  // 코멘트 카드 클릭 핸들러
  const handleCommentCardClick = (comment: CommentItem) => {
    const createdDate = comment.created_at ? new Date(comment.created_at) : new Date();
    const commentData = {
      id: comment.comment_id,
      username: getCommentUsername(comment),
      date: formatDateDot(createdDate),
      content: comment.content,
      likes: comment.likes ?? 0,
      replies: comment.replies ?? 0,
    };
    setCommentDetailData(commentData);
    openCommentDetail();
  };

  return (
    <div className="container py-4">
      <div className="comments-list-page">
      <div className="comments-list-page__header mb-4">
        <h2 className="comments-list-page__title">
          {getCommentListTitle(topic?.title, sortBy, sortedComments.length)}
        </h2>
        </div>

        {(contentsLoading || commentsState.loading) && sortedComments.length === 0 ? (
          <div className="text-center py-5">
            <Spinner />
          </div>
        ) : paginatedComments.length > 0 ? (
          <>
            <div className={`row ${contentId ? 'comments-list-page__list-layout' : 'comments-list-page__grid-layout'}`}>
              {paginatedComments.map((c: CommentCardType) => {
                // contentId가 있을 때는 같은 콘텐츠이므로 이미지 표시하지 않음
                // contentId가 없을 때만 (sortBy로 들어온 경우) 영화 이미지 표시
                const movieContent = !contentId && c.contentId ? contents.find((content) => content.id === c.contentId) : null;
                
                return (
                  <div
                    key={c.id}
                    className={contentId 
                      ? 'col-12 col-sm-6 col-lg-4 col-xl-3 mb-4' 
                      : 'col-12 col-sm-6 col-lg-4 mb-4'
                    }
                  >
                    <ImageCommentCard
                      username={c.username}
                      movieTitle={!contentId ? (movieContent?.title || '') : undefined}
                      comment={c.comment}
                      rating={c.rating ?? 0}
                      likes={c.likes ?? 0}
                      replies={c.replies ?? 0}
                      movieImageUrl={!contentId ? movieContent?.imageUrl : undefined}
                      onClick={() => {
                        // ImageCommentCard에서 CommentItem으로 변환하여 모달에 전달
                        // contentId가 있을 때만 모달이 작동하도록
                        if (contentId) {
                          // 원본 CommentItem을 찾아서 전달
                          const originalItem = contentCommentsState.items.find(item => item.comment_id === c.id);
                          if (originalItem) {
                            handleCommentCardClick(originalItem);
                          }
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
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
            <p>아직 작성된 코멘트가 없습니다.</p>
          </div>
        )}

        {/* 코멘트 상세 모달 */}
        {commentDetailData && (
          <CommentDetailModal
            isOpen={showCommentDetail}
            onClose={closeCommentDetail}
            commentData={commentDetailData}
          />
        )}
      </div>
    </div>
  );
}
