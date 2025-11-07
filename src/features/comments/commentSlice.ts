//코멘트 전용 슬라이스
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as commentApi from '@/services/api/commentApi';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

// 홈페이지 코멘트 카드용 (레거시)
export type CommentCard = {
  id: number;
  username: string;
  contentId?: number;
  comment: string;
  rating: number;
  likes: number;
  replies: number;
  created_at?: string; // 실시간 리뷰 정렬용
};

// 토픽별 코멘트용 (신규 API)
export type CommentAuthor = {
  user_id: number;
  name: string;
};

export type CommentItem = {
  comment_id: number;
  topic_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  User?: CommentAuthor;
  user?: CommentAuthor;
  rating?: number;
  likes?: number;
  replies?: number;
};

export type CommentBucket = {
  items: CommentItem[];
  loading: boolean;
  error: string | null;
};

// 초기 CommentBucket 객체 (메모이제이션용 상수)
const EMPTY_BUCKET: CommentBucket = {
  items: [],
  loading: false,
  error: null,
};

// 통합 상태 구조
export type CommentState = {
  // 토픽별 코멘트 목록 (모든 코멘트는 토픽별로 관리)
  byTopicId: Record<number, CommentBucket>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  topicError: string | null;
};

const initialState: CommentState = {
  byTopicId: {},
  creating: false,
  updating: false,
  deleting: false,
  topicError: null,
};

// ─────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────

// 목업 데이터 생성 함수 (공통 사용)
function generateMockComments(): CommentItem[] {
  const now = new Date();
  
  // 통일된 목업 데이터 배열 (모든 코멘트를 하나의 배열로 관리)
  const mockComments: CommentItem[] = [
      {
        comment_id: 1,
        topic_id: 1,
        user_id: 1,
        content: '정말 재미있는 영화였어요! 케이팝 아이돌들이 액션 히어로로 나오는 설정이 신선하고, 스토리도 탄탄해서 끝까지 몰입해서 봤습니다.',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
        User: { user_id: 1, name: '유저닉네임1' },
        rating: 4.5,
        likes: 102,
        replies: 2,
      },
      {
        comment_id: 2,
        topic_id: 2,
        user_id: 2,
        content: '예상보다 훨씬 재미있었습니다! 스토리 전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었어요.',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
        User: { user_id: 2, name: '영화매니아' },
        rating: 4.0,
        likes: 89,
        replies: 5,
      },
      {
        comment_id: 3,
        topic_id: 3,
        user_id: 3,
        content: '정치 드라마치고는 정말 현실적이고 몰입도가 높았습니다. 배우들의 연기도 훌륭하고, 스토리도 정치적 상황을 잘 반영한 것 같아요.',
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
        User: { user_id: 3, name: '드라마러버' },
        rating: 4.5,
        likes: 156,
        replies: 8,
      },
      {
        comment_id: 4,
        topic_id: 5,
        user_id: 4,
        content: '지구가 위기에 처한 가운데, 우주를 탐험하는 과학자 팀이 새로운 행성을 찾아 인류를 구하기 위한 모험을 떠나는 SF 드라마.',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
        User: { user_id: 4, name: '시네마팬' },
        rating: 5.0,
        likes: 234,
        replies: 15,
      },
      {
        comment_id: 5,
        topic_id: 6,
        user_id: 5,
        content: '배트맨이 조커의 완전한 무정부주의적 테러에 맞서 고담시티를 지키기 위한 치열한 싸움을 펼치는 슈퍼히어로 액션.',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        User: { user_id: 5, name: '액션러버' },
        rating: 5.0,
        likes: 567,
        replies: 42,
      },
      {
        comment_id: 6,
        topic_id: 7,
        user_id: 6,
        content: '꿈 속의 꿈 속으로 들어가 상대의 무의식에 아이디어를 심는 기술, 인셉션을 다룬 미래적 SF 스릴러 영화.',
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
        User: { user_id: 6, name: 'SF매니아' },
        rating: 4.5,
        likes: 312,
        replies: 28,
      },
      {
        comment_id: 7,
        topic_id: 9,
        user_id: 7,
        content: '반지하 주택에 살던 기택 가족이 상류층 박 사장 집에 취업하며 벌어지는 계급 간 갈등을 담은 블랙코미디 스릴러.',
        created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
        User: { user_id: 7, name: '영화평론가' },
        rating: 4.0,
        likes: 445,
        replies: 35,
      },
      {
        comment_id: 8,
        topic_id: 10,
        user_id: 8,
        content: '1912년 타이타닉 호에서 만난 상류층 레이디 로즈와 하층민 출신 잭의 금지된 사랑을 그린 로맨스 재난 영화.',
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8일 전
        User: { user_id: 8, name: '로맨스팬' },
        rating: 4.5,
        likes: 289,
        replies: 19,
      },
      {
        comment_id: 9,
        topic_id: 11,
        user_id: 9,
        content: '마법의 얼음 힘을 가진 엘사의 실수로 왕국이 겨울에 얼어붙자, 여동생 안나와 함께 왕국을 구하기 위해 떠나는 모험 이야기.',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
        User: { user_id: 9, name: '애니메이션팬' },
        rating: 4.5,
        likes: 378,
        replies: 24,
      },
      {
        comment_id: 10,
        topic_id: 4,
        user_id: 10,
        content: '토르의 묵직한 액션과 연출이 인상 깊었습니다. 마블 시네마틱 유니버스의 시작을 알리는 작품이라 더욱 의미가 있습니다.',
        created_at: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9일 전
        User: { user_id: 10, name: '영화광유저' },
        rating: 4.0,
        likes: 156,
        replies: 8,
      },
      {
        comment_id: 11,
        topic_id: 6,
        user_id: 11,
        content: '하스 레저의 조커 연기가 정말 압도적입니다. 영화사를 바꾼 최고의 악역 연기라고 생각합니다. 매번 봐도 새롭습니다.',
        created_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12일 전
        User: { user_id: 11, name: '액션중독' },
        rating: 5.0,
        likes: 789,
        replies: 67,
      },
      {
        comment_id: 12,
        topic_id: 7,
        user_id: 12,
        content: '꿈 속의 꿈, 레이어별로 복잡하게 얽힌 스토리가 정말 놀랍습니다. 크리스토퍼 놀란 감독의 시그니처 영화네요!',
        created_at: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11일 전
        User: { user_id: 12, name: 'SF마니아' },
        rating: 4.5,
        likes: 423,
        replies: 31,
      },
      {
        comment_id: 13,
        topic_id: 1,
        user_id: 13,
        content: '케이팝 아이돌들이 주연으로 나오는 영화라서 기대했는데, 생각보다 액션 연기가 훌륭하네요!',
        created_at: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13일 전
        User: { user_id: 13, name: '영화감상러' },
        rating: 4.0,
        likes: 198,
        replies: 12,
      },
      {
        comment_id: 14,
        topic_id: 2,
        user_id: 14,
        content: '스토리 전개가 예상치 못한 방향으로 흘러가서 몰입도가 높았습니다. 재미있게 봤어요!',
        created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14일 전
        User: { user_id: 14, name: '블록버스터팬' },
        rating: 4.5,
        likes: 267,
        replies: 18,
      },
      {
        comment_id: 15,
        topic_id: 3,
        user_id: 15,
        content: '정치 드라마의 현실감이 인상적이었습니다. 배우들의 연기력도 뛰어나고요.',
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15일 전
        User: { user_id: 15, name: '드라마매니아' },
        rating: 4.0,
        likes: 345,
        replies: 25,
      },
      {
        comment_id: 16,
        topic_id: 5,
        user_id: 16,
        content: '우주 탐험의 긴장감과 인간의 도전 정신이 잘 드러난 작품입니다.',
        created_at: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(), // 16일 전
        User: { user_id: 16, name: 'SF러버' },
        rating: 4.5,
        likes: 289,
        replies: 21,
      },
      {
        comment_id: 17,
        topic_id: 6,
        user_id: 17,
        content: '조커와 배트맨의 대립 구도가 정말 탁월합니다. 명작이에요!',
        created_at: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString(), // 17일 전
        User: { user_id: 17, name: '액션팬' },
        rating: 5.0,
        likes: 892,
        replies: 78,
      },
      {
        comment_id: 18,
        topic_id: 7,
        user_id: 18,
        content: '레이어별로 복잡하게 얽힌 스토리가 정말 놀랍습니다. 여러 번 봐도 새롭네요.',
        created_at: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18일 전
        User: { user_id: 18, name: '인셉션러버' },
        rating: 4.5,
        likes: 512,
        replies: 42,
      },
      {
        comment_id: 19,
        topic_id: 9,
        user_id: 19,
        content: '계급 간 갈등을 날카롭게 그린 작품입니다. 봉준호 감독의 연출력이 돋보여요.',
        created_at: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(), // 19일 전
        User: { user_id: 19, name: '기생충팬' },
        rating: 4.5,
        likes: 678,
        replies: 56,
      },
      {
        comment_id: 20,
        topic_id: 10,
        user_id: 20,
        content: '로맨스와 재난의 조합이 인상적입니다. 레오나르도 디카프리오의 연기가 훌륭해요.',
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20일 전
        User: { user_id: 20, name: '타이타닉매니아' },
        rating: 4.0,
        likes: 456,
        replies: 33,
      },
      {
        comment_id: 21,
        topic_id: 11,
        user_id: 21,
        content: '엘사와 안나의 자매애가 감동적입니다. 음악도 정말 좋아요!',
        created_at: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21일 전
        User: { user_id: 21, name: '겨울왕국팬' },
        rating: 4.5,
        likes: 389,
        replies: 28,
      },
      {
        comment_id: 22,
        topic_id: 4,
        user_id: 22,
        content: '마블 시네마틱 유니버스의 시작점이 되는 작품이라 의미가 깊습니다.',
        created_at: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(), // 22일 전
        User: { user_id: 22, name: '토르팬' },
        rating: 4.0,
        likes: 234,
        replies: 15,
      },
      {
        comment_id: 23,
        topic_id: 1,
        user_id: 23,
        content: '케이팝 아이돌의 액션 연기가 인상적입니다. 스토리도 탄탄하고요.',
        created_at: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(), // 23일 전
        User: { user_id: 23, name: '영화리뷰어' },
        rating: 4.5,
        likes: 312,
        replies: 22,
      },
      {
        comment_id: 31,
        topic_id: 1,
        user_id: 31,
        content: '루미, 미라, 조이의 액션 시퀀스가 정말 멋졌어요! 아이돌이지만 연기력도 대단하고요.',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        User: { user_id: 31, name: '케이팝팬' },
        rating: 5.0,
        likes: 523,
        replies: 45,
      },
      {
        comment_id: 32,
        topic_id: 1,
        user_id: 32,
        content: '팬들을 보호하는 히어로 설정이 신선하고 재미있었습니다. 스토리도 무난했어요.',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
        User: { user_id: 32, name: '히어로영화팬' },
        rating: 4.0,
        likes: 287,
        replies: 18,
      },
      {
        comment_id: 33,
        topic_id: 1,
        user_id: 33,
        content: '초자연적 위협으로부터 팬들을 지키는 설정이 아이돌과 잘 어울리는 것 같아요. 재밌게 봤습니다!',
        created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
        User: { user_id: 33, name: '액션영화매니아' },
        rating: 4.5,
        likes: 412,
        replies: 28,
      },
      {
        comment_id: 34,
        topic_id: 1,
        user_id: 34,
        content: '스타디움 공연 장면과 액션 장면의 전환이 자연스러워서 몰입도가 높았어요.',
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
        User: { user_id: 34, name: '영화감상자' },
        rating: 4.0,
        likes: 356,
        replies: 24,
      },
      {
        comment_id: 35,
        topic_id: 1,
        user_id: 35,
        content: '케이팝 아이돌들이 주연으로 나오는 영화라 처음엔 걱정했는데, 생각보다 진지하게 잘 만들어진 것 같아요.',
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8일 전
        User: { user_id: 35, name: '영화평론가2' },
        rating: 4.5,
        likes: 489,
        replies: 35,
      },
      {
        comment_id: 36,
        topic_id: 1,
        user_id: 36,
        content: '매진을 기록하는 스타디움 공연이 나올 때 영화관에서도 응원하고 싶었어요!',
        created_at: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9일 전
        User: { user_id: 36, name: '콘서트팬' },
        rating: 5.0,
        likes: 678,
        replies: 52,
      },
      {
        comment_id: 37,
        topic_id: 1,
        user_id: 37,
        content: '비밀 능력으로 팬들을 보호한다는 설정이 로맨틱하면서도 액션적이어서 좋았어요.',
        created_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12일 전
        User: { user_id: 37, name: '판타지액션팬' },
        rating: 4.5,
        likes: 445,
        replies: 31,
      },
      {
        comment_id: 38,
        topic_id: 1,
        user_id: 38,
        content: '아이돌들이 히어로로 변신하는 장면이 정말 멋졌습니다. CG도 훌륭했어요!',
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15일 전
        User: { user_id: 38, name: 'CG매니아' },
        rating: 4.0,
        likes: 398,
        replies: 27,
      },
      {
        comment_id: 39,
        topic_id: 1,
        user_id: 39,
        content: '초자연적 위협과 싸우는 액션 장면이 탄탄해서 지루할 틈이 없었어요.',
        created_at: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString(), // 17일 전
        User: { user_id: 39, name: '스릴러팬' },
        rating: 4.5,
        likes: 521,
        replies: 38,
      },
      {
        comment_id: 40,
        topic_id: 1,
        user_id: 40,
        content: '케이팝과 액션 히어로의 조합이 의외로 잘 어울리네요. 재밌게 봤습니다!',
        created_at: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(), // 19일 전
        User: { user_id: 40, name: '다양한장르팬' },
        rating: 4.0,
        likes: 334,
        replies: 21,
      },
      {
        comment_id: 24,
        topic_id: 2,
        user_id: 24,
        content: '전개가 빠르고 긴장감이 계속 유지되어서 지루할 틈이 없었습니다.',
        created_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000).toISOString(), // 24일 전
        User: { user_id: 24, name: '시네필' },
        rating: 4.0,
        likes: 278,
        replies: 19,
      },
      {
        comment_id: 25,
        topic_id: 3,
        user_id: 25,
        content: '정치적 상황을 잘 반영한 드라마입니다. 몰입도가 높았어요.',
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25일 전
        User: { user_id: 25, name: '드라마리뷰어' },
        rating: 4.5,
        likes: 423,
        replies: 31,
      },
      {
        comment_id: 26,
        topic_id: 5,
        user_id: 26,
        content: '인류의 생존을 위한 모험이 흥미진진합니다. SF 요소가 잘 어우러져요.',
        created_at: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000).toISOString(), // 26일 전
        User: { user_id: 26, name: '우주탐험팬' },
        rating: 5.0,
        likes: 356,
        replies: 27,
      },
      {
        comment_id: 27,
        topic_id: 6,
        user_id: 27,
        content: '하스 레저의 조커 연기는 정말 압도적입니다. 최고의 악역 연기예요!',
        created_at: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(), // 27일 전
        User: { user_id: 27, name: '다크나이트팬' },
        rating: 5.0,
        likes: 1023,
        replies: 95,
      },
      {
        comment_id: 28,
        topic_id: 7,
        user_id: 28,
        content: '꿈의 레이어 구조가 정말 창의적입니다. 크리스토퍼 놀란 감독의 대표작이에요.',
        created_at: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28일 전
        User: { user_id: 28, name: '인셉션팬' },
        rating: 4.5,
        likes: 567,
        replies: 48,
      },
      {
        comment_id: 29,
        topic_id: 9,
        user_id: 29,
        content: '계급 갈등을 날카롭게 그린 작품입니다. 봉준호 감독의 연출력이 돋보여요.',
        created_at: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(), // 29일 전
        User: { user_id: 29, name: '기생충리뷰어' },
        rating: 4.5,
        likes: 756,
        replies: 62,
      },
      {
        comment_id: 30,
        topic_id: 10,
        user_id: 30,
        content: '타이타닉의 비극적인 로맨스가 여전히 감동적입니다.',
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30일 전
        User: { user_id: 30, name: '로맨스드라마팬' },
        rating: 4.0,
        likes: 445,
        replies: 34,
      },
    ];
    
    // 추가 목업 데이터 동적 생성 (31-100번)
    const usernames = [
      '영화리뷰어1', '영화리뷰어2', '영화리뷰어3', '영화리뷰어4', '영화리뷰어5',
      '시네마팬1', '시네마팬2', '시네마팬3', '시네마팬4', '시네마팬5',
      '액션러버1', '액션러버2', '액션러버3', '액션러버4', '액션러버5',
      '드라마팬1', '드라마팬2', '드라마팬3', '드라마팬4', '드라마팬5',
      'SF매니아1', 'SF매니아2', 'SF매니아3', 'SF매니아4', 'SF매니아5',
      '로맨스팬1', '로맨스팬2', '로맨스팬3', '로맨스팬4', '로맨스팬5',
      '코미디팬1', '코미디팬2', '코미디팬3', '코미디팬4', '코미디팬5',
      '스릴러팬1', '스릴러팬2', '스릴러팬3', '스릴러팬4', '스릴러팬5',
      '호러팬1', '호러팬2', '호러팬3', '호러팬4', '호러팬5',
    ];
    const comments = [
      '정말 재미있는 영화였어요!',
      '스토리가 탄탄하고 몰입도가 높았습니다.',
      '배우들의 연기가 훌륭했습니다.',
      '예상보다 훨씬 좋았어요!',
      '다시 보고 싶은 작품입니다.',
      '감동적인 스토리였습니다.',
      '액션이 정말 멋졌어요!',
      '음악도 좋고 연출도 훌륭했습니다.',
      '시간 가는 줄 몰랐습니다.',
      '명작이라고 생각합니다.',
    ];
    
    // 31-100번 코멘트를 동적으로 생성하여 같은 배열에 추가
    for (let i = 31; i <= 100; i++) {
      const usernameIndex = (i - 31) % usernames.length;
      const commentIndex = (i - 31) % comments.length;
      const contentIdIndex = (i - 31) % 11 + 1; // 1~11
      const daysAgo = i; // 31일 전 ~ 100일 전
      
      // likes와 replies를 다양하게 설정 (정렬 테스트용)
      const likes = Math.floor(Math.random() * 1000) + 10;
      const replies = Math.floor(Math.random() * 100) + 1;
      
      // 별점을 0.5 단위로 생성 (3.0, 3.5, 4.0, 4.5, 5.0)
      const ratingSteps = [3.0, 3.5, 4.0, 4.5, 5.0];
      const rating = ratingSteps[Math.floor(Math.random() * ratingSteps.length)];
      
      mockComments.push({
        comment_id: i,
        topic_id: contentIdIndex,
        user_id: i,
        content: comments[commentIndex],
        created_at: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        User: { user_id: i, name: usernames[usernameIndex] },
        rating,
        likes,
        replies,
      });
    }
    
    console.log(`generateMockComments - 목업 데이터 생성 완료: 총 ${mockComments.length}개`);
    return mockComments;
}

// 홈페이지용 여러 토픽의 코멘트 조회 (토픽별로 그룹화하여 반환)
export const fetchCommentsThunk = createAsyncThunk(
  'comments/fetchHome',
  async (_, { rejectWithValue }) => {
    // TODO: API 연결 완료 시 주석 해제
    // try {
    //   const data = await commentApi.getCommentCards();
    //   // ... API 처리 로직 ...
    // } catch (error) {
    //   console.error('Comment API 호출 실패, 목업 데이터 사용:', error);
    // }
    
    // 목업 데이터 직접 반환 (API 연결 전까지 사용)
    console.log('fetchCommentsThunk - 목업 데이터 사용 (API 연결 전)');
    
    const tempData = generateMockComments();
    
    // 토픽별로 그룹화하여 반환 (byTopicId에 저장하기 위함)
    const groupedByTopic: Record<number, CommentItem[]> = {};
    tempData.forEach((comment) => {
      const topicId = comment.topic_id;
      if (!groupedByTopic[topicId]) {
        groupedByTopic[topicId] = [];
      }
      groupedByTopic[topicId].push(comment);
    });
    
    console.log(`fetchCommentsThunk - 토픽별 그룹화 완료: ${Object.keys(groupedByTopic).length}개 토픽`);
    return groupedByTopic;
  }
);

// 토픽별 코멘트 조회
export const getCommentsByTopic = createAsyncThunk(
  'comments/getByTopic',
  async ({ topicId }: { topicId: number }, { rejectWithValue }) => {
    try {
      const data = await commentApi.fetchComments(topicId);
      return { topicId, items: data as CommentItem[] };
    } catch (err: any) {
      console.error('Comment API 호출 실패:', err);
      // 목업 데이터 반환 (공통 함수 사용)
      const allMockComments = generateMockComments();
      // 요청한 topicId에 맞는 코멘트만 필터링
      const filteredData = allMockComments.filter(item => item.topic_id === topicId);
      return { topicId, items: filteredData };
    }
  }
);


// 코멘트 작성
export const createCommentThunk = createAsyncThunk(
  'comments/create',
  async ({ topic_id, content }: { topic_id: number; content: string }, { rejectWithValue, getState }) => {
    try {
      const data = await commentApi.createCommentV2({ topic_id, content });
      return data as CommentItem;
    } catch (err: any) {
      // API가 없을 경우 목업 데이터로 대체
      console.warn('코멘트 작성 API 실패, 목업 데이터 사용:', err?.response?.data || err.message);
      
      const state = getState() as any;
      const authState = state.auth;
      const user = authState?.user;
      
      // 목업 코멘트 생성
      const mockComment: CommentItem = {
        comment_id: Date.now(), // 임시 ID
        topic_id,
        user_id: user?.id || 1,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        User: user ? { user_id: user.id, name: user.name || user.email || '사용자' } : { user_id: 1, name: '사용자' },
        likes: 0,
        replies: 0,
      };
      
      return mockComment;
    }
  }
);

// 코멘트 수정
export const updateCommentThunk = createAsyncThunk(
  'comments/update',
  async ({ comment_id, content }: { comment_id: number; content: string }, { rejectWithValue, getState }) => {
    try {
      const { comment } = await commentApi.updateCommentV2(comment_id, { content });
      return comment as CommentItem;
    } catch (err: any) {
      // API가 없을 경우 목업 데이터로 대체
      console.warn('코멘트 수정 API 실패, 목업 데이터 사용:', err?.response?.data || err.message);
      
      const state = getState() as any;
      const commentsState = state.comments;
      
      // 기존 코멘트 찾기
      let existingComment: CommentItem | undefined;
      for (const topicIdStr of Object.keys(commentsState.byTopicId || {})) {
        const bucket = commentsState.byTopicId[Number(topicIdStr)];
        const found = bucket?.items?.find((c: CommentItem) => c.comment_id === comment_id);
        if (found) {
          existingComment = found;
          break;
        }
      }
      
      if (existingComment) {
        // 기존 코멘트 내용만 업데이트
        return {
          ...existingComment,
          content,
          updated_at: new Date().toISOString(),
        } as CommentItem;
      }
      
      return rejectWithValue(err?.response?.data || { message: '코멘트 수정 실패' });
    }
  }
);

// 코멘트 삭제
export const deleteCommentThunk = createAsyncThunk(
  'comments/delete',
  async ({ comment_id }: { comment_id: number }, { rejectWithValue }) => {
    try {
      await commentApi.deleteCommentV2(comment_id);
      return { comment_id };
    } catch (err: any) {
      // API가 없을 경우에도 성공으로 처리 (목업 환경)
      console.warn('코멘트 삭제 API 실패, 로컬에서만 삭제:', err?.response?.data || err.message);
      return { comment_id };
    }
  }
);

// ===== Slice =====
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments(state, action: PayloadAction<{ topicId?: number } | undefined>) {
      const topicId = action.payload?.topicId;
      if (typeof topicId === 'number') delete state.byTopicId[topicId];
      else state.byTopicId = {};
    },
  },
  extraReducers: (builder) => {
    // 홈페이지 코멘트 조회
    builder
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        // 여러 토픽의 코멘트를 byTopicId에 저장
        const groupedByTopic = action.payload as Record<number, CommentItem[]>;
        Object.entries(groupedByTopic).forEach(([topicId, comments]) => {
          const topicIdNum = Number(topicId);
          state.byTopicId[topicIdNum] = {
            items: comments,
            loading: false,
            error: null,
          };
        });
        console.log('commentSlice - fetchCommentsThunk.fulfilled - 저장된 토픽 수:', Object.keys(groupedByTopic).length);
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        console.error('commentSlice - fetchCommentsThunk.rejected:', action.error);
      });

    // 토픽별 코멘트 조회
    builder
      .addCase(getCommentsByTopic.pending, (state, action) => {
        const { topicId } = action.meta.arg as { topicId: number };
        state.byTopicId[topicId] ??= { items: [], loading: false, error: null };
        state.byTopicId[topicId].loading = true;
        state.byTopicId[topicId].error = null;
      })
      .addCase(getCommentsByTopic.fulfilled, (state, action) => {
        const { topicId, items } = action.payload as { topicId: number; items: CommentItem[] };
        state.byTopicId[topicId] = { items, loading: false, error: null };
      })
      .addCase(getCommentsByTopic.rejected, (state, action) => {
        const { topicId } = action.meta.arg as { topicId: number };
        state.byTopicId[topicId] ??= { items: [], loading: false, error: null };
        state.byTopicId[topicId].loading = false;
        state.byTopicId[topicId].error = (action.payload as any)?.message || '코멘트 조회 실패';
      });

    // 코멘트 작성
    builder
      .addCase(createCommentThunk.pending, (state) => {
        state.creating = true;
        state.topicError = null;
      })
      .addCase(createCommentThunk.fulfilled, (state, action: PayloadAction<CommentItem>) => {
        state.creating = false;
        const item = action.payload;
        const tId = item.topic_id;
        state.byTopicId[tId] ??= { items: [], loading: false, error: null };
        state.byTopicId[tId].items.unshift(item); // 최신 우선
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.creating = false;
        state.topicError = (action.payload as any)?.message || '코멘트 작성 실패';
      });

    // 코멘트 수정
    builder
      .addCase(updateCommentThunk.pending, (state) => {
        state.updating = true;
        state.topicError = null;
      })
      .addCase(updateCommentThunk.fulfilled, (state, action: PayloadAction<CommentItem>) => {
        state.updating = false;
        const updated = action.payload;
        const tId = updated.topic_id;
        const list = state.byTopicId[tId]?.items;
        if (list) {
          const idx = list.findIndex((c) => c.comment_id === updated.comment_id);
          if (idx !== -1) list[idx] = { ...list[idx], ...updated };
        }
      })
      .addCase(updateCommentThunk.rejected, (state, action) => {
        state.updating = false;
        state.topicError = (action.payload as any)?.message || '코멘트 수정 실패';
      });

    // 코멘트 삭제
    builder
      .addCase(deleteCommentThunk.pending, (state) => {
        state.deleting = true;
        state.topicError = null;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action: PayloadAction<{ comment_id: number }>) => {
        state.deleting = false;
        const { comment_id } = action.payload;
        // 어떤 topicId인지 모를 수 있으므로 전체 스캔
        for (const tIdStr of Object.keys(state.byTopicId)) {
          const bucket = state.byTopicId[Number(tIdStr)];
          bucket.items = bucket.items.filter((c) => c.comment_id !== comment_id);
        }
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.deleting = false;
        state.topicError = (action.payload as any)?.message || '코멘트 삭제 실패';
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

// ===== Selectors =====
export type RootCommentsState = { comments: CommentState };
export const selectCommentsState = (s: RootCommentsState) => s.comments;
export const selectCommentsBucketByTopic = createSelector(
  [selectCommentsState, (_: RootCommentsState, topicId: number) => topicId],
  (comments, topicId): CommentBucket =>
    comments.byTopicId[topicId] || EMPTY_BUCKET
);
export const selectCommentsByTopic = (s: RootCommentsState, topicId: number) =>
  s.comments.byTopicId[topicId]?.items || [];
export const selectCommentsLoading = (s: RootCommentsState, topicId: number) =>
  s.comments.byTopicId[topicId]?.loading || false;
export const selectCommentsError = (s: RootCommentsState, topicId: number) =>
  s.comments.byTopicId[topicId]?.error || null;
// 홈페이지용: 모든 토픽의 코멘트를 합쳐서 반환
export const selectAllComments = (s: RootCommentsState): CommentItem[] => {
  const allComments: CommentItem[] = [];
  Object.values(s.comments.byTopicId).forEach((bucket) => {
    allComments.push(...bucket.items);
  });
  return allComments;
};

// 홈페이지용: 모든 토픽의 코멘트 로딩 상태 (하나라도 로딩 중이면 true)
export const selectAllCommentsLoading = (s: RootCommentsState): boolean => {
  return Object.values(s.comments.byTopicId).some((bucket) => bucket.loading);
};
