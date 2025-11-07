// 홈 페이지 섹션/슬라이드 구성 유틸
// - 리스트를 일정 개수로 분할하고, 각 섹션 타이틀과 함께 반환합니다.
export function chunkArray<T>(array: T[], size: number): T[][] {
  // 배열을 size 단위로 잘라 2차원 배열로 반환
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function buildMovieSections<T extends { title?: string }>(contents: T[]) {
  // 영화 리스트를 3개 단위 그룹으로 나누고 타이틀 부여
  const parts = chunkArray(contents, 3);
  return [
    { title: '요즘뜨는 신작 TOP : 토론 ON', movies: parts[0] || [] },
    { title: '현재 상영작 TOP : 이야기하러 가볼까?', movies: parts[1] || [] },
    { title: 'MOOVY 추천작 TOP : 언제봐도 명작이다..!', movies: parts[2] || [] },
  ];
}

export type CommentSortType = 'replies' | 'likes' | 'recent';

/**
 * 코멘트를 정렬 기준에 따라 정렬
 * @param comments - 정렬할 코멘트 배열
 * @param sortBy - 정렬 기준 ('replies', 'likes', 'recent')
 * @returns 정렬된 코멘트 배열
 */
export function sortCommentsBy<T extends { replies?: number; likes?: number; created_at?: string }>(
  comments: T[],
  sortBy?: CommentSortType
): T[] {
  if (!sortBy) return comments;
  
  const sortedComments = [...comments];
  
  switch (sortBy) {
    case 'replies':
      return sortedComments.sort((a, b) => (b.replies ?? 0) - (a.replies ?? 0));
    case 'likes':
      return sortedComments.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    case 'recent':
      return sortedComments.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // 최신순
      });
    default:
      return sortedComments;
  }
}

/**
 * 코멘트 리스트 페이지 제목 생성
 * @param topicTitle - 토픽 제목 (있을 경우)
 * @param sortBy - 정렬 기준
 * @param count - 코멘트 개수
 * @returns 페이지 제목
 */
export function getCommentListTitle(
  topicTitle?: string | null,
  sortBy?: CommentSortType | null,
  count: number = 0
): string {
  if (topicTitle) {
    return `${topicTitle} - 코멘트 (${count})`;
  }
  
  switch (sortBy) {
    case 'replies':
      return `핫 토크 리뷰 (${count})`;
    case 'likes':
      return `베스트 리뷰 (${count})`;
    case 'recent':
      return `실시간 리뷰 (${count})`;
    default:
      return `코멘트 목록 (${count})`;
  }
}

export function buildCommentSections<T extends { replies?: number; likes?: number; created_at?: string }>(
  comments: T[],
  limitPerSection?: number
) {
  // 각 섹션별로 정렬된 코멘트 리스트 생성
  
  // 1. 핫 토크 리뷰: 댓글 수(replies) 많은 순서로 정렬
  const hotTalkComments = sortCommentsBy(comments, 'replies');
  
  // 2. 베스트 리뷰: 좋아요 수(likes) 많은 순서로 정렬
  const bestComments = sortCommentsBy(comments, 'likes');
  
  // 3. 실시간 리뷰: 가장 최근에 등록된 순서로 정렬
  const recentComments = sortCommentsBy(comments, 'recent');
  
  // limitPerSection이 있으면 각 섹션을 제한
  const limit = limitPerSection || Infinity;
  
  return [
    { 
      title: '핫 토크 리뷰', 
      comments: hotTalkComments.slice(0, limit), 
      sortType: 'replies' as CommentSortType 
    },
    { 
      title: '베스트 리뷰', 
      comments: bestComments.slice(0, limit), 
      sortType: 'likes' as CommentSortType 
    },
    { 
      title: '실시간 리뷰', 
      comments: recentComments.slice(0, limit), 
      sortType: 'recent' as CommentSortType 
    },
  ];
}

export interface SliderSection {
  title: string;
  movies: any[];
}

export function buildHeroSlides(sections: SliderSection[]) {
  // 각 섹션에서 랜덤으로 하나씩 선택하여 Hero 슬라이드 생성
  return sections
    .filter((section) => section.movies && section.movies.length > 0)
    .map((section) => {
      // 섹션 내에서 랜덤으로 하나 선택
      const randomIndex = Math.floor(Math.random() * section.movies.length);
      const movie = section.movies[randomIndex];
      
      return {
        id: movie.id,
        imageUrl: movie.images?.[0] || movie.imageUrl || 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop',
        title: movie.title,
        synopsis: movie.synopsis,
        ctaText: '코멘트 작성하러 가기',
      };
    });
}


