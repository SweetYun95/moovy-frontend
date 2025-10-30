// 날짜/문자열 포맷 유틸 모음
// - 화면 공통에서 재사용되는 간단한 포맷터를 관리합니다.
export function formatDateDot(date: Date = new Date()): string {
  // ISO 날짜를 'YYYY.MM.DD' 형태로 변환
  return date.toISOString().split('T')[0].replace(/-/g, '.');
}


