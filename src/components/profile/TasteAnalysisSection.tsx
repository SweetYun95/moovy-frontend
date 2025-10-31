// src/components/profile/TasteAnalysisSection.tsx
export const TasteAnalysisSection: React.FC = () => (
  <div className="mt-5 taste">
    <div className="row rating-graph">
      <h6> 나의 별점 그래프 </h6>
      <div className="mt-4">그래프 컴포넌트</div>
    </div>
    <div className="row mt-4 under">
      <div className="col-md-7 taste-graph">
        <div>
          <h6>나의 취향 그래프</h6>
        </div>
      </div>
      <div className="col-md-5 taste-analysis">
        <div>
          <div>말풍선</div>
          <h6>5점 뿌리는 ‘부처님 급’아량의 소유자</h6>
          <div>이미지</div>
        </div>
      </div>
    </div>
  </div>
);
