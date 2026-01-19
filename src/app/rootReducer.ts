// moovy-frontend/src/app/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'

// slices
import auth from '../features/auth/authSlice'
import ui from '../features/ui/uiSlice'
import comments from '../features/comments/commentSlice'
import replies from '../features/reply/replySlice'
import content from '@/features/content/contentSlice'
import rating from '@/features/rating/ratingSlice'
import topics from '@/features/topic/topicSlice'
import favorite from '@/features/favorite/favoriteSlice'
import like from '@/features/like/likeSlice' // ✅ 추가
import popular from '@/features/popular/popularSlice'

// admin
import adminUsers from '../features/admin/usersSlice'
import adminInquiry from '../features/admin/adminInquirySlice'
import adminReports from '../features/admin/adminReportsSlice'
import adminDashboard from '../features/admin/dashboardSlice'
import adminTopics from '../features/admin/topicsSlice'

const rootReducer = combineReducers({
   auth,
   ui,

   // user interactions
   comments,
   replies,
   rating,
   favorite,
   like, // ✅ 추가
   topics,
   content,
   popular,

   // admin
   adminUsers,
   adminInquiry,
   adminReports,
   adminDashboard,
   adminTopics,
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
