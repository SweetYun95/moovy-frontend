// 외부 라이브러리
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

// 내부 유틸/전역/서비스
import type { CommentItem } from "@/features/comments/commentSlice";
import { useContentDetail } from "@/hooks/useContentDetail";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getCommentUsername } from "@/utils/contentUtils";
import { PATHS } from "@/routes/paths";

// 컴포넌트
import CommentCard from "@/components/movies/CommentCard/CommentCard";
import Header from "@/components/layout/Header/Header";
import Spinner from "@/components/common/Spinner";
import Footer from "@/components/layout/Footer/Footer";

// 스타일
import "./ContentDetailPage.scss";

const ContentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const topicId = id ? parseInt(id, 10) : 0;

  // 콘텐츠 상세 데이터 훅
  const { topic, commentsState, contentsLoading } = useContentDetail({ topicId });

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

  if (contentsLoading || !topic) {
    return (
      <>
        <Header 
          onSearchChange={(value) => console.log('검색:', value)}
          onSearch={(value) => console.log('검색 실행:', value)}
          onLoginClick={() => console.log('로그인 클릭')}
          onSignupClick={() => console.log('회원가입 클릭')}
        />
        <div className="container text-center py-5 h-100">
          <Spinner />
        </div>
        <Footer />
      </>
    );
    
  }

  return (
    <>
      <Header 
        onSearchChange={(value) => console.log('검색:', value)}
        onSearch={(value) => console.log('검색 실행:', value)}
        onLoginClick={() => console.log('로그인 클릭')}
        onSignupClick={() => console.log('회원가입 클릭')}
      />
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
                <h6>{topic.title}</h6>
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
                <div className="rating--icon">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="mdi:star"
                    />
                  ))}
                </div>
                <div className="rating--text">최고예요!</div>
              </div>

              <div className="score">
                <div className="score--user">
                  <h4>5.0</h4>
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
              <div className="action--comment">
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

          <div className="detail--mycomment-desk mt-5">
            <div>
              <p>나의 코멘트</p>
              <span>2025.01.01</span>
            </div>
            <div className="comment">
              <p>코멘트를 작성했습니다~</p>
              <div className="comment--button">
                <p>삭제</p>
                <p>수정</p>
              </div>
            </div>
          </div>

          <div className="detail--synopsis mt-5">
            <p>{topic.synopsis}</p>
          </div>
        </div>

        <div className="col-12 mt-5 detail--mycomment">
          <div>
            <p>나의 코멘트</p>
            <span>2025.01.01</span>
          </div>
          <div className="comment">
            <p>코멘트를 작성했습니다~</p>
            <div className="comment--button">
              <p>삭제</p>
              <p>수정</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row movie-comment mt-6">
        <div className="col-12">
          <div className="row movie-comment__header">
            <h6>코멘트 ({commentsState.items.length})</h6>
            <Icon 
              icon="mdi:chevron-right" 
              style={{ fontSize: 'icon-md', cursor: 'pointer' }}
              onClick={() => navigate(PATHS.comments)}
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
                    <CommentCard
                      username={getCommentUsername(c)}
                      comment={c.content}
                      rating={5}
                      likes={0}
                      replies={0}
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
    <Footer />
    </>
  );
};

export default ContentDetailPage;
