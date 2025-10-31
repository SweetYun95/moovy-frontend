// 토스트/알림 래퍼 유틸
// - 실제 라이브러리 연결 전까지 콘솔로 대체합니다.
type ToastFn = (message: string) => void

export const showSuccess: ToastFn = (message) => {
  // 실제 환경: toast.success(message)
  console.log('[SUCCESS]', message)
}

export const showError: ToastFn = (message) => {
  // 실제 환경: toast.error(message)
  console.error('[ERROR]', message)
}

export const showInfo: ToastFn = (message) => {
  // 실제 환경: toast.info(message)
  console.log('[INFO]', message)
}


