// moovy-frontend/src/components/admin/TopicManagement/TopicManagement.tsx
import React, { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'

import { Tabs } from '../../common/Tabs/Tabs'
import { StandardPagination } from '../../common/Pagination'
import { CommentManagementFilter } from '../AdminFilter'
import { Button } from '../../common/Button/ButtonStyle'
import { ActionButton } from '../../common/Button/Button'
import { TopicManagementModalComponent, type TopicData } from '../../modals/TopicManagementModal/TopicManagementModal'

import Avatar from '../../../assets/Avatar.png'
import './TopicManagement.scss'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { deleteAdminTopic, getAdminPopularTopics, getAdminTopicComments, getAdminTopics, patchAdminTopic, postAdminTopic, setSelectedTopicId } from '@/features/admin/topicsSlice'
import type { AdminTopic, AdminTopicComment, AdminPopularItem } from '@/services/api/admin/adminTopicApi'

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
   // month/day가 "1" 처럼 와도 보정
   const mm = String(d.month).padStart(2, '0')
   const dd = String(d.day).padStart(2, '0')
   return `${d.year}-${mm}-${dd}`
}

function isoToPicker(input?: string | null) {
   if (!input) return { year: '', month: '', day: '' }
   const d = new Date(input)
   if (Number.isNaN(d.getTime())) {
      // 혹시 이미 "YYYY-MM-DD"면 split로 대응
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

function safeTitle(topic: AdminTopic) {
   return topic.VideoContent?.title ?? `content_id=${topic.content_id}`
}

function safeInfo(topic: AdminTopic) {
   const vc = topic.VideoContent
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
   const dispatch = useAppDispatch()
   const { list, popular, commentsByTopicId, selectedTopicId, loading, error } = useAppSelector((s) => s.adminTopics)

   const [activeMainTab, setActiveMainTab] = useState<'current' | 'past'>('current')
   const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'popular' | 'showing' | 'recommended'>('all')

   const [expandedCommentId, setExpandedCommentId] = useState<number | null>(null)

   // 모달 상태
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
   const [isEditModalOpen, setIsEditModalOpen] = useState(false)

   // ✅ popular row 클릭 시 preset content_id
   const [presetContentId, setPresetContentId] = useState<number | undefined>(undefined)

   // 서버 페이징
   const page = list.page || 1
   const size = list.size || 20

   // ─────────────────────────────────────────────
   // 데이터 로드
   // ─────────────────────────────────────────────
   React.useEffect(() => {
      if (activeFilterTab === 'popular') {
         dispatch(getAdminPopularTopics({ limit: 20 }))
         return
      }
      dispatch(getAdminTopics({ page, size }))
   }, [dispatch, activeFilterTab, page, size])

   // 선택된 토픽
   const selectedTopic = useMemo(() => {
      if (!selectedTopicId) return null
      return list.items.find((t) => t.topic_id === selectedTopicId) ?? null
   }, [selectedTopicId, list.items])

   // 선택된 토픽 댓글
   const selectedComments = useMemo(() => {
      if (!selectedTopicId) return null
      return commentsByTopicId[selectedTopicId] ?? null
   }, [commentsByTopicId, selectedTopicId])

   React.useEffect(() => {
      if (!selectedTopicId) return
      dispatch(getAdminTopicComments({ topic_id: selectedTopicId, page: 1, size: 20 }))
   }, [dispatch, selectedTopicId])

   // ─────────────────────────────────────────────
   // 프론트 필터링
   // ─────────────────────────────────────────────
   const filteredTopics = useMemo(() => {
      const now = new Date()

      const base = list.items.filter((t) => {
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
         return base.filter((t) => (t as any).is_admin_recommended === true)
      }

      return base
   }, [list.items, activeMainTab, activeFilterTab])

   const topicColumns = ['작품 제목', '작품 정보', '시작일', '종료일', '조회수']
   const commentColumns = ['유저', '내용', '작성일']

   const showCreateButton = activeMainTab === 'current' && activeFilterTab === 'recommended'
   const popularRows = popular as AdminPopularItem[]

   // ─────────────────────────────────────────────
   // 핸들러
   // ─────────────────────────────────────────────
   const handleTopicClick = (topic: AdminTopic) => {
      dispatch(setSelectedTopicId(topic.topic_id))
      setExpandedCommentId(null)
   }

   const handleCommentExpand = (commentId: number) => {
      setExpandedCommentId((prev) => (prev === commentId ? null : commentId))
   }

   const handleCreate = () => {
      setPresetContentId(undefined)
      setIsCreateModalOpen(true)
   }

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false)
      setPresetContentId(undefined)
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
      await dispatch(deleteAdminTopic(selectedTopic.topic_id))
      dispatch(setSelectedTopicId(null))
   }

   // ─────────────────────────────────────────────
   // ✅ 모달 submit 바인딩
   // ─────────────────────────────────────────────
   const submitCreate = async (data: TopicData) => {
      if (!data.contentId) return

     await dispatch(
        postAdminTopic({
           content_id: data.contentId,
           start_at: toISODate(data.topicStartAt),
           end_at: toISODate(data.topicEndAt),
           is_admin_recommended: activeFilterTab === 'recommended',
        }),
     )


      // 생성 후 목록 최신화(현재 탭이 popular면 굳이 topics는 안 당겨도 됨)
      if (activeFilterTab !== 'popular') {
         dispatch(getAdminTopics({ page: 1, size }))
      }

      setIsCreateModalOpen(false)
      setPresetContentId(undefined)
   }

   const submitEdit = async (data: TopicData) => {
      if (!selectedTopic) return

      // content_id 변경을 허용할지 말지는 정책 문제인데,
      // 백엔드 patch가 지원하면 보내고, 아니면 start/end만 보내면 됨.
      const payload: { content_id?: number; start_at?: string; end_at?: string } = {
         start_at: toISODate(data.topicStartAt),
         end_at: toISODate(data.topicEndAt),
      }
      if (data.contentId && data.contentId !== selectedTopic.content_id) payload.content_id = data.contentId

      await dispatch(patchAdminTopic({ topic_id: selectedTopic.topic_id, payload }))
      dispatch(getAdminTopics({ page, size }))
      setIsEditModalOpen(false)
   }

   // 수정 모달 초기값 만들기(TopicData 형태)
   const editInitialData: Partial<TopicData> | undefined = selectedTopic
      ? {
           contentId: selectedTopic.content_id,
           topicStartAt: isoToPicker(selectedTopic.start_at),
           topicEndAt: isoToPicker(selectedTopic.end_at),
           // 아래는 optional(UI 유지용)
           title: selectedTopic.VideoContent?.title ?? '',
           synopsis: selectedTopic.VideoContent?.plot ?? '',
           genre: selectedTopic.VideoContent?.genre ?? '',
           runtime: selectedTopic.VideoContent?.time ? String(selectedTopic.VideoContent.time) : '',
           ageRating: selectedTopic.VideoContent?.age_limit ? String(selectedTopic.VideoContent.age_limit) : '',
           releaseDate: isoToPicker(selectedTopic.VideoContent?.release_date ?? null),
           images: [],
        }
      : undefined

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
                     dispatch(setSelectedTopicId(null))
                     setExpandedCommentId(null)
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
                     dispatch(setSelectedTopicId(null))
                     setExpandedCommentId(null)
                  }}
                  variant="button"
                  admin={true}
               />
            </div>

            {/* 에러/로딩 */}
            {error && <div style={{ margin: '8px 0', color: '#d33' }}>{String(error)}</div>}
            {(loading.list || loading.popular) && <div style={{ margin: '8px 0' }}>불러오는 중...</div>}

            {/* 작품 목록 테이블 */}
            <div className="topic-management__works-section">
               <div className="table topic-table">
                  <ul className="header">
                     {topicColumns.map((column) => (
                        <li key={column}>{column}</li>
                     ))}
                  </ul>

                  {activeFilterTab === 'popular'
                     ? popularRows.map((p) => (
                          <ul
                             key={`${p.content_id}-${p.rank}`}
                             className="data"
                             onClick={() => {
                                // ✅ 인기작 클릭 → preset content_id 넣고 생성 모달 열기
                                setPresetContentId(p.content_id)
                                setIsCreateModalOpen(true)
                             }}
                             style={{ cursor: 'pointer' }}
                          >
                             <li>
                                <img src={Avatar} alt={p.title} /> {p.rank}. {p.title}
                             </li>
                             <li>{p.release_date ? formatDateDot(p.release_date) : '-'}</li>
                             <li>-</li>
                             <li>-</li>
                             <li>{p.views ?? '-'}</li>
                          </ul>
                       ))
                     : filteredTopics.map((topic) => (
                          <ul key={topic.topic_id} className={`data ${selectedTopicId === topic.topic_id ? 'selected' : ''}`} onClick={() => handleTopicClick(topic)} style={{ cursor: 'pointer' }}>
                             <li>
                                <img src={Avatar} alt={safeTitle(topic)} /> {safeTitle(topic)}
                             </li>
                             <li>{safeInfo(topic)}</li>
                             <li>{formatDateDot(topic.start_at)}</li>
                             <li>{formatDateDot(topic.end_at)}</li>
                             <li>{topic.VideoContent?.views ?? '-'}</li>
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
                     totalItems={list.total}
                     itemsPerPage={list.size}
                     currentPage={list.page}
                     onPageChange={(nextPage) => {
                        dispatch(getAdminTopics({ page: nextPage, size }))
                     }}
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

                     {(selectedComments?.items ?? []).map((c: AdminTopicComment) => (
                        <React.Fragment key={c.comment_id}>
                           <ul className="data comment-row" onClick={() => handleCommentExpand(c.comment_id)} style={{ cursor: 'pointer' }}>
                              <li>
                                 <img src={Avatar} alt={c.User?.name ?? String(c.user_id)} /> {c.User?.name ?? `user#${c.user_id}`}
                              </li>
                              <li>{c.content}</li>
                              <li>{formatDateDot(c.created_at)}</li>
                           </ul>

                           {expandedCommentId === c.comment_id && (
                              <div className="comment-detail">
                                 <div className="comment-detail__header">
                                    <Icon icon="mdi:comment-text" />
                                    <span>{c.User?.name ?? `user#${c.user_id}`}님의 한마디</span>
                                 </div>
                                 <div className="comment-detail__content">
                                    <p>{c.content}</p>

                                    <div className="comment-detail__meta">
                                       <span>{formatDateDot(c.created_at)}</span>
                                    </div>

                                    <div className="comment-detail__actions">
                                       <button className="comment-detail__delete" disabled>
                                          삭제(추가 API 필요)
                                       </button>
                                       <button className="comment-detail__warning" disabled>
                                          경고(추가 API 필요)
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </React.Fragment>
                     ))}
                  </div>

                  <StandardPagination
                     className="mt-4"
                     totalItems={selectedComments?.total ?? 0}
                     itemsPerPage={selectedComments?.size ?? 20}
                     currentPage={selectedComments?.page ?? 1}
                     onPageChange={(nextPage) => {
                        dispatch(getAdminTopicComments({ topic_id: selectedTopic.topic_id, page: nextPage, size: selectedComments?.size ?? 20 }))
                     }}
                  />
               </div>
            )}
         </div>

         {/* ✅ 토픽 생성 모달 */}
         <TopicManagementModalComponent
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            mode="create"
            presetContentId={presetContentId}
            onSubmit={submitCreate}
            initialData={{
               // preset이 있으면 contentId는 모달 내부에서 자동 세팅되지만,
               // 혹시 initialData로도 주고 싶으면 아래처럼:
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

         {/* ✅ 토픽 수정 모달 */}
         <TopicManagementModalComponent isOpen={isEditModalOpen} onClose={handleCloseEditModal} mode="edit" onSubmit={submitEdit} initialData={editInitialData} />
      </div>
   )
}

export default TopicManagement
