// moovy-frontend/src/pages/admin/AdminPage.tsx
import React, { useState } from 'react'

import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import HistoryPanel from '../../components/admin/HistoryPanel'
import Table from '@/components/admin/Table'

import './AdminPage.scss'

interface AdminProps {
   content: 'dashboard' | 'user' | 'topic' | 'inquiry' | 'report'
}

const AdminPage: React.FC<AdminProps> = ({ content }) => {
   // ✅ content prop을 초기값으로 반영
   const [activeSideBar, setActiveSideBar] = useState<'dashboard' | 'user' | 'topic' | 'inquiry' | 'report'>(content)
   const [isSidebarVisible, setIsSidebarVisible] = useState(true)
   const [isHistoryVisible, setIsHistoryVisible] = useState(true)

   // ✅ 라우터에서 content가 바뀌면(예: /admin/users -> /admin/topics) activeSideBar도 동기화
   React.useEffect(() => {
      setActiveSideBar(content)
   }, [content])

   // 모바일에서는 기본적으로 사이드바 숨김, 히스토리 패널은 항상 숨김
   React.useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth <= 1024) {
            setIsSidebarVisible(false)
            setIsHistoryVisible(false)
         } else {
            setIsSidebarVisible(true)
            setIsHistoryVisible(true)
         }
      }

      handleResize() // 초기 실행
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   const changeActiveSideBar = (e: React.MouseEvent<HTMLLIElement>) => {
      const value = e.currentTarget.getAttribute('value')
      if (value && (value === 'dashboard' || value === 'user' || value === 'topic' || value === 'inquiry' || value === 'report')) {
         setActiveSideBar(value)
         // 반응형(1024px 이하)에서는 메뉴 클릭 시 사이드바 자동으로 닫기
         if (window.innerWidth <= 1024) {
            setIsSidebarVisible(false)
         }
      }
   }

   const toggleSidebar = () => {
      setIsSidebarVisible((prev) => !prev)
   }

   const toggleHistory = () => {
      // 모바일에서는 히스토리 패널 사용 안 함
      if (window.innerWidth > 1024) {
         setIsHistoryVisible((prev) => !prev)
      }
   }

   const handleOverlayClick = () => {
      setIsSidebarVisible(false)
   }

   const handleSidebarClose = () => {
      setIsSidebarVisible(false)
   }

   return (
      <div className={`layout ${isSidebarVisible ? 'sidebar-open' : ''} ${isHistoryVisible ? 'history-open' : ''}`}>
         {isSidebarVisible && <div className="layout-overlay" onClick={handleOverlayClick} aria-hidden="true" />}
         <Sidebar content={activeSideBar} changeActiveSideBar={changeActiveSideBar} className={isSidebarVisible ? 'visible' : ''} onClose={handleSidebarClose} />
         <div className="main">
            <Header content={activeSideBar} onToggleSidebar={toggleSidebar} onToggleHistory={toggleHistory} />
            <Table content={activeSideBar} />
         </div>
         <HistoryPanel className={isHistoryVisible ? 'visible' : ''} />
         {/* 아래로 토픽 관리 탭 넣기 */}
      </div>
   )
}

export default AdminPage
