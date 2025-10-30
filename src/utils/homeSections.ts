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
    { title: '토론예정작 둘러보기 D-3', movies: parts[1] || [] },
  ];
}

export function buildCommentSections<T>(comments: T[]) {
  // 코멘트 리스트를 4개 단위 그룹으로 나누고 타이틀 부여
  const parts = chunkArray(comments, 4);
  return [
    { title: '핫 토크 리뷰', comments: parts[0] || [] },
    { title: '베스트 리뷰', comments: parts[1] || [] },
    { title: '실시간 리뷰', comments: parts[2] || [] },
  ];
}

export function buildHeroSlides<T extends { images?: string[]; imageUrl?: string; title: string; synopsis?: string }>(contents: T[]) {
  // 컨텐츠에서 3개 랜덤 슬라이드를 생성
  const shuffled = [...contents].sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffled.map((c) => ({
    imageUrl: c.images?.[0] || c.imageUrl || 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop',
    title: c.title,
    synopsis: c.synopsis,
    ctaText: '코멘트 작성하러 가기',
    onCtaClick: () => {},
  }));
}


