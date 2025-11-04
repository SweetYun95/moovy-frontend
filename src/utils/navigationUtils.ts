// 내부 유틸/전역/서비스
import type { NavigateFunction } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

/**
 * 컨텐츠 디테일 페이지로 이동하는 핸들러 생성
 * @param navigate - react-router-dom의 navigate 함수
 * @param id - 컨텐츠 ID
 * @param customHandler - 커스텀 핸들러가 있으면 우선 실행
 * @returns 클릭 핸들러 함수
 */
export function createContentDetailHandler(
  navigate: NavigateFunction,
  id?: string | number,
  customHandler?: () => void
): () => void {
  return () => {
    if (customHandler) {
      customHandler();
    } else if (id) {
      navigate(PATHS.contentDetail(id));
    }
  };
}

