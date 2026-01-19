import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.scss'

export interface ModalProps {
   isOpen: boolean
   onClose: () => void
   children: React.ReactNode
   title?: React.ReactNode
   titleAlign?: 'left' | 'center'
   showCloseButton?: boolean
   size?: '360px' | '480px' | '870px' | '994px'
   noResponsive?: boolean
   className?: string
   zIndex?: number
   mode?: 'light' | 'dark'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, titleAlign = 'left', showCloseButton = true, size = '480px', noResponsive = false, className = '', zIndex, mode = 'dark' }) => {
   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = 'hidden'
      } else {
         document.body.style.overflow = 'unset'
      }

      return () => {
         document.body.style.overflow = 'unset'
      }
   }, [isOpen])

   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isOpen) {
            onClose()
         }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
   }, [isOpen, onClose])

   if (!isOpen) return null

   // In non-browser environments, don't attempt to render a modal.
   if (typeof document === 'undefined') return null

   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         onClose()
      }
   }

   return createPortal(
      <div className="modal-overlay" onClick={handleBackdropClick} style={zIndex ? { zIndex } : undefined}>
         <div className={`modal-container modal-${size} modal--${mode} ${noResponsive ? 'modal-no-responsive' : ''} ${className}`}>
            {(title || showCloseButton) && (
               <div className="modal-header">
                  {title && <h2 className={`modal-title modal-title--${titleAlign}`}>{title}</h2>}
                  {showCloseButton && (
                     <button className="modal-close" onClick={onClose}>
                        X
                     </button>
                  )}
               </div>
            )}
            <div className="modal-content">{children}</div>
         </div>
      </div>,
      document.body,
   )
}

export default Modal
