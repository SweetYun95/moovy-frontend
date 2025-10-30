// moovy-frontend/src/pages/movies/MovieDetailPage.tsx

import React from "react";
import { Icon } from "@iconify/react";

import CommentCard from "@/components/movies/CommentCard/CommentCard";

import "./MovieDetailPage.scss";

interface Movie {
  content_id: number;
  title: string;
  release_date: number;
  genre: string;
  time: string;
  age_limit: string;
  plot: string;
}

interface Comment {
  comment_id: number;
  topic_id: number;
  user_id: number;
  content: string;
}

const MovieDetailPage: React.FC = () => {
  // 확인용 하드코딩 데이터
  const movie: Movie = {
    content_id: 1,
    title: "토르: 천둥의 신",
    release_date: 2011,
    genre: "액션/모험/판타지/SF",
    time: "1시간 52분",
    age_limit: "12",
    plot: "신의 세계 ‘아스가르드’의 후계자로 강력한 파워를 지닌 천둥의 신 ‘토르’. 평소 거침없는 성격의 소유자인 토르는 신들간의 전쟁을 일으킨 죄로 신의 자격을 박탈당한 채 지구로 추방당한다. 힘의 원천인 해머 ‘묠니르’도 잃어버린 채 하루 아침에 평범한 인간이 되어버린 토르는 혼란스러움을 뒤로 한 채 지구에서 처음 마주친 과학자 ‘제인’ 일행과 함께 하며 인간 세계에 적응해 나가기 시작한다. 하지만 그 사이 아스가르드는 후계자 자리를 노리는 ‘로키’의 야욕으로 인해 혼란에 빠진다. 후계자로 지목된 자신의 형 토르를 제거하려는 로키는 마침내 지구에까지 무차별적인 공격을 시작한다. 자신의 존재 때문에 지구에 거대한 위험이 닥치고 있음을 알게 된 토르. 그런 그의 앞에 보다 강력한 파괴력의 상대가 등장하는데… 두 개의 세계, 한 명의 영웅 모두의 운명을 건 최후의 격돌이 시작된다!",
  };

  const comments: Comment[] = [
    { comment_id: 1, topic_id: 1, user_id: 1, content: "재미있어요!" },
    { comment_id: 2, topic_id: 1, user_id: 2, content: "재미없어요!" },
    { comment_id: 3, topic_id: 1, user_id: 3, content: "볼만해요" },
    { comment_id: 4, topic_id: 1, user_id: 4, content: "그럭저럭" },
  ];

  return (
    <div className="container">
      <div className="row movie-top">
        <div className="info">
          <h2>{movie.title}</h2>
          <div className="info--subtext mt-2">
            <h6>{movie.title}</h6>
            <h6>
              {movie.release_date} · {movie.genre} · 미국
            </h6>
            <h6>
              {movie.time} · {movie.age_limit}세
            </h6>
          </div>
        </div>
      </div>

      <div className="row movie-detail mt-6">
        <div className="col-md-4">
          <img src="https://picsum.photos/300/400?random=1" alt={movie.title} />
        </div>

        <div className="col-md-8">
          <div className="row detail--data">
            <div className="ratescore">
              <div className="rating">
                <div className="rating--icon">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="mdi:star"
                      className="content-card__star-icon"
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
                  <h4>4.9</h4>
                  <p>평균 별점</p>
                </div>
              </div>
            </div>

            <div className="action">
              <div className="action--box">
                <p>아이콘</p>
                <p>보관함</p>
              </div>
              <div className="action--comment">
                <p>아이콘</p>
                <p>코멘트</p>
              </div>
              <div className="action--watching">
                <p>아이콘</p>
                <p>보는중</p>
              </div>
              <div className="action--more">
                <p>아이콘</p>
                <p>더보기</p>
              </div>
            </div>
          </div>

          <div className="row detail--mycomment mt-7">
            <div className="row">
              <p>나의 코멘트</p>
              <span>2025.01.01</span>
            </div>
            <div className="row comment">
              <p>코멘트를 작성했습니다~</p>
              <div className="comment--button">
                <p>삭제</p>
                <p>수정</p>
              </div>
            </div>
          </div>

          <div className="row detail--synopsis mt-5">
            <p>{movie.plot}</p>
          </div>
        </div>
      </div>

      <div className="row movie-comment mt-6">
        <h6>코멘트 ({comments.length})</h6>
        <div className="comment--card mt-4">
          {comments.map((c) => (
            <div className="col-md-3" key={c.comment_id}>
              <CommentCard
                username={`User ${c.user_id}`}
                comment={c.content}
                rating={5}
                likes={99}
                replies={5}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
