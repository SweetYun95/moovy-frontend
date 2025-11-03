// 외부 라이브러리
import { useState, useEffect, useRef, useMemo } from 'react';

interface UseInfiniteScrollOptions {
  items: unknown[];
  initialCount?: number;
  incrementCount?: number;
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[];
  observerRef: React.RefObject<HTMLDivElement>;
  displayCount: number;
  hasMore: boolean;
}

/**
 * 무한 스크롤을 위한 커스텀 훅
 * @param items - 전체 아이템 배열
 * @param initialCount - 초기 표시 개수 (기본값: 8)
 * @param incrementCount - 스크롤 시 추가로 표시할 개수 (기본값: 8)
 * @param threshold - Intersection Observer threshold (기본값: 0.1)
 * @returns { displayedItems, observerRef, displayCount, hasMore }
 */
export function useInfiniteScroll<T>({
  items,
  initialCount = 8,
  incrementCount = 8,
  threshold = 0.1,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn<T> {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const observerRef = useRef<HTMLDivElement>(null);

  // 표시할 아이템 리스트
  const displayedItems = useMemo(() => {
    return items.slice(0, displayCount) as T[];
  }, [items, displayCount]);

  const hasMore = displayCount < items.length;

  // Intersection Observer로 하단 감지
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setDisplayCount((prev) => Math.min(prev + incrementCount, items.length));
        }
      },
      { threshold }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, items.length, incrementCount, threshold]);

  // items 변경 시 displayCount 리셋
  useEffect(() => {
    setDisplayCount(initialCount);
  }, [items, initialCount]);

  return {
    displayedItems,
    observerRef,
    displayCount,
    hasMore,
  };
}

