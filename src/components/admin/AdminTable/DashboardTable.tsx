import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './DashboardTable.scss'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { getAdminDashboard } from '@/features/admin/dashboardSlice'

const DashboardTable: React.FC = () => {
   const dispatch = useAppDispatch()
   const { data, loading, error } = useAppSelector((s) => s.adminDashboard)

   // 최초 1회 로드
   React.useEffect(() => {
      dispatch(getAdminDashboard({ topN: 9 }))
   }, [dispatch])

   // usersMonthly → recharts용 data (month, thisYear, lastYear 그대로 사용 가능)
   const userData = data?.usersMonthly ?? []

   // topCommented / topViewed → recharts용 dataKey 맞추기
   const commentData =
      data?.topCommented?.map((x) => ({
         movie: x.label,
         comments: x.value,
      })) ?? []

   const viewData =
      data?.topViewed?.map((x) => ({
         movie: x.label,
         views: x.value,
      })) ?? []

   const formatYAxis = (tickItem: number) => `${tickItem / 1000}K`

   // 로딩/에러 UI (간단 버전)
   if (loading) {
      return (
         <div className="dashboard-charts">
            <div className="admin-content">
               <div className="dashboard-chart dashboard-chart--full">
                  <h3 className="dashboard-chart__title">대시보드 로딩 중...</h3>
               </div>
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="dashboard-charts">
            <div className="admin-content">
               <div className="dashboard-chart dashboard-chart--full">
                  <h3 className="dashboard-chart__title">대시보드 로드 실패</h3>
                  <p style={{ padding: '12px 0' }}>{error}</p>
                  <button onClick={() => dispatch(getAdminDashboard({ topN: 9 }))}>재시도</button>
               </div>
            </div>
         </div>
      )
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
                     <YAxis tickFormatter={formatYAxis} stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} width={60} />
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
                        <YAxis tickFormatter={formatYAxis} stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} width={60} />
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
                        <YAxis tickFormatter={formatYAxis} stroke="#a1a1a1" tick={{ fill: '#a1a1a1', fontSize: 14 }} axisLine={{ stroke: '#a1a1a1' }} width={60} />
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
