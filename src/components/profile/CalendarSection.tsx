// src/components/profile/CalendarSection.tsx

import React from "react";

export const CalendarSection: React.FC = () => {
  return (
    <div className="row mt-5">
      <div className="col-md-6"> 달력 컴포넌트 </div>
      <div className="col-md-6" style={{ display: "flex" }}>
        {/* map */}x<div className="col-md-4">영화 카드</div>
        <div className="col-md-4">영화 카드</div>
        <div className="col-md-4">영화 카드</div>
      </div>
    </div>
  );
};
