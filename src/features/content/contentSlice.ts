//컨텐츠(토픽) 전용 슬라이스
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getTopics, type Topic as ContentCardType } from '@/services/api/topicApi';
import { getCommentCards } from '@/services/api/commentApi';

export type ContentState = {
  loading: boolean;
  contents: ContentCardType[];
  error?: string | null;
}

const initialState: ContentState = {
  loading: false,
  contents: [],
  error: null,
}

export const fetchContentsThunk = createAsyncThunk(
  'content/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const topicsList = await getTopics();
      const data = topicsList.list;
      
      // 코멘트 데이터를 가져와서 overallRating 계산
      try {
        const comments = await getCommentCards();
        
        // 각 컨텐츠의 overallRating을 코멘트 평균으로 계산
        const contentsWithRating = data.map(content => {
          const relatedComments = comments.filter(c => c.contentId === content.id);
          
          if (relatedComments.length === 0) {
            return { ...content, overallRating: 0 };  // 코멘트가 없으면 0
          }
          
          const avgRating = relatedComments.reduce((sum, c) => sum + c.rating, 0) / relatedComments.length;
          return { ...content, overallRating: Number(avgRating.toFixed(1)) };
        });
        
        return contentsWithRating;
      } catch (commentError) {
        // 코멘트 API 실패해도 컨텐츠는 반환
        console.warn('Comment API 호출 실패 (overallRating 계산 스킵):', commentError);
        return data;
      }
    } catch (error) {
      console.error('Content API 호출 실패:', error);
      const tempData: ContentCardType[] = [
        {
          id: 1,
          title: '다 이루어질 지니',
          images: ['https://picsum.photos/900/1600?random=1'],
          runtime: '120분',
          ageRating: '15',
          releaseDate: '2025-01-15',
          year: '2025',
          category: '영화',
          country: '한국',
          genre: '액션',
          synopsis: '케이팝 슈퍼스타 루미, 미라, 조이. 매진을 기록하는 대형 스타디움 공연이 없을 때면 이들은 또 다른 활동에 나선다. 바로 비밀 능력을 이용해 팬들을 초자연적 위협으로부터 보호하는 것.',
          overallRating: 4.5,
          imageUrl: 'https://picsum.photos/900/1600?random=1',
          createdAt: '2024-12-01',
          updatedAt: '2024-12-01',
        },
        {
          id: 2,
          title: '사마귀',
          images: ['https://picsum.photos/300/400?random=2'],
          runtime: '110분',
          ageRating: '15',
          releaseDate: '2025-02-01',
          year: '2025',
          category: '영화',
          country: '한국',
          genre: '액션',
          synopsis: '2025년 대한민국, 더 화끈하게! 액션과 스릴이 가득한 새로운 영화가 등장한다. 예측 불가능한 스토리와 강렬한 액션으로 관객들을 사로잡을 것이다.',
          overallRating: 4.0,
          imageUrl: 'https://picsum.photos/300/400?random=2',
          createdAt: '2024-12-01',
          updatedAt: '2024-12-01',
        },
        {
          id: 3,
          title: '야당',
          images: ['https://picsum.photos/300/400?random=3'],
          runtime: '60분',
          ageRating: '15',
          releaseDate: '2024-03-01',
          year: '2024',
          category: '드라마',
          country: '한국',
          genre: '정치',
          synopsis: '정치적 갈등과 권력의 암투가 펼쳐지는 드라마. 현실적인 정치 상황을 그려내며 시청자들에게 깊은 여운을 남기는 작품이다.',
          overallRating: 4.8,
          imageUrl: 'https://picsum.photos/300/400?random=3',
          createdAt: '2024-02-01',
          updatedAt: '2024-02-01',
        },
        {
          id: 4,
          title: '토르: 천둥의 신',
          images: ['https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg'],
          runtime: '115분',
          ageRating: '12',
          releaseDate: '2004-05-01',
          year: '2004',
          category: '영화',
          country: '미국',
          genre: '판타지',
          synopsis: '아스가르드의 천둥의 신 토르가 지구로 추방되어 인간 세계에서 신으로서의 긍지와 능력을 다시 찾아가는 과정을 그린 판타지 액션.',
          overallRating: 4.0,
          imageUrl: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
          createdAt: '2004-04-01',
          updatedAt: '2004-04-01',
        },
        {
          id: 5,
          title: '인터스텔라',
          images: ['https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'],
          runtime: '169분',
          ageRating: '12',
          releaseDate: '2014-11-06',
          year: '2014',
          category: '영화',
          country: '미국',
          genre: 'SF',
          synopsis: '지구가 위기에 처한 가운데, 우주를 탐험하는 과학자 팀이 새로운 행성을 찾아 인류를 구하기 위한 모험을 떠나는 SF 드라마.',
          overallRating: 4.7,
          imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
          createdAt: '2014-10-01',
          updatedAt: '2014-10-01',
        },
        {
          id: 6,
          title: '다크 나이트',
          images: ['https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'],
          runtime: '152분',
          ageRating: '15',
          releaseDate: '2008-07-18',
          year: '2008',
          category: '영화',
          country: '미국',
          genre: '액션',
          synopsis: '배트맨이 조커의 완전한 무정부주의적 테러에 맞서 고담시티를 지키기 위한 치열한 싸움을 펼치는 슈퍼히어로 액션.',
          overallRating: 4.9,
          imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          createdAt: '2008-06-01',
          updatedAt: '2008-06-01',
        },
        {
          id: 7,
          title: '인셉션',
          images: ['https://picsum.photos/300/400?random=101'],
          runtime: '148분',
          ageRating: '12',
          releaseDate: '2010-07-22',
          year: '2010',
          category: '영화',
          country: '미국',
          genre: 'SF',
          synopsis: '꿈 속의 꿈 속으로 들어가 상대의 무의식에 아이디어를 심는 기술, 인셉션을 다룬 미래적 SF 스릴러 영화.',
          overallRating: 4.6,
          imageUrl: 'https://picsum.photos/300/400?random=101',
          createdAt: '2010-06-01',
          updatedAt: '2010-06-01',
        },
        {
          id: 8,
          title: '어벤져스',
          images: ['https://picsum.photos/300/400?random=102'],
          runtime: '143분',
          ageRating: '12',
          releaseDate: '2012-05-04',
          year: '2012',
          category: '영화',
          country: '미국',
          genre: '액션',
          synopsis: '아이언맨, 토르, 헐크, 캡틴 아메리카 등의 히어로들이 뭉쳐 세계를 구하기 위해 맞서는 역대급 액션 블록버스터.',
          overallRating: 4.0,
          imageUrl: 'https://picsum.photos/300/400?random=102',
          createdAt: '2012-04-01',
          updatedAt: '2012-04-01',
        },
        {
          id: 9,
          title: '기생충',
          images: ['https://picsum.photos/300/400?random=103'],
          runtime: '132분',
          ageRating: '15',
          releaseDate: '2019-05-30',
          year: '2019',
          category: '영화',
          country: '한국',
          genre: '스릴러',
          synopsis: '반지하 주택에 살던 기택 가족이 상류층 박 사장 집에 취업하며 벌어지는 계급 간 갈등을 담은 블랙코미디 스릴러.',
          overallRating: 4.8,
          imageUrl: 'https://picsum.photos/300/400?random=103',
          createdAt: '2019-05-01',
          updatedAt: '2019-05-01',
        },
        {
          id: 10,
          title: '타이타닉',
          images: ['https://picsum.photos/300/400?random=104'],
          runtime: '194분',
          ageRating: '12',
          releaseDate: '1997-12-19',
          year: '1997',
          category: '영화',
          country: '미국',
          genre: '로맨스',
          synopsis: '1912년 타이타닉 호에서 만난 상류층 레이디 로즈와 하층민 출신 잭의 금지된 사랑을 그린 로맨스 재난 영화.',
          overallRating: 4.4,
          imageUrl: 'https://picsum.photos/300/400?random=104',
          createdAt: '1997-11-01',
          updatedAt: '1997-11-01',
        },
        {
          id: 11,
          title: '겨울왕국',
          images: ['https://picsum.photos/300/400?random=105'],
          runtime: '102분',
          ageRating: 'all',
          releaseDate: '2013-11-27',
          year: '2013',
          category: '애니메이션',
          country: '미국',
          genre: '판타지',
          synopsis: '마법의 얼음 힘을 가진 엘사의 실수로 왕국이 겨울에 얼어붙자, 여동생 안나와 함께 왕국을 구하기 위해 떠나는 모험 이야기.',
          overallRating: 4.5,
          imageUrl: 'https://picsum.photos/300/400?random=105',
          createdAt: '2013-10-01',
          updatedAt: '2013-10-01',
        },
      ];
      return tempData;
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentsThunk.fulfilled, (state, action: PayloadAction<ContentCardType[]>) => {
        state.loading = false;
        state.contents = action.payload;
      })
      .addCase(fetchContentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contents';
        if (action.payload) {
          state.contents = action.payload as ContentCardType[];
        }
      });
  },
});

export default contentSlice.reducer;

