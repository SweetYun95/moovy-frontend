import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../../common/Button/ButtonStyle';
import { Input } from '../../common/Input/InputStyle';
import { Textarea } from '../../common/Textarea/TextareaStyle';
import { Selector } from '../../common/Selector/SelectorStyle';
import type { SelectorOption } from '../../common/Selector/SelectorStyle';
import { ImageUpload } from '../../common/ImageUpload/ImageUpload';
import { DateSelector } from '../../common/DateSelector/DateSelector';
import { createTopic, updateTopic, uploadTopicImages } from '../../../services/api/topicApi';
import './TopicManagementModal.scss';

/**
 사용법

// 생성 모드
<TopicManagementModalComponent 
  isOpen={isOpen} 
  onClose={onClose} 
  mode="create"
/>

// 수정 모드
<TopicManagementModalComponent 
  isOpen={isOpen} 
  onClose={onClose}
  topicId={123}
  mode="edit"
/>
 */

export interface TopicData {
  images: string[];
  title: string;
  runtime: string;
  ageRating: string;
  synopsis: string;
  releaseDate: { year: string; month: string; day: string };
  genre: string;
}

export interface TopicManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TopicData) => void;
  initialData?: TopicData;
}

const TopicManagementModal: React.FC<TopicManagementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [title, setTitle] = useState(initialData?.title || '');
  const [runtime, setRuntime] = useState(initialData?.runtime || '');
  const [ageRating, setAgeRating] = useState(initialData?.ageRating || '');
  const [synopsis, setSynopsis] = useState(initialData?.synopsis || '');
  const [releaseDate, setReleaseDate] = useState(
    initialData?.releaseDate || { year: '', month: '', day: '' }
  );
  const [genre, setGenre] = useState(initialData?.genre || '');

  const ageRatingOptions: SelectorOption[] = [
    { value: 'all', label: '전체 관람가' },
    { value: '12', label: '12세 관람가' },
    { value: '15', label: '15세 관람가' },
    { value: '18', label: '청소년 관람불가' },
  ];

  const genreOptions: SelectorOption[] = [
    { value: 'action', label: '액션' },
    { value: 'comedy', label: '코미디' },
    { value: 'drama', label: '드라마' },
    { value: 'horror', label: '공포' },
    { value: 'romance', label: '로맨스' },
    { value: 'sf', label: 'SF' },
    { value: 'thriller', label: '스릴러' },
    { value: 'animation', label: '애니메이션' },
  ];

  const handleSubmit = () => {
    if (!title.trim() || !runtime || !ageRating || !synopsis.trim() || !genre) {
      return;
    }
    onSubmit({
      images,
      title,
      runtime,
      ageRating,
      synopsis,
      releaseDate,
      genre,
    });
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="토픽관리" size="994px" showCloseButton={true}>
      <div className="topic-management-modal">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="topic-management-modal__field topic-management-modal__field--image">
              <ImageUpload images={images} onChange={setImages} maxImages={5} />
            </div>

            <div className="topic-management-modal__field">
              <label className="topic-management-modal__label">제목</label>
              <Input placeholder="제목을 추가하세요." value={title} onChange={setTitle} />
            </div>

            <div className="topic-management-modal__field">
              <label className="topic-management-modal__label">개봉일</label>
              <DateSelector value={releaseDate} onChange={setReleaseDate} />
            </div>

            <div className="topic-management-modal__field">
              <label className="topic-management-modal__label">러닝타임</label>
              <Input
                type="number"
                placeholder="숫자를 입력하세요."
                value={runtime}
                onChange={setRuntime}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="topic-management-modal__field">
              <label className="topic-management-modal__label">장르</label>
              <Selector
                options={genreOptions}
                value={genre}
                onChange={setGenre}
                placeholder="분류"
              />
            </div>

            <div className="topic-management-modal__field">
              <label className="topic-management-modal__label">시청연령</label>
              <Selector
                options={ageRatingOptions}
                value={ageRating}
                onChange={setAgeRating}
                placeholder="시청연령"
              />
            </div>

            <div className="topic-management-modal__field">
              <label className="topic-management-modal__label">간단줄거리</label>
              <Textarea
                placeholder="내용을 적어주세요."
                value={synopsis}
                onChange={setSynopsis}
                rows={6}
                maxLength={10000}
                showCounter
              />
            </div>
          </div>
        </div>

        {/* 맨 아래: 액션 버튼 */}
        <div className="topic-management-modal__actions">
          <Button variant="primary" onClick={handleSubmit} fullWidth>
            확인
          </Button>
          <Button variant="secondary" onClick={handleClose} fullWidth>
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TopicManagementModal;

// Component wrapper with API integration
export function TopicManagementModalComponent({ 
  isOpen, 
  onClose, 
  topicId,
  mode = 'create' 
}: { 
  isOpen: boolean
  onClose: () => void
  topicId?: number
  mode?: 'create' | 'edit'
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TopicData) => {
    setIsLoading(true);
    try {
      const releaseDate = `${data.releaseDate.year}-${data.releaseDate.month}-${data.releaseDate.day}`;
      
      if (mode === 'create') {
        await createTopic({
          images: data.images,
          title: data.title,
          runtime: data.runtime,
          ageRating: data.ageRating,
          synopsis: data.synopsis,
          releaseDate: data.releaseDate,
          genre: data.genre,
        });
      } else if (mode === 'edit' && topicId) {
        await updateTopic(topicId, {
          images: data.images,
          title: data.title,
          runtime: data.runtime,
          ageRating: data.ageRating,
          synopsis: data.synopsis,
          releaseDate: data.releaseDate,
          genre: data.genre,
        });
      }
      
      onClose();
    } catch (error) {
      console.error('토픽 저장 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TopicManagementModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
