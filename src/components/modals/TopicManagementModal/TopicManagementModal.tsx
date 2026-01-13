import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal/Modal';
import { ActionButton } from '../../common/Button/Button';
import { Input } from '../../common/Input/InputStyle';
import { Textarea } from '../../common/Textarea/TextareaStyle';
import { AgeRatingSelector, TopicGenreSelector } from '../../common/Selector/SelectorComponents';
import { Selector } from '../../common/Selector/SelectorStyle';
import { ImageUpload } from '../../common/ImageUpload/ImageUpload';
import { DateSelector } from '../../common/DateSelector/DateSelector';
import { createTopic, updateTopic, uploadTopicImages, searchTmdbMovies, getTmdbMovieDetails, createAdminTopic, getPopularSnapshot, getNowPlayingSnapshot } from '../../../services/api/topicApi';
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
  category?: string;
  country?: string;
  tmdb_id?: number;
  content_id?: number;
  start_at?: string;
  end_at?: string;
  snapshotMovies?: any[]; // 전체 인기작/현재 상영작용
}

export interface TopicManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TopicData) => void;
  initialData?: TopicData;
  sourceType?: 'recommended' | 'popular' | 'showing'; // 영화 선택 방식
}

const TopicManagementModal: React.FC<TopicManagementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  sourceType = 'recommended',
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
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [country, setCountry] = useState<string>(initialData?.country || '');
  
  // 영화 검색 관련 상태 (TMDB 검색용)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTmdbId, setSelectedTmdbId] = useState<number | null>(initialData?.tmdb_id || null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // PopularMovieSnapshot 선택 관련 상태 (전체 인기작/현재 상영작용)
  const [snapshotMovies, setSnapshotMovies] = useState<any[]>([]);
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  
  // 기간 설정 (3~7일)
  const [period, setPeriod] = useState(7); // 기본 7일
  const [startDate, setStartDate] = useState<string>(''); // ISO date string

  // 영화 검색 (디바운스)
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchTmdbMovies(query, 1);
      setSearchResults(response.data.results || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('영화 검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 검색어 변경 핸들러 (디바운스)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // 영화 선택 핸들러 (TMDB 검색용)
  const handleSelectMovie = async (tmdbId: number, movie: any) => {
    try {
      // 상세 정보 가져오기
      const details = await getTmdbMovieDetails(tmdbId);
      const movieData = details.data;

      // 폼 자동 채우기
      setSelectedTmdbId(tmdbId);
      setTitle(movieData.title || '');
      setSynopsis(movieData.overview || '');
      setRuntime(movieData.runtime?.toString() || '');
      
      // 개봉일 파싱
      if (movieData.release_date) {
        const date = new Date(movieData.release_date);
        setReleaseDate({
          year: date.getFullYear().toString(),
          month: String(date.getMonth() + 1).padStart(2, '0'),
          day: String(date.getDate()).padStart(2, '0'),
        });
      }

      // 장르 (첫 번째 장르만)
      if (movieData.genres && movieData.genres.length > 0) {
        setGenre(movieData.genres[0].id.toString());
      }

      // 포스터 이미지
      if (movieData.poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
        setImages([posterUrl]);
      }

      // 검색 결과 닫기
      setShowSearchResults(false);
      setSearchQuery('');
    } catch (error) {
      console.error('영화 상세 정보 조회 실패:', error);
    }
  };

  // PopularMovieSnapshot 영화 선택 핸들러
  const handleSelectSnapshotMovie = (item: any) => {
    if (!item.content) return;
    
    const content = item.content;
    setSelectedContentId(content.content_id);
    setTitle(content.title || '');
    setSynopsis(content.plot || '');
    
    // 개봉일 파싱
    if (content.release_date) {
      const date = new Date(content.release_date);
      setReleaseDate({
        year: date.getFullYear().toString(),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
      });
    }

    // 포스터 이미지
    if (content.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w500${content.poster_path}`;
      setImages([posterUrl]);
    }
  };

  // PopularMovieSnapshot 목록 로드 (popular/showing일 때) - 상위 3개만 자동 선택
  useEffect(() => {
    if (isOpen && (sourceType === 'popular' || sourceType === 'showing')) {
      const loadSnapshots = async () => {
        setIsLoadingSnapshots(true);
        try {
          const response = sourceType === 'popular' 
            ? await getPopularSnapshot({ limit: 3 }) // 상위 3개만
            : await getNowPlayingSnapshot({ limit: 3 }); // 상위 3개만
          
          const items = (response.data.items || []).slice(0, 3); // 최대 3개
          setSnapshotMovies(items);
        } catch (error) {
          console.error('스냅샷 조회 실패:', error);
          setSnapshotMovies([]);
        } finally {
          setIsLoadingSnapshots(false);
        }
      };
      loadSnapshots();
    }
  }, [isOpen, sourceType]);

  // 기간 변경 시 종료일 자동 계산
  useEffect(() => {
    if (startDate && period) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + period - 1);
      // onSubmit에 전달할 형식으로 저장
    }
  }, [startDate, period]);

  const handleSubmit = () => {
    // 관리자 추천작: 영화 선택 확인
    if (sourceType === 'recommended' && !selectedTmdbId) {
      alert('영화를 검색하고 선택해주세요.');
      return;
    }

    // 전체 인기작/현재 상영작: 자동 선택된 영화가 있는지 확인
    if ((sourceType === 'popular' || sourceType === 'showing') && snapshotMovies.length === 0) {
      alert('학습된 데이터가 없습니다.');
      return;
    }

    if (!startDate || !period) {
      alert('시작일과 기간을 설정해주세요.');
      return;
    }

    // 시작일과 종료일 계산
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + period - 1);

    // 관리자 추천작: 단일 영화
    if (sourceType === 'recommended') {
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
        tmdb_id: selectedTmdbId || undefined,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
      });
    } else {
      // 전체 인기작/현재 상영작: 여러 영화 (snapshotMovies에 있는 모든 영화)
      // 각 영화마다 onSubmit 호출 (또는 별도 처리)
      onSubmit({
        images: [],
        title: '',
        runtime: '',
        ageRating: '',
        synopsis: '',
        releaseDate: { year: '', month: '', day: '' },
        genre: '',
        snapshotMovies: snapshotMovies, // 여러 영화 정보 전달
        start_at: start.toISOString(),
        end_at: end.toISOString(),
      });
    }
    handleClose();
  };

  const handleClose = () => {
    // 상태 초기화
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedTmdbId(null);
    setSelectedContentId(null);
    setSnapshotMovies([]);
    setStartDate('');
    setPeriod(7);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="토픽관리" size="994px" showCloseButton={true}>
      <div className="topic-management-modal">
        {/* 영화 선택 섹션 */}
        <div className="topic-management-modal__search-section">
          {sourceType === 'recommended' ? (
            // TMDB 검색 (관리자 추천)
            <div className="topic-management-modal__field">
              <label className="form-label">영화 검색 (TMDB)</label>
              <div className="topic-management-modal__search-wrapper">
                <Input
                  placeholder="영화 제목을 입력하세요..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
                {isSearching && <span className="topic-management-modal__search-loading">검색 중...</span>}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="topic-management-modal__search-results">
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        className="topic-management-modal__search-result-item"
                        onClick={() => handleSelectMovie(movie.id, movie)}
                      >
                        {movie.poster_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            className="topic-management-modal__search-poster"
                          />
                        )}
                        <div className="topic-management-modal__search-result-info">
                          <div className="topic-management-modal__search-result-title">{movie.title}</div>
                          {movie.release_date && (
                            <div className="topic-management-modal__search-result-date">
                              {new Date(movie.release_date).getFullYear()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // PopularMovieSnapshot 자동 선택 (전체 인기작/현재 상영작) - 읽기 전용 표시
            <div className="topic-management-modal__field">
              <label className="form-label">
                {sourceType === 'popular' ? '전체 인기작' : '현재 상영작'} (자동 선택된 영화)
              </label>
              {isLoadingSnapshots ? (
                <div>로딩 중...</div>
              ) : snapshotMovies.length > 0 ? (
                <div className="topic-management-modal__snapshot-list">
                  {snapshotMovies.map((item) => (
                    <div
                      key={item.content?.content_id}
                      className="topic-management-modal__snapshot-item snapshot-item--readonly"
                    >
                      {item.content?.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.content.poster_path}`}
                          alt={item.content.title}
                          className="topic-management-modal__search-poster"
                        />
                      )}
                      <div className="topic-management-modal__search-result-info">
                        <div className="topic-management-modal__search-result-title">
                          {item.content?.title}
                        </div>
                        <div className="topic-management-modal__search-result-date">
                          순위: {item.rank}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>학습된 데이터가 없습니다.</div>
              )}
            </div>
          )}

          {/* 기간 설정 */}
          {(selectedTmdbId || (sourceType !== 'recommended' && snapshotMovies.length > 0)) && (
            <div className="topic-management-modal__field">
              <label className="form-label">토픽 기간 설정</label>
              <div className="topic-management-modal__period-wrapper">
                <Input
                  type="date"
                  placeholder="시작일"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                />
                <Selector
                  options={[
                    { value: '3', label: '3일' },
                    { value: '4', label: '4일' },
                    { value: '5', label: '5일' },
                    { value: '6', label: '6일' },
                    { value: '7', label: '7일' },
                  ]}
                  value={period.toString()}
                  onChange={(value) => setPeriod(Number(value))}
                  placeholder="기간 선택"
                />
              </div>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-12 col-lg-6 mb-3">
            <div className="topic-management-modal__field topic-management-modal__field--image">
              <ImageUpload images={images} onChange={setImages} maxImages={5} />
            </div>

            <div className="topic-management-modal__field">
              <label className="form-label">제목</label>
              <Input placeholder="제목을 추가하세요." value={title} onChange={setTitle} />
            </div>

            <div className="topic-management-modal__field">
              <label className="form-label">개봉일</label>
              <DateSelector value={releaseDate} onChange={setReleaseDate} />
            </div>

            <div className="topic-management-modal__field">
              <label className="form-label">러닝타임</label>
              <Input
                type="number"
                placeholder="숫자를 입력하세요."
                value={runtime}
                onChange={setRuntime}
              />
            </div>

            <div className="topic-management-modal__field">
              <label className="form-label">장르</label>
              <TopicGenreSelector
                value={genre}
                onChange={setGenre}
                placeholder="장르"
              />
            </div>
          </div>

          <div className="col-12 col-lg-6 mb-3">
            <div className="topic-management-modal__field">
              <label className="form-label">타입</label>
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
              <label className="form-label">국가</label>
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
              <label className="form-label">시청연령</label>
              <AgeRatingSelector
                value={ageRating}
                onChange={setAgeRating}
                placeholder="시청연령"
              />
            </div>

            <div className="topic-management-modal__field">
              <label className="form-label">간단줄거리</label>
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
          <ActionButton action="confirm" onClick={handleSubmit}>
            확인
          </ActionButton>
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
  mode = 'create',
  sourceType = 'recommended',
  onSuccess
}: { 
  isOpen: boolean
  onClose: () => void
  topicId?: number
  mode?: 'create' | 'edit'
  sourceType?: 'recommended' | 'popular' | 'showing'
  onSuccess?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TopicData) => {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        // 전체 인기작/현재 상영작: 여러 토픽 일괄 생성
        if (data.snapshotMovies && data.snapshotMovies.length > 0 && data.start_at && data.end_at) {
          // 각 영화마다 토픽 생성
          for (const item of data.snapshotMovies) {
            if (item.content?.content_id) {
              await createAdminTopic({
                content_id: item.content.content_id,
                start_at: data.start_at,
                end_at: data.end_at,
                is_admin_recommended: false,
              });
            }
          }
        }
        // 관리자 추천작: 단일 토픽 생성
        else if ((data.tmdb_id || data.content_id) && data.start_at && data.end_at) {
          await createAdminTopic({
            tmdb_id: data.tmdb_id,
            content_id: data.content_id,
            start_at: data.start_at,
            end_at: data.end_at,
            is_admin_recommended: sourceType === 'recommended',
          });
        } else {
          // 기존 방식 (호환성 유지)
          await createTopic({
            images: data.images,
            title: data.title,
            runtime: data.runtime,
            ageRating: data.ageRating,
            synopsis: data.synopsis,
            releaseDate: data.releaseDate,
            genre: data.genre,
            category: data.category,
            country: data.country,
          });
        }
      } else if (mode === 'edit' && topicId) {
        await updateTopic(topicId, {
          images: data.images,
          title: data.title,
          runtime: data.runtime,
          ageRating: data.ageRating,
          synopsis: data.synopsis,
          releaseDate: data.releaseDate,
          genre: data.genre,
          category: data.category,
          country: data.country,
        });
      }
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('토픽 저장 실패:', error);
      alert('토픽 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TopicManagementModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      sourceType={sourceType}
    />
  );
}
