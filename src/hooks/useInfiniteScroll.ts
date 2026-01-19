// 외부 라이브러리
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

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
  const itemsLengthRef = useRef(items.length);
  const prevItemsLengthRef = useRef(items.length);

  // 표시할 아이템 리스트
  const displayedItems = useMemo(() => {
    return items.slice(0, displayCount) as T[];
  }, [items, displayCount]);

  const hasMore = displayCount < items.length;

  // items.length 변경 추적
  useEffect(() => {
    prevItemsLengthRef.current = itemsLengthRef.current;
    itemsLengthRef.current = items.length;
  }, [items.length]);

  // items가 완전히 새로 로드되었을 때만 displayCount 리셋 (length가 감소하거나 크게 증가한 경우)
  useEffect(() => {
    // items.length가 크게 감소했거나, 초기 로드인 경우 리셋
    if (items.length < prevItemsLengthRef.current || (items.length > 0 && displayCount > items.length)) {
      setDisplayCount(initialCount);
    }
  }, [items.length, initialCount, displayCount]);

  // Intersection Observer로 하단 감지
  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef) {
      return;
    }

    // hasMore가 false면 observer를 설정하지 않음
    if (!hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setDisplayCount((prev) => {
            // 현재 items.length를 직접 참조하여 최신 값 사용
            const currentItemsLength = items.length;
            const newCount = Math.min(prev + incrementCount, currentItemsLength);
            // 실제로 증가했을 때만 업데이트
            if (newCount > prev) {
              return newCount;
            }
            return prev;
          });
        }
      },
      { 
        threshold,
        rootMargin: '50px', // 미리 로드하기 위해 여유 공간 추가
      }
    );

    // 약간의 지연 후 observe (DOM이 완전히 렌더링된 후)
    const timeoutId = setTimeout(() => {
      if (currentRef && hasMore) {
        observer.observe(currentRef);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [hasMore, items.length, incrementCount, threshold]);

  return {
    displayedItems,
    observerRef,
    displayCount,
    hasMore,
  };
}

