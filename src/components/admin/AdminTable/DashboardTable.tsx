// moovy-frontend/src/components/admin/AdminTable/DashboardTable.tsx
import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './DashboardTable.scss'

const DashboardTable: React.FC = () => {
   // 총 사용자 수 데이터 (1월~7월)
   const userData = [
      { month: '1월', thisYear: 10000, lastYear: 5000 },
      { month: '2월', thisYear: 8000, lastYear: 7000 },
      { month: '3월', thisYear: 12000, lastYear: 12000 },
      { month: '4월', thisYear: 22000, lastYear: 5000 },
      { month: '5월', thisYear: 10000, lastYear: 18000 },
      { month: '6월', thisYear: 15000, lastYear: 12000 },
      { month: '7월', thisYear: 20000, lastYear: 10000 },
   ]

   // 총 코멘트 수 데이터 (영화 1~9)
   const commentData = [
      { movie: '영화 1', comments: 28000 },
      { movie: '영화 2', comments: 20000 },
      { movie: '영화 3', comments: 15000 },
      { movie: '영화 4', comments: 29000 },
      { movie: '영화 5', comments: 18000 },
      { movie: '영화 6', comments: 12000 },
      { movie: '영화 7', comments: 10000 },
      { movie: '영화 8', comments: 30000 },
      { movie: '영화 9', comments: 14000 },
   ]

   // 총 조회수 데이터 (영화 1~9)
   const viewData = [
      { movie: '영화 1', views: 28000 },
      { movie: '영화 2', views: 20000 },
      { movie: '영화 3', views: 15000 },
      { movie: '영화 4', views: 29000 },
      { movie: '영화 5', views: 18000 },
      { movie: '영화 6', views: 12000 },
      { movie: '영화 7', views: 10000 },
      { movie: '영화 8', views: 30000 },
      { movie: '영화 9', views: 14000 },
   ]

   // Y축 포맷터 (K 단위로 표시)
   const formatYAxis = (tickItem: number) => {
      return `${tickItem / 1000}K`
   }

   return (
      <div className="dashboard-charts">
         <div className="admin-content">
            {/* 총 사용자 수 차트 */}
            <div className="dashboard-chart dashboard-chart--full">
               <h3 className="dashboard-chart__title">총 사용자 수</h3>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                     <XAxis dataKey="month" stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} />
                     <YAxis domain={[0, 30000]} tickFormatter={formatYAxis} stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} width={60} />
                     <Tooltip
                        formatter={(value: number | undefined) => (value ? value.toLocaleString() : '')}
                        labelStyle={{ color: '#3a3a3a', fontWeight: 700 }}
                        contentStyle={{
                           backgroundColor: '#fff',
                           border: '1px solid #f5f5f5',
                           borderRadius: '8px',
                           padding: '8px 12px',
                        }}
                     />
                     <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" formatter={(value) => <span style={{ color: '#3a3a3a', fontSize: '14px' }}>{value}</span>} />
                     <Line type="monotone" dataKey="thisYear" stroke="#000000" strokeWidth={2} name="This year" dot={{ r: 4, fill: '#000000' }} activeDot={{ r: 6 }} />
                     <Line type="monotone" dataKey="lastYear" stroke="#ff4c4c" strokeWidth={2} strokeDasharray="5 5" name="Last year" dot={{ r: 4, fill: '#ff4c4c' }} activeDot={{ r: 6 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>

            {/* 하단 차트들 */}
            <div className="dashboard-charts__bottom">
               {/* 총 코멘트 수 차트 */}
               <div className="dashboard-chart dashboard-chart--half">
                  <h3 className="dashboard-chart__title">총 코멘트 수</h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={commentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                        <XAxis dataKey="movie" stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} />
                        <YAxis domain={[0, 30000]} tickFormatter={formatYAxis} stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} width={60} />
                        <Tooltip
                           formatter={(value: number | undefined) => (value ? value.toLocaleString() : '')}
                           labelStyle={{ color: '#3a3a3a', fontWeight: 700 }}
                           contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #f5f5f5',
                              borderRadius: '8px',
                              padding: '8px 12px',
                           }}
                        />
                        <Bar dataKey="comments" fill="#7b61ff" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>

               {/* 총 조회수 차트 */}
               <div className="dashboard-chart dashboard-chart--half">
                  <h3 className="dashboard-chart__title">총 조회수</h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={viewData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                        <XAxis dataKey="movie" stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} />
                        <YAxis domain={[0, 30000]} tickFormatter={formatYAxis} stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} width={60} />
                        <Tooltip
                           formatter={(value: number | undefined) => (value ? value.toLocaleString() : '')}
                           labelStyle={{ color: '#3a3a3a', fontWeight: 700 }}
                           contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #f5f5f5',
                              borderRadius: '8px',
                              padding: '8px 12px',
                           }}
                        />
                        <Bar dataKey="views" fill="#7b61ff" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
   )
}

export default DashboardTable
