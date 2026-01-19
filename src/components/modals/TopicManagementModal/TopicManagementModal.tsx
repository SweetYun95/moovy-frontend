// moovy-frontend/src/components/modals/TopicManagementModal/TopicManagementModal.tsx
import React, { useEffect, useState } from 'react'
import Modal from '../Modal/Modal'
import { ActionButton } from '../../common/Button/Button'
import { Input } from '../../common/Input/InputStyle'
import { Textarea } from '../../common/Textarea/TextareaStyle'
import { AgeRatingSelector, TopicGenreSelector } from '../../common/Selector/SelectorComponents'
import { Selector } from '../../common/Selector/SelectorStyle'
import { ImageUpload } from '../../common/ImageUpload/ImageUpload'
import { DateSelector } from '../../common/DateSelector/DateSelector'
import './TopicManagementModal.scss'

/**
 * ✅ 어드민 Topic(백엔드) 기준:
 * - 필수: content_id, start_at, end_at
 *
 * ✅ 이 모달은 이제 "UI 전용"으로만 동작하고,
 *    실제 API 호출은 부모(TopicManagement)에서 처리한다.
 */
export interface TopicData {
   // 기존 폼 유지(컨텐츠 정보 입력 UI)
   images: string[]
   title: string
   runtime: string
   ageRating: string
   synopsis: string
   releaseDate: { year: string; month: string; day: string }
   genre: string
   category?: string
   country?: string
   // ✅ 어드민 토픽 생성에 필요한 값 추가
   contentId?: number
   topicStartAt: { year: string; month: string; day: string }
   topicEndAt: { year: string; month: string; day: string }
}

export interface TopicManagementModalProps {
   isOpen: boolean
   onClose: () => void
   /** create/edit 모두 여기로 제출(부모가 API 호출) */
   onSubmit: (data: TopicData) => void
   /** 수정 모드 초기값 */
   initialData?: Partial<TopicData>
   /** popular 클릭 등으로 content_id를 미리 주입하고 싶을 때 */
   presetContentId?: number
   /** create | edit (표시/검증용) */
   mode?: 'create' | 'edit'
}

const TopicManagementModal: React.FC<TopicManagementModalProps> = ({ isOpen, onClose, onSubmit, initialData, presetContentId, mode = 'create' }) => {
   const [images, setImages] = useState<string[]>(initialData?.images || [])
   const [title, setTitle] = useState(initialData?.title || '')
   const [runtime, setRuntime] = useState(initialData?.runtime || '')
   const [ageRating, setAgeRating] = useState(initialData?.ageRating || '')
   const [synopsis, setSynopsis] = useState(initialData?.synopsis || '')
   const [releaseDate, setReleaseDate] = useState(initialData?.releaseDate || { year: '', month: '', day: '' })
   const [genre, setGenre] = useState(initialData?.genre || '')
   const [category, setCategory] = useState<string>(initialData?.category || '')
   const [country, setCountry] = useState<string>(initialData?.country || '')
   // ✅ 어드민 토픽 기간(필수)
   const [topicStartAt, setTopicStartAt] = useState(initialData?.topicStartAt || { year: '', month: '', day: '' })
   const [topicEndAt, setTopicEndAt] = useState(initialData?.topicEndAt || { year: '', month: '', day: '' })
   // ✅ content_id (preset 우선)
   const [contentId, setContentId] = useState<number | undefined>(initialData?.contentId ?? presetContentId)

   useEffect(() => {
      // 모달이 열릴 때 presetContentId가 오면 반영
      if (typeof presetContentId === 'number') setContentId(presetContentId)
   }, [presetContentId, isOpen])

   const handleSubmit = () => {
      // ✅ 어드민 Topic 기준 최소 검증
      if (!contentId) {
         alert('content_id가 필요합니다. (인기작에서 선택하거나 content_id를 입력하세요)')
         return
      }

      if (!topicStartAt.year || !topicStartAt.month || !topicStartAt.day || !topicEndAt.year || !topicEndAt.month || !topicEndAt.day) {
         alert('토픽 시작일/종료일을 입력하세요.')
         return
      }

      // 기존 폼 필수 검증(원하면 끌 수 있음)
      // 지금 백엔드는 VideoContent 생성이 아니라 Topic 생성이므로,
      // title/runtime/...는 "나중에 VideoContent 생성 API를 붙일 때" 의미가 있다.
      // 일단 UI 유지하되, 빈 값이어도 통과시키고 싶으면 아래 블록을 주석 처리하면 됨.
      // if (!title.trim() || !runtime || !ageRating || !synopsis.trim() || !genre) return

      onSubmit({
         images,
         title,
         runtime,
         ageRating,
         synopsis,
         releaseDate,
         genre,
         category,
         country,
         contentId,
         topicStartAt,
         topicEndAt,
      })

      onClose()
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? '토픽 생성' : '토픽 수정'} size="994px" showCloseButton={true}>
         <div className="topic-management-modal">
            <div className="row">
               <div className="col-12 col-lg-6 mb-3">
                  <div className="topic-management-modal__field topic-management-modal__field--image">
                     <ImageUpload images={images} onChange={setImages} maxImages={5} />
                  </div>
                  {/* ✅ 어드민 Topic에 필요한 content_id */}
                  <div className="topic-management-modal__field">
                     <label className="form-label">content_id (필수)</label>
                     <Input
                        type="number"
                        placeholder="예: 123"
                        value={contentId ? String(contentId) : ''}
                        onChange={(v) => setContentId(v ? Number(v) : undefined)}
                        disabled={typeof presetContentId === 'number'} // popular에서 선택 시 고정
                     />
                     {typeof presetContentId === 'number' && <small style={{ opacity: 0.7 }}>인기작에서 선택된 content_id로 고정됨</small>}
                  </div>
                  {/* ✅ 어드민 Topic 기간 */}
                  <div className="topic-management-modal__field">
                     <label className="form-label">토픽 시작일 (필수)</label>
                     <DateSelector value={topicStartAt} onChange={setTopicStartAt} />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">토픽 종료일 (필수)</label>
                     <DateSelector value={topicEndAt} onChange={setTopicEndAt} />
                  </div>
                  {/* 아래는 기존 컨텐츠 입력 폼 유지(당장 백엔드 Topic CRUD에는 직접 안 씀) */}
                  <div className="topic-management-modal__field">
                     <label className="form-label">제목(옵션)</label>
                     <Input placeholder="제목을 추가하세요." value={title} onChange={setTitle} />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">개봉일(옵션)</label>
                     <DateSelector value={releaseDate} onChange={setReleaseDate} />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">러닝타임(옵션)</label>
                     <Input type="number" placeholder="숫자를 입력하세요." value={runtime} onChange={setRuntime} />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">장르(옵션)</label>
                     <TopicGenreSelector value={genre} onChange={setGenre} placeholder="장르" />
                  </div>
               </div>
               <div className="col-12 col-lg-6 mb-3">
                  <div className="topic-management-modal__field">
                     <label className="form-label">타입(옵션)</label>
                     <Selector
                        options={[
                           { value: 'movie', label: '영화' },
                           { value: 'drama', label: '드라마' },
                           { value: 'animation', label: '애니메이션' },
                           { value: 'documentary', label: '다큐멘터리' },
                        ]}
                        value={category}
                        onChange={setCategory}
                        placeholder="타입"
                     />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">국가(옵션)</label>
                     <Selector
                        options={[
                           { value: 'kr', label: '한국' },
                           { value: 'us', label: '미국' },
                           { value: 'jp', label: '일본' },
                           { value: 'cn', label: '중국' },
                           { value: 'uk', label: '영국' },
                           { value: 'fr', label: '프랑스' },
                           { value: 'de', label: '독일' },
                           { value: 'it', label: '이탈리아' },
                        ]}
                        value={country}
                        onChange={setCountry}
                        placeholder="국가"
                     />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">시청연령(옵션)</label>
                     <AgeRatingSelector value={ageRating} onChange={setAgeRating} placeholder="시청연령" />
                  </div>
                  <div className="topic-management-modal__field">
                     <label className="form-label">간단줄거리(옵션)</label>
                     <Textarea placeholder="내용을 적어주세요." value={synopsis} onChange={setSynopsis} rows={6} maxLength={10000} showCounter />
                  </div>
               </div>
            </div>
            <div className="topic-management-modal__actions">
               <ActionButton action="confirm" onClick={handleSubmit}>
                  확인
               </ActionButton>
            </div>
         </div>
      </Modal>
   )
}

export default TopicManagementModal

/**
 * ✅ 기존 wrapper는 "API를 여기서 호출"해서 어드민 바인딩이 꼬였음.
 * 이제 wrapper는 UI 편의용으로만 쓰고, 실제 submit 처리는 부모가 받게 한다.
 */
export function TopicManagementModalComponent(props: TopicManagementModalProps) {
   return <TopicManagementModal {...props} />
}
