// 외부 라이브러리
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

// 내부 유틸/전역/서비스
import type { CommentItem } from "@/features/comments/commentSlice";
import { useContentDetail } from "@/hooks/useContentDetail";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { getCommentUsername } from "@/utils/contentUtils";
import { PATHS } from "@/routes/paths";
import { useDisclosure } from "@/hooks/useDisclosure";
import { formatDateDot } from "@/utils/format";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createCommentThunk, updateCommentThunk, deleteCommentThunk, getCommentsByTopic } from "@/features/comments/commentSlice";

// 컴포넌트
import { ImageCommentCard } from "@/components/Home/ImageCommentCard/ImageCommentCard";
import Spinner from "@/components/common/Spinner";
import { CommentDetailModal } from "@/components/modals/CommentDetailModal/CommentDetailModal";
import CommentEditModal from "@/components/modals/CommentEditModal/CommentEditModal";

// 스타일
import "./ContentDetailPage.scss";

const ContentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const topicId = id ? parseInt(id, 10) : 0;
  const { user } = useAppSelector((state) => state.auth);

  // 콘텐츠 상세 데이터 훅
  const { topic, commentsState, contentsLoading } = useContentDetail({ topicId });

  // 페이지 진입 시 스크롤 맨 위로 (뒤로가기 시에도 적용)
  useScrollToTop([topicId]);

  // 무한 스크롤 훅
  const {
    displayedItems: displayedComments,
    observerRef,
    hasMore,
  } = useInfiniteScroll<CommentItem>({
    items: commentsState.items,
    initialCount: 8,
    incrementCount: 8,
  });

  // 코멘트 상세 모달
  const { isOpen: showCommentDetail, open: openCommentDetail, close: closeCommentDetail } = useDisclosure(false);
  const [commentDetailData, setCommentDetailData] = useState<{ id?: number; username: string; date: string; content: string; likes: number; replies: number } | null>(null);

  // 나의 별점 상태
  const [myRating, setMyRating] = useState<number | undefined>(undefined);
  const [ratingPickerOpen, setRatingPickerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ratingContainerRef = useRef<HTMLDivElement>(null);

  // 코멘트 작성 모달
  const { isOpen: showCommentEdit, open: openCommentEdit, close: closeCommentEdit } = useDisclosure(false);

  // 현재 사용자의 코멘트 찾기
  const myCommentItem = useMemo(() => {
    if (!user?.id) return null;
    // commentsState.items에서 사용자 ID로 찾기
    const found = commentsState.items.find(
      (comment) => 
        comment.user_id === user.id || 
        comment.User?.user_id === user.id
    );
    return found || null;
  }, [commentsState.items, user?.id]);

  // 별점 계산 함수
  const calculateRating = useMemo(() => {
    return (clientX: number) => {
      if (!ratingContainerRef.current) return 0;
      const container = ratingContainerRef.current;
      const rect = container.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const containerWidth = rect.width;
      
      // 전체 컨테이너를 기준으로 0.5점 단위로 계산
      const percentage = Math.max(0, Math.min(1, clickX / containerWidth));
      const rating = percentage * 5; // 0 ~ 5
      
      // 0.5점 단위로 반올림
      return Math.round(rating * 2) / 2;
    };
  }, []);

  // 별점 아이콘 클릭 핸들러 (0.5점 단위)
  const handleStarClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const starElement = event.currentTarget;
    const rect = starElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    
    // 별의 왼쪽 절반을 클릭하면 0.5점, 오른쪽 절반을 클릭하면 1점
    // 클릭한 별의 인덱스를 기준으로 점수 계산 (0부터 시작)
    const isHalf = clickX < starWidth / 2;
    const rating = index + (isHalf ? 0.5 : 1); // 0.5, 1.0, 1.5, 2.0, ..., 5.0
    setMyRating(Math.min(rating, 5)); // 최대 5점
  };

  // 드래그 시작
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rating = calculateRating(event.clientX);
    setMyRating(Math.min(Math.max(0.5, rating), 5));
  };

  // 드래그 중 (전역 마우스 이벤트) - requestAnimationFrame으로 부드럽게
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!isDragging || !ratingContainerRef.current) return;
      
      // requestAnimationFrame으로 부드러운 업데이트
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const rating = calculateRating(event.clientX);
        setMyRating(Math.min(Math.max(0.5, rating), 5));
      });
    };

    const handleGlobalMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, calculateRating]);

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };


  // 별점에 따른 텍스트 메시지
  const getRatingText = (rating: number | undefined): string => {
    if (rating === undefined || rating === 0) return '별점을 선택해주세요';
    if (rating >= 4.5) return '최고예요!';
    if (rating >= 4.0) return '정말 좋아요!';
    if (rating >= 3.5) return '좋아요!';
    if (rating >= 3.0) return '괜찮아요!';
    if (rating >= 2.5) return '그냥 그래요!';
    if (rating >= 2.0) return '별로예요!';
    if (rating >= 1.5) return '안 좋아요!';
    return '최악이에요!';
  };

  // 별점 표시용 (0.5점 단위로 별 채우기)
  const renderStarRating = () => {
    const rating = myRating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div 
        ref={ratingContainerRef}
        className="rating--icon" 
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {[...Array(5)].map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;
          const isEmpty = i > fullStars || (i === fullStars && !hasHalfStar);
          
          return (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleStarClick(i, e);
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  e.stopPropagation();
                }
              }}
              style={{ 
                position: 'relative', 
                display: 'inline-block',
                cursor: isDragging ? 'grabbing' : 'pointer',
                width: '40px',
                height: '40px',
                userSelect: 'none'
              }}
            >
              {isFull ? (
                <Icon icon="mdi:star" style={{ color: '#FFD60A', width: '40px', height: '40px' }} />
              ) : isHalf ? (
                <Icon icon="mdi:star-half-full" style={{ color: '#FFD60A', width: '40px', height: '40px' }} />
              ) : (
                <Icon icon="mdi:star-outline" style={{ color: '#666', width: '40px', height: '40px' }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 코멘트 삭제 핸들러
  const handleCommentDelete = async () => {
    if (!myCommentItem) return;
    
    try {
      await dispatch(deleteCommentThunk({ comment_id: myCommentItem.comment_id })).unwrap();
      // 코멘트 목록 새로고침
      dispatch(getCommentsByTopic({ topicId }));
    } catch (error) {
      console.error('코멘트 삭제 실패:', error);
    }
  };

  // 코멘트 작성 핸들러
  const handleCommentSubmit = async (data: { content: string; isSpoiler: boolean }) => {
    try {
      if (myCommentItem) {
        // 수정
        await dispatch(
          updateCommentThunk({ comment_id: myCommentItem.comment_id, content: data.content })
        ).unwrap();
      } else {
        // 생성
        await dispatch(
          createCommentThunk({ topic_id: topicId, content: data.content })
        ).unwrap();
      }
      closeCommentEdit();
      // 코멘트 목록 새로고침으로 상태 동기화
      await dispatch(getCommentsByTopic({ topicId })).unwrap();
    } catch (error) {
      console.error('코멘트 저장 실패:', error);
    }
  };

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

  // 로딩 중이거나 데이터가 없을 때만 스피너 표시
  if (contentsLoading) {
    return (
      <div className="container text-center py-5 h-100">
        <Spinner />
      </div>
    );
  }

  // 로딩이 완료되었는데 topic이 없으면 에러 메시지
  if (!topic) {
    return (
      <div className="container text-center py-5 h-100">
        <p>콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="movie-top"
        style={{
          backgroundImage: `url(${topic.imageUrl || "https://picsum.photos/1200/400?random=1"})`
        }}
      >
        <div className="container">
          <div className="row">
            <div className="info m-3">
              <h2>{topic.title}</h2>
              <div className="info--subtext">
                <h6>{topic.englishTitle || topic.title}</h6>
                <h6>
                  {topic.year} · {topic.genre} · {topic.country || '미국'}
                </h6>
                <h6>
                  {topic.runtime} · {topic.ageRating}세
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="container">
      <div className="row movie-detail mt-6">
        <div className="col-12 col-md-5 col-lg-4">
          <img src={topic.imageUrl || "https://picsum.photos/300/400?random=1"} alt={topic.title} />
        </div>

        <div className="col-12 col-md-7 col-lg-8 mt-5">
          <div className="detail--data">
            <div className="ratescore">
              <div className="rating">
                {renderStarRating()}
                <div className="rating--text">{getRatingText(myRating)}</div>
              </div>

              <div className="score">
                <div className="score--user">
                  <h4>{myRating !== undefined ? myRating.toFixed(1) : '0.0'}</h4>
                  <p>나의 별점</p>
                </div>
                <div className="score--avg">
                  <h4>{topic.overallRating?.toFixed(1) || '0.0'}</h4>
                  <p>평균 별점</p>
                </div>
              </div>
            </div>

            <div className="action">
              <div className="action--box">
                <Icon icon="mdi:plus" />
                <p>보관함</p>
              </div>
              <div className="action--comment" onClick={openCommentEdit}>
                <Icon icon="mdi:edit" />
                <p>코멘트</p>
              </div>
              <div className="action--watching">
                <Icon icon="mdi:play" />
                <p>보는중</p>
              </div>
              <div className="action--more">
                <Icon icon="mdi:dots-horizontal" />
                <p>더보기</p>
              </div>
            </div>
          </div>

          {myCommentItem && (
            <div className="detail--mycomment-desk mt-5">
              <div>
                <p>나의 코멘트</p>
                {myCommentItem.created_at && (
                  <span>{formatDateDot(new Date(myCommentItem.created_at))}</span>
                )}
              </div>
              <div className="comment">
                <p>{myCommentItem.content}</p>
                <div className="comment--button">
                  <p onClick={handleCommentDelete}>삭제</p>
                  <p onClick={openCommentEdit}>수정</p>
                </div>
              </div>
            </div>
          )}

          <div className="detail--synopsis mt-5">
            <p>{topic.synopsis}</p>
          </div>
        </div>

        {myCommentItem && (
          <div className="col-12 mt-5 detail--mycomment">
            <div>
              <p>나의 코멘트</p>
              {myCommentItem.created_at && (
                <span>{formatDateDot(new Date(myCommentItem.created_at))}</span>
              )}
            </div>
            <div className="comment">
              <p>{myCommentItem.content}</p>
              <div className="comment--button">
                <p onClick={handleCommentDelete}>삭제</p>
                <p onClick={openCommentEdit}>수정</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row movie-comment mt-6">
        <div className="col-12">
          <div className="row movie-comment__header">
            <h6>코멘트 ({commentsState.items.length})</h6>
            <Icon 
              icon="mdi:chevron-right" 
              style={{ fontSize: 'icon-md', cursor: 'pointer' }}
              onClick={() => navigate(`${PATHS.comments}?contentId=${id}`)}
            />
          </div>
          <div className="row comment--card mt-4">
            {commentsState.loading ? (
              <div className="col-12 text-center py-4">
                <Spinner />
              </div>
            ) : displayedComments.length > 0 ? (
              <>
                {displayedComments.map((c) => (
                  <div
                    key={c.comment_id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <ImageCommentCard
                      username={getCommentUsername(c)}
                      comment={c.content}
                      rating={5}
                      likes={c.likes ?? 0}
                      replies={c.replies ?? 0}
                      onClick={() => handleCommentCardClick(c)}
                      // 이미지가 없으면 텍스트만 표시 (movieImageUrl이 없으므로)
                    />
                  </div>
                ))}
                {/* 무한 스크롤 트리거 요소 */}
                {hasMore && (
                  <div ref={observerRef} className="col-12 text-center py-4">
                    <Spinner />
                  </div>
                )}
              </>
            ) : (
              <div className="col-12 text-center py-4">
                <p>아직 작성된 코멘트가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* 코멘트 상세 모달 */}
    {commentDetailData && (
      <CommentDetailModal
        isOpen={showCommentDetail}
        onClose={closeCommentDetail}
        commentData={commentDetailData}
      />
    )}

    {/* 코멘트 작성/수정 모달 */}
    <CommentEditModal
      isOpen={showCommentEdit}
      onClose={closeCommentEdit}
      onSubmit={handleCommentSubmit}
      initialContent={myCommentItem?.content}
      mode={myCommentItem ? 'edit' : 'create'}
    />
    </>
  );
};

export default ContentDetailPage;
