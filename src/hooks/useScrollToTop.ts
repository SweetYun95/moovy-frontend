// 외부 라이브러리
import { useEffect, useLayoutEffect } from 'react';

/**
 * 페이지 진입 시 스크롤을 맨 위로 이동시키는 커스텀 훅
 * 브라우저의 뒤로가기/앞으로가기 시에도 스크롤 위치 복원을 방지
 * 
 * @param dependencies - 스크롤을 맨 위로 이동시킬 트리거 값들 (예: contentId, sortBy 등)
 * 
 * @example
 * // 단일 값으로 트리거
 * useScrollToTop([contentId]);
 * 
 * // 여러 값으로 트리거
 * useScrollToTop([contentId, sortBy]);
 */
export function useScrollToTop(dependencies: React.DependencyList = []) {
  // 브라우저 스크롤 복원 비활성화 (뒤로가기 시 스크롤 위치 복원 방지)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 페이지 진입 시 스크롤 맨 위로 (useLayoutEffect로 브라우저 렌더링 전에 실행)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, dependencies);

  // 뒤로가기/앞으로가기 이벤트 감지
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
}

