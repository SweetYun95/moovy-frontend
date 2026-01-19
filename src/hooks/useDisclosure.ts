import { useCallback, useState } from 'react'

// 모달 open/close/toggle 공용 훅
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return { isOpen, open, close, toggle }
}


