// src/components/profile/TasteAnalysisSection.tsx
import { useMemo } from "react";
import { useAppSelector } from "@/app/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const TasteAnalysisSection: React.FC = () => {
  // rating slice에서 사용자가 평가한 모든 컨텐츠 가져오기
  const ratingState = useAppSelector((state) => state.rating.byContentId);
  const contents = useAppSelector((state) => state.content.contents);

  // 사용자가 평가한 컨텐츠 필터링
  const userRatings = useMemo(() => {
    return Object.values(ratingState)
      .filter((bucket) => bucket.myPoint !== null && bucket.myPoint !== undefined)
      .map((bucket) => bucket.myPoint!);
  }, [ratingState]);

  // 통계 계산
  const ratingStats = useMemo(() => {
    if (userRatings.length === 0) {
      return {
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        personality: "평가 내역이 없습니다.",
      };
    }

    const total = userRatings.length;
    const average = userRatings.reduce((sum, r) => sum + r, 0) / total;
    const distribution = userRatings.reduce(
      (acc, rating) => {
        const key = Math.round(rating) as 1 | 2 | 3 | 4 | 5;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    // 평균 별점에 따른 성격 분석
    let personality = "";
    if (average >= 4.5) {
      personality = "5점 뿌리는 '부처님 급' 아량의 소유자";
    } else if (average >= 4.0) {
      personality = "긍정적인 '옵티미스트' 영화 애호가";
    } else if (average >= 3.5) {
      personality = "균형잡힌 '미들러' 감상자";
    } else if (average >= 3.0) {
      personality = "엄격한 '크리틱' 비평가";
    } else {
      personality = "까다로운 '퍼펙셔니스트' 감상자";
    }

    return { total, average, distribution, personality };
  }, [userRatings]);

  // 별점 그래프 데이터 (1.0~5.0, 0.5 단위)
  const ratingChartData = useMemo(() => {
    // 데이터가 없을 때 목업 데이터 사용
    if (ratingStats.total === 0) {
      return [
        { rating: "1.0", count: 50 },
        { rating: "1.5", count: 30 },
        { rating: "2.0", count: 100 },
        { rating: "2.5", count: 80 },
        { rating: "3.0", count: 150 },
        { rating: "3.5", count: 120 },
        { rating: "4.0", count: 200 },
        { rating: "4.5", count: 180 },
        { rating: "5.0", count: 250 },
      ];
    }
    
    const data = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((rating) => {
      // 실제 데이터가 정수이므로, 0.5 단위로 근사치 계산
      const count = userRatings.filter((r: number) => {
        const rounded = Math.round(r * 2) / 2;
        return Math.abs(rounded - rating) < 0.1;
      }).length;
      
      return {
        rating: rating.toFixed(1),
        count: count,
      };
    });
    
    return data;
  }, [ratingStats.total, userRatings]);

  // 취향 그래프 데이터 (도넛 차트용)
  const tasteData = [
    { name: "로맨스", value: 52.1, color: "#7b61ff" },
    { name: "판타지", value: 22.8, color: "#ff3c67" },
    { name: "호러", value: 13.9, color: "#00aeef" },
    { name: "드라마", value: 11.2, color: "#00c896" },
  ];

  const COLORS = ["#7b61ff", "#ff3c67", "#00aeef", "#00c896"];

  return (
    <section className="mt-5 mb-5">
      <div className="row mb-3">
        {/* 나의 별점 그래프 */}
        <div className="col-12">
          <div className="taste rating-graph">
            <h6>나의 별점그래프</h6>
            <div className="mt-4">
              {ratingChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={ratingChartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis 
                      type="number" 
                      domain={[0, 500]} 
                      tickCount={11}
                      tick={{ fill: "#3a3a3a", fontSize: 14 }}
                      stroke="#3a3a3a"
                    />
                    <YAxis
                      type="category"
                      dataKey="rating"
                      tick={{ fill: "#3a3a3a", fontSize: 14 }}
                      width={40}
                      stroke="#3a3a3a"
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      radius={[0, 4, 4, 0]}
                    >
                      {ratingChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index % 2 === 0 ? "#7b61ff" : "#ff3c67"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted">차트 데이터를 준비 중입니다...</p>
              )}
            </div>
          </div>
        </div>
        </div>

        <div className="row">
        {/* 나의 취향 그래프 */}
        <div className="col-12 col-md-6 mb-3 mb-md-0 d-flex">
          <div className="taste-graph w-100">
            <h6>나의 취향 그래프</h6>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasteData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tasteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    formatter={(value: string, entry: any) => `${value}: ${entry.payload.value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 별점 분포 */}
        <div className="col-12 col-md-6 d-flex">
          <div className="taste-analysis w-100">
            <span className="taste-analysis__tag">#별점 분포</span>
            <div className="taste-analysis__text mt-3">
              {ratingStats.personality}
            </div>
            <div className="taste-analysis__image mt-3">
              {/* 부처님 일러스트는 나중에 이미지로 교체 가능 */}
              <div className="taste-analysis__buddha">🧘</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
