// 날짜/문자열 포맷 유틸 모음
// - 화면 공통에서 재사용되는 간단한 포맷터를 관리합니다.
export function formatDateDot(date: Date | string = new Date()): string {
  // Date 객체 또는 ISO 문자열을 'YYYY.MM.DD' 형태로 변환
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  return dateObj.toISOString().split('T')[0].replace(/-/g, '.');
}


