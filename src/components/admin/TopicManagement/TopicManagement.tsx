// moovy-frontend/src/components/admin/TopicMangement/TopicMangement.tsx
import React, { useState, useMemo } from 'react'
import { Icon } from '@iconify/react'

import { Tabs } from '../../common/Tabs/Tabs'
import { StandardPagination } from '../../common/Pagination'
import { CommentManagementFilter } from '../AdminFilter'
import { Button } from '../../common/Button/ButtonStyle'
import { ActionButton } from '../../common/Button/Button'
import { TopicManagementModalComponent } from '../../modals/TopicManagementModal/TopicManagementModal'

import Avatar from '../../../assets/Avatar.png'
import './TopicManagement.scss'

interface Topic {
   id: number
   title: string
   synopsis: string
   start_at: string
   end_at: string
   views: number
   isAdminRecommended?: boolean // 관리자가 직접 추가한 토픽 여부
}

interface Comment {
   id: number
   user: string
   title: string
   comments: number
   created_at: string
   rating: number
   status: string
   content?: string
   likes?: number
   replies?: number
}

const TopicManagement: React.FC = () => {
   const [activeMainTab, setActiveMainTab] = useState<'current' | 'past'>('current')
   const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'popular' | 'showing' | 'recommended'>('all')
   const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
   const [expandedCommentId, setExpandedCommentId] = useState<number | null>(null)
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

   // 전체 작품 목록 데이터
   const allTopics: Topic[] = [
      {
         id: 1,
         title: '다 이루어질 지니',
         synopsis: 'Meadow Lane Oakland',
         start_at: '2025.10.01',
         end_at: '2025.10.08',
         views: 3420,
         isAdminRecommended: true, // 관리자 추천
      },
      {
         id: 2,
         title: '아이언맨',
         synopsis: 'Bagwell Avenue Ocala',
         start_at: '2025.10.01',
         end_at: '2025.10.08',
         views: 6737,
      },
      {
         id: 3,
         title: '대도시의 사랑법',
         synopsis: 'Nest Lane Olivette',
         start_at: '2025.10.01',
         end_at: '2025.10.08',
         views: 9871,
         isAdminRecommended: true, // 관리자 추천
      },
      {
         id: 4,
         title: '과거 작품 1',
         synopsis: 'Past Work 1',
         start_at: '2024.01.01',
         end_at: '2024.01.08',
         views: 1234,
      },
      {
         id: 5,
         title: '과거 작품 2',
         synopsis: 'Past Work 2',
         start_at: '2024.02.01',
         end_at: '2024.02.08',
         views: 5678,
         isAdminRecommended: true, // 관리자 추천
      },
   ]

   // 현재 날짜 기준으로 현재/과거 토픽 필터링
   const filteredTopicsByMainTab = useMemo(() => {
      const currentDate = new Date()
      return allTopics.filter((topic) => {
         const endDate = new Date(topic.end_at.replace(/\./g, '-'))
         if (activeMainTab === 'current') {
            // 현재 토픽: 종료일이 현재 날짜 이후
            return endDate >= currentDate
         } else {
            // 역대 토픽: 종료일이 현재 날짜 이전
            return endDate < currentDate
         }
      })
   }, [activeMainTab])

   // 필터 탭에 따라 추가 필터링
   const filteredTopics = useMemo(() => {
      if (activeFilterTab === 'all') {
         return filteredTopicsByMainTab
      } else if (activeFilterTab === 'popular') {
         // 조회수 기준으로 정렬 (높은 순)
         return [...filteredTopicsByMainTab].sort((a, b) => b.views - a.views)
      } else if (activeFilterTab === 'showing') {
         // 현재상영작: 시작일이 현재 날짜 이전이고 종료일이 현재 날짜 이후
         const currentDate = new Date()
         return filteredTopicsByMainTab.filter((topic) => {
            const startDate = new Date(topic.start_at.replace(/\./g, '-'))
            const endDate = new Date(topic.end_at.replace(/\./g, '-'))
            return startDate <= currentDate && endDate >= currentDate
         })
      } else if (activeFilterTab === 'recommended') {
         // 관리자추천: 관리자가 직접 추가한 토픽
         return filteredTopicsByMainTab.filter((topic) => topic.isAdminRecommended === true)
      }
      return filteredTopicsByMainTab
   }, [filteredTopicsByMainTab, activeFilterTab])

   // 코멘트 목록 데이터
   const comments: Comment[] = [
      {
         id: 1,
         user: 'Natali Craig',
         title: '코멘트 제목',
         comments: 23,
         created_at: '2025.10.08',
         rating: 5,
         status: '정상',
         content: '코멘트를 작성했습니다~',
         likes: 102,
         replies: 2,
      },
      {
         id: 2,
         user: 'Andi Lane',
         title: '코멘트 제목',
         comments: 324,
         created_at: '2025.10.08',
         rating: 5,
         status: '정상',
      },
      {
         id: 3,
         user: 'Natali Craig',
         title: '코멘트 제목',
         comments: 23,
         created_at: '2025.10.08',
         rating: 5,
         status: '정상',
      },
   ]

   const handleTopicClick = (topic: Topic) => {
      setSelectedTopic(topic)
   }

   const handleCommentExpand = (commentId: number) => {
      setExpandedCommentId(expandedCommentId === commentId ? null : commentId)
   }

   const handleCreate = () => {
      setIsCreateModalOpen(true)
   }

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false)
   }

   const handleEdit = () => {
      // TODO: 토픽 수정 모달 열기
      console.log('토픽 수정', selectedTopic)
   }

   const handleDelete = () => {
      // TODO: 토픽 삭제 확인 모달 열기
      console.log('토픽 삭제', selectedTopic)
   }

   const topicColumns = ['작품 제목', '작품 정보', '시작일', '종료일', '조회수']
   const commentColumns = ['유저', '제목', '댓글', '작성일', '평점', '상태']

   // 만들기 버튼 표시 조건: 현재 토픽 탭이고 관리자 추천 필터일 때
   const showCreateButton = activeMainTab === 'current' && activeFilterTab === 'recommended'

   return (
      <div className="topic-management">
         <div className="admin-content">
            {/* 상단 탭 */}
            <div className="topic-management__tabs">
               <Tabs
                  tabs={[
                     { id: 'current', label: '현재 토픽' },
                     { id: 'past', label: '역대 토픽' },
                  ]}
                  activeTab={activeMainTab}
                  onTabChange={(tabId) => {
                     setActiveMainTab(tabId as 'current' | 'past')
                     setSelectedTopic(null) // 탭 변경 시 선택된 토픽 초기화
                     setExpandedCommentId(null) // 탭 변경 시 확장된 코멘트 초기화
                  }}
                  variant="underline"
                  admin={true}
               />
            </div>

            {/* 필터 버튼 탭 */}
            <div className="topic-management__filter-tabs">
               <Tabs
                  tabs={[
                     { id: 'all', label: '전체 보기' },
                     { id: 'popular', label: '전체인기작' },
                     { id: 'showing', label: '현재상영작' },
                     { id: 'recommended', label: '관리자추천' },
                  ]}
                  activeTab={activeFilterTab}
                  onTabChange={(tabId) => setActiveFilterTab(tabId as 'all' | 'popular' | 'showing' | 'recommended')}
                  variant="button"
                  admin={true}
               />
            </div>

            {/* 작품 목록 테이블 */}
            <div className="topic-management__works-section">
               <div
                  className="table topic-table"
                  ref={(el) => {
                     // 너비 동기화를 위한 ref는 나중에 추가
                  }}
               >
                  <ul className="header">
                     {topicColumns.map((column) => (
                        <li key={column}>{column}</li>
                     ))}
                  </ul>
                  {filteredTopics.map((topic) => (
                     <ul key={topic.id} className={`data ${selectedTopic?.id === topic.id ? 'selected' : ''}`} onClick={() => handleTopicClick(topic)}>
                        <li>
                           <img src={Avatar} alt={topic.title} /> {topic.title}
                        </li>
                        <li>{topic.synopsis}</li>
                        <li>{topic.start_at}</li>
                        <li>{topic.end_at}</li>
                        <li>{topic.views}</li>
                     </ul>
                  ))}
               </div>

               {/* 액션 버튼 */}
               <div className="topic-management__actions">
                  <div className="topic-management__actions-left">
                     {showCreateButton && (
                        <Button variant="info" size="md" onClick={handleCreate} className="topic-management__create-btn">
                           만들기
                        </Button>
                     )}
                  </div>
                  <div className="topic-management__actions-right">
                     {selectedTopic && (
                        <>
                           <ActionButton action="edit" onClick={handleEdit} className="topic-management__edit-btn">
                              수정
                           </ActionButton>
                           <ActionButton action="delete" onClick={handleDelete} className="topic-management__delete-btn">
                              삭제
                           </ActionButton>
                        </>
                     )}
                  </div>
               </div>

               <StandardPagination className="mt-4" />
            </div>

            {/* 코멘트 목록 테이블 */}
            {selectedTopic && (
               <div className="topic-management__comments-section">
                  <h2 className="topic-management__section-title">{selectedTopic.title}</h2>
                  <CommentManagementFilter />

                  <div className="table comment-table">
                     <ul className="header">
                        {commentColumns.map((column) => (
                           <li key={column}>{column}</li>
                        ))}
                     </ul>
                     {comments.map((comment) => (
                        <React.Fragment key={comment.id}>
                           <ul className="data comment-row" onClick={() => handleCommentExpand(comment.id)} style={{ cursor: comment.content ? 'pointer' : 'default' }}>
                              <li>
                                 <img src={Avatar} alt={comment.user} /> {comment.user}
                              </li>
                              <li>{comment.title}</li>
                              <li>{comment.comments}</li>
                              <li>{comment.created_at}</li>
                              <li>
                                 <div style={{ display: 'flex', gap: '2px' }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                       <Icon
                                          key={i}
                                          icon="mdi:star"
                                          style={{
                                             color: i < comment.rating ? '#FFD700' : '#ccc',
                                             width: '16px',
                                             height: '16px',
                                          }}
                                       />
                                    ))}
                                 </div>
                              </li>
                              <li>{comment.status}</li>
                           </ul>
                           {expandedCommentId === comment.id && comment.content && (
                              <div className="comment-detail">
                                 <div className="comment-detail__header">
                                    <Icon icon="mdi:comment-text" />
                                    <span>00님의 한마디</span>
                                 </div>
                                 <div className="comment-detail__content">
                                    <p>{comment.content}</p>
                                    <div className="comment-detail__meta">
                                       <span>{comment.created_at}</span>
                                       <span>
                                          좋아요 {comment.likes}개 댓글 {comment.replies}
                                       </span>
                                    </div>
                                    <div className="comment-detail__actions">
                                       <button className="comment-detail__delete">삭제</button>
                                       <button className="comment-detail__warning">경고</button>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </React.Fragment>
                     ))}
                  </div>

                  <StandardPagination className="mt-4" />
               </div>
            )}
         </div>

         {/* 토픽 생성 모달 */}
         <TopicManagementModalComponent isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} mode="create" />
      </div>
   )
}

export default TopicManagement
