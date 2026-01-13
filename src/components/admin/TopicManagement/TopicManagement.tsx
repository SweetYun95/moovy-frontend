// moovy-frontend/src/components/admin/TopicManagement/TopicManagement.tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { Tabs } from '../../common/Tabs/Tabs'
import { StandardPagination } from '../../common/Pagination'
import { CommentManagementFilter } from '../AdminFilter'
import { Button } from '../../common/Button/ButtonStyle'
import { ActionButton } from '../../common/Button/Button'
import { TopicManagementModalComponent, type TopicData } from '../../modals/TopicManagementModal/TopicManagementModal'
import Avatar from '../../../assets/Avatar.png'
import './TopicManagement.scss'
import { getAdminTopics, deleteAdminTopic } from '../../../services/api/topicApi'

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────
function formatDateDot(input?: string | null) {
   if (!input) return '-'
   const d = new Date(input)
   if (Number.isNaN(d.getTime())) return String(input)
   const yyyy = d.getFullYear()
   const mm = String(d.getMonth() + 1).padStart(2, '0')
   const dd = String(d.getDate()).padStart(2, '0')
   return `${yyyy}.${mm}.${dd}`
}

function toISODate(d: { year: string; month: string; day: string }) {
   const mm = String(d.month).padStart(2, '0')
   const dd = String(d.day).padStart(2, '0')
   return `${d.year}-${mm}-${dd}`
}

function isoToPicker(input?: string | null) {
   if (!input) return { year: '', month: '', day: '' }
   const d = new Date(input)
   if (Number.isNaN(d.getTime())) {
      const m = String(input).match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (m) return { year: m[1], month: m[2], day: m[3] }
      return { year: '', month: '', day: '' }
   }
   return {
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, '0'),
      day: String(d.getDate()).padStart(2, '0'),
   }
}

function safeTitle(topic: any) {
   return topic.video?.title ?? topic.title ?? `content_id=${topic.content_id}`
}

function safeInfo(topic: any) {
   const vc = topic.video
   if (!vc) return '-'
   const parts: string[] = []
   if (vc.release_date) parts.push(formatDateDot(vc.release_date))
   if (vc.genre) parts.push(vc.genre)
   return parts.join(' · ') || '-'
}

// ─────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────
const TopicManagement: React.FC = () => {
   const [activeMainTab, setActiveMainTab] = useState<'current' | 'past'>('current')
   const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'popular' | 'showing' | 'recommended'>('all')
   const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
   const [expandedCommentId, setExpandedCommentId] = useState<number | null>(null)
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
   const [presetContentId, setPresetContentId] = useState<number | undefined>(undefined)
   const [allTopics, setAllTopics] = useState<any[]>([])
   const [loading, setLoading] = useState(false)
   const [totalItems, setTotalItems] = useState(0)
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 20

   // ─────────────────────────────────────────────
   // 데이터 로드
   // ─────────────────────────────────────────────
   const fetchTopics = useCallback(async () => {
      setLoading(true)
      try {
         const response = await getAdminTopics({
            main: activeMainTab,
            filter: activeFilterTab,
            page: currentPage,
            size: itemsPerPage,
            sort: 'start_at',
            order: 'DESC',
         })
         setAllTopics(response.data.items || [])
         setTotalItems(response.data.total || 0)
      } catch (error) {
         console.error('토픽 조회 실패:', error)
         setAllTopics([])
         setTotalItems(0)
      } finally {
         setLoading(false)
      }
   }, [activeMainTab, activeFilterTab, currentPage, itemsPerPage])

   useEffect(() => {
      fetchTopics()
   }, [fetchTopics])

   // 선택된 토픽
   const selectedTopic = useMemo(() => {
      if (!selectedTopicId) return null
      return allTopics.find((t) => t.topic_id === selectedTopicId) ?? null
   }, [selectedTopicId, allTopics])

   // ─────────────────────────────────────────────
   // 프론트 필터링
   // ─────────────────────────────────────────────
   const filteredTopics = useMemo(() => {
      const now = new Date()
      const base = allTopics.filter((t) => {
         const end = new Date(t.end_at)
         if (activeMainTab === 'current') return end >= now
         return end < now
      })

      if (activeFilterTab === 'all') return base
      if (activeFilterTab === 'showing') {
         return base.filter((t) => {
            const start = new Date(t.start_at)
            const end = new Date(t.end_at)
            return start <= now && end >= now
         })
      }
      if (activeFilterTab === 'recommended') {
         return base.filter((t) => t.is_admin_recommended === true)
      }
      return base
   }, [allTopics, activeMainTab, activeFilterTab])

   const topicColumns = ['작품 제목', '작품 정보', '시작일', '종료일', '조회수']
   const commentColumns = ['유저', '내용', '작성일']

   const showCreateButton = activeMainTab === 'current' && activeFilterTab === 'recommended'

   // ─────────────────────────────────────────────
   // 핸들러
   // ─────────────────────────────────────────────
   const handleTopicClick = (topic: any) => {
      setSelectedTopicId(topic.topic_id)
      setExpandedCommentId(null)
   }

   const handleCommentExpand = (commentId: number) => {
      setExpandedCommentId((prev) => (prev === commentId ? null : commentId))
   }

   const handleCreate = () => {
      setIsCreateModalOpen(true)
   }

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false)
   }

   const handleEdit = () => {
      if (!selectedTopic) return
      setIsEditModalOpen(true)
   }

   const handleCloseEditModal = () => setIsEditModalOpen(false)

   const handleDelete = async () => {
      if (!selectedTopic) return
      const ok = window.confirm(`"${safeTitle(selectedTopic)}" 토픽을 삭제할까요?`)
      if (!ok) return

      try {
         await deleteAdminTopic(selectedTopic.topic_id)
         await fetchTopics()
         setSelectedTopicId(null)
      } catch (error) {
         console.error('토픽 삭제 실패:', error)
         alert('토픽 삭제에 실패했습니다.')
      }
   }

   // ─────────────────────────────────────────────
   // 모달 submit 바인딩
   // ─────────────────────────────────────────────
   const submitCreate = async (data: TopicData) => {
      if (!data.contentId) return

      try {
         const { createAdminTopic } = await import('../../../services/api/topicApi')
         await createAdminTopic({
            content_id: data.contentId,
            start_at: toISODate(data.topicStartAt),
            end_at: toISODate(data.topicEndAt),
            is_admin_recommended: activeFilterTab === 'recommended',
         })
         await fetchTopics()
         setIsCreateModalOpen(false)
         setPresetContentId(undefined)
         setSelectedTopicId(null)
         setExpandedCommentId(null)
      } catch (error) {
         console.error('토픽 생성 실패:', error)
         alert('토픽 생성에 실패했습니다.')
      }
   }

   const submitEdit = async (data: TopicData) => {
      if (!selectedTopic) return

      try {
         // TODO: patchAdminTopic API 추가 필요
         // const { patchAdminTopic } = await import('../../../services/api/topicApi')
         // const payload: { content_id?: number; start_at?: string; end_at?: string } = {
         //    start_at: toISODate(data.topicStartAt),
         //    end_at: toISODate(data.topicEndAt),
         // }
         // if (data.contentId && data.contentId !== selectedTopic.content_id) {
         //    payload.content_id = data.contentId
         // }
         // await patchAdminTopic({ topic_id: selectedTopic.topic_id, payload })
         alert('토픽 수정 기능은 아직 구현되지 않았습니다.')
         setIsEditModalOpen(false)
      } catch (error) {
         console.error('토픽 수정 실패:', error)
         alert('토픽 수정에 실패했습니다.')
      }
   }


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
                     setSelectedTopicId(null)
                     setExpandedCommentId(null)
                     setCurrentPage(1)
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
                  onTabChange={(tabId) => {
                     setActiveFilterTab(tabId as any)
                     setSelectedTopicId(null)
                     setExpandedCommentId(null)
                     setCurrentPage(1)
                  }}
                  variant="button"
                  admin={true}
               />
            </div>

            {/* 에러/로딩 */}
            {loading && <div style={{ margin: '8px 0' }}>불러오는 중...</div>}

            {/* 작품 목록 테이블 */}
            <div className="topic-management__works-section">
               <div className="table topic-table">
                  <ul className="header">
                     {topicColumns.map((column) => (
                        <li key={column}>{column}</li>
                     ))}
                  </ul>
                  {filteredTopics.map((topic) => (
                     <ul
                        key={topic.topic_id}
                        className={`data ${selectedTopicId === topic.topic_id ? 'selected' : ''}`}
                        onClick={() => handleTopicClick(topic)}
                        style={{ cursor: 'pointer' }}
                     >
                        <li>
                           <img src={Avatar} alt={safeTitle(topic)} /> {safeTitle(topic)}
                        </li>
                        <li>{safeInfo(topic)}</li>
                        <li>{formatDateDot(topic.start_at)}</li>
                        <li>{formatDateDot(topic.end_at)}</li>
                        <li>{topic.video?.views ?? '-'}</li>
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
                     {selectedTopic && activeFilterTab !== 'popular' && (
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

               {/* 페이징 */}
               {activeFilterTab !== 'popular' && (
                  <StandardPagination
                     className="mt-4"
                     totalItems={totalItems}
                     itemsPerPage={itemsPerPage}
                     currentPage={currentPage}
                     onPageChange={setCurrentPage}
                  />
               )}
            </div>

            {/* 코멘트 목록 */}
            {selectedTopic && activeFilterTab !== 'popular' && (
               <div className="topic-management__comments-section">
                  <h2 className="topic-management__section-title">{safeTitle(selectedTopic)}</h2>
                  <CommentManagementFilter />
                  <div className="table comment-table">
                     <ul className="header">
                        {commentColumns.map((column) => (
                           <li key={column}>{column}</li>
                        ))}
                     </ul>
                     {/* 코멘트 데이터는 추후 API 연동 필요 */}
                  </div>
               </div>
            )}
         </div>

         {/* 토픽 생성 모달 */}
         {isCreateModalOpen && (
            <TopicManagementModalComponent
               isOpen={isCreateModalOpen}
               onClose={handleCloseCreateModal}
               mode="create"
               presetContentId={presetContentId}
               onSubmit={submitCreate}
               initialData={{
                  contentId: presetContentId,
                  topicStartAt: { year: '', month: '', day: '' },
                  topicEndAt: { year: '', month: '', day: '' },
                  images: [],
                  title: '',
                  runtime: '',
                  ageRating: '',
                  synopsis: '',
                  releaseDate: { year: '', month: '', day: '' },
                  genre: '',
               }}
            />
         )}

         {/* 토픽 수정 모달 */}
         {isEditModalOpen && selectedTopic && (
            <TopicManagementModalComponent
               isOpen={isEditModalOpen}
               onClose={handleCloseEditModal}
               mode="edit"
               onSubmit={submitEdit}
               initialData={{
                  contentId: selectedTopic.content_id,
                  topicStartAt: isoToPicker(selectedTopic.start_at),
                  topicEndAt: isoToPicker(selectedTopic.end_at),
                  title: selectedTopic.video?.title ?? '',
                  synopsis: selectedTopic.video?.synopsis ?? '',
                  genre: selectedTopic.video?.genre ?? '',
                  runtime: selectedTopic.video?.time ? String(selectedTopic.video.time) : '',
                  ageRating: selectedTopic.video?.age_limit ? String(selectedTopic.video.age_limit) : '',
                  releaseDate: isoToPicker(selectedTopic.video?.release_date ?? null),
                  images: [],
               }}
            />
         )}
      </div>
   )
}

export default TopicManagement
