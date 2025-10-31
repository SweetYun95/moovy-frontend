// src/pages/Home/UserMainPage.tsx

import React from "react";
import MovieCard from "@/components/Home/MovieCard/MovieCard";
import QuickMenu from "@/components/Home/QuickMenu/QuickMenu";
import ImageCommentCard from "@/components/Home/ImageCommentCard/ImageCommentCard";
import MovieCardSlider from "@/components/Home/MovieCard/MovieCardSlider";

import "./UserMainPage.scss";

interface Movie {
  title: string;
  synopsis: string;
  className: string;
  rating: number;
}

interface Comment {
  id: number;
  username: string;
  movieTitle: string;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
}

const UserMainPage: React.FC = () => {
  const movies: Movie[] = [
    {
      title: "다 이루어질 지니",
      synopsis:
        "천여 년 만에 깨어난 경력 단절 램프의 정령 지니(김우빈 분)가 감정 결여 인간 가영(수지 분)을 만나 세 가지 소원을 두고 벌이는 스트레스 제로, 판타지 로맨틱 코미디",
      className: "1",
      rating: 5.0,
    },
    {
      title: "사마귀",
      synopsis:
        "모든 룰이 무너진 살인청부업계에 긴 휴가 후 컴백한 A급 킬러 '사마귀'와 그의 훈련생 동기이자 라이벌 '재이' 그리고 은퇴한 레전드 킬러 '독고'가 1인자 자리를 놓고 벌이는 ...",
      className: "1",
      rating: 5.0,
    },
    {
      title: "야당",
      synopsis:
        "“대한민국 검사는 대통령을 만들 수도 있고 죽일 수도 있어” 10년 차 평검사 구관희(유해진)는 마약 사범을 조사하던 중 관할 구치소에 수감된 이강수(강하늘)를 만나게 된다. ...",
      className: "1",
      rating: 5.0,
    },
  ];

  const comments: Comment[] = [
    {
      id: 1,
      username: "유저닉네임1",
      movieTitle: "다 이루어질 지니",
      comment:
        "정말 재미있는 영화였어요! 케이팝 아이돌들이 액션 히어로로 나오는 설정이 신선하고, 스토리도 탄탄해서 끝까지 몰입해서 봤습니다. 특히 액션 씬들이 정말 잘 만들어진 것 같아요.",
      rating: 4.5,
      likes: 102,
      replies: 2,
    },
    {
      id: 2,
      username: "영화매니아",
      movieTitle: "사마귀",
      comment:
        "예상보다 훨씬 재미있었습니다! 스토리 전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었어요. 액션 시퀀스도 정말 잘 만들어진 것 같습니다.",
      rating: 4.0,
      likes: 89,
      replies: 5,
    },
    {
      id: 3,
      username: "드라마러버",
      movieTitle: "야당",
      comment:
        "정치 드라마치고는 정말 현실적이고 몰입도가 높았습니다. 배우들의 연기도 훌륭하고, 스토리도 정치적 상황을 잘 반영한 것 같아요. 추천합니다!",
      rating: 4.8,
      likes: 156,
      replies: 8,
    },
  ];

  return (
    <div className="container">
      <MovieCardSlider
        sections={[{ title: "요즘뜨는 신작 TOP : 토론 ON", movies }]}
      />

      <div className="mt-3">
        <QuickMenu />
      </div>

      <div className="mt-7">
        <h4>토론예정작 둘러보기 D-3</h4>
        <div className="row topic-ongoing mt-4">
          {movies.map((movie, index) => (
            <div className="col-md-4" key={index}>
              <MovieCard
                title={movie.title}
                synopsis={movie.synopsis}
                imageUrl="none"
                imageAlt="image"
                className={movie.className}
                rating={movie.rating}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h4>지금 뜨는 코멘트</h4>
        <div className="row top-comment mt-4">
          {comments.map((comment) => (
            <div className="col-md-4" key={comment.id}>
              <ImageCommentCard
                username={comment.username}
                movieTitle={comment.movieTitle}
                comment={comment.comment}
                rating={comment.rating}
                likes={comment.likes}
                replies={comment.replies}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMainPage;
