// 외부 라이브러리
import { useEffect, useMemo } from 'react';

// 내부 유틸/전역/서비스
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getCommentsByTopic, selectCommentsBucketByTopic } from '@/features/comments/commentSlice';
import { fetchContentsThunk } from '@/features/content/contentSlice';
import type { Topic as ContentCardType } from '@/services/api/topicApi';

interface Topic {
  id: number;
  title: string;
  year: string;
  genre: string;
  runtime: string;
  ageRating: string;
  synopsis: string;
  country?: string;
  category?: string;
  imageUrl?: string;
  overallRating?: number;
}

interface UseContentDetailOptions {
  topicId: number;
}

interface UseContentDetailReturn {
  topic: Topic | null;
  commentsState: ReturnType<typeof selectCommentsBucketByTopic>;
  contentsLoading: boolean;
}

/**
 * 콘텐츠 상세 페이지 데이터를 관리하는 커스텀 훅
 * @param topicId - 콘텐츠 ID
 * @returns { topic, commentsState, contentsLoading }
 */
export function useContentDetail({
  topicId,
}: UseContentDetailOptions): UseContentDetailReturn {
  const dispatch = useAppDispatch();

  // Redux에서 콘텐츠 목록과 로딩 상태 가져오기
  const { contents, loading: contentsLoading } = useAppSelector(
    (state) => state.content
  );

  // Redux에서 토픽별 코멘트 가져오기
  const commentsState = useAppSelector((state) =>
    selectCommentsBucketByTopic(state, topicId)
  );

  // URL ID로 해당 콘텐츠 찾기 및 변환
  const topic = useMemo(() => {
    if (!topicId || contents.length === 0) return null;
    const found = contents.find((c) => c.id === topicId);
    if (!found) return null;

    return {
      id: found.id,
      title: found.title,
      year: found.year || '',
      genre: found.genre,
      runtime: found.runtime,
      ageRating: found.ageRating,
      synopsis: found.synopsis,
      country: found.country,
      category: found.category,
      imageUrl: found.imageUrl,
      overallRating: found.overallRating,
    };
  }, [contents, topicId]);

  // Fetch contents and comments
  useEffect(() => {
    // 콘텐츠 목록이 없으면 가져오기
    if (contents.length === 0 && !contentsLoading) {
      dispatch(fetchContentsThunk());
    }

    // 코멘트 가져오기
    if (topicId) {
      dispatch(getCommentsByTopic({ topicId }));
    }
  }, [dispatch, contents.length, contentsLoading, topicId]);

  return {
    topic,
    commentsState,
    contentsLoading,
  };
}

