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
import popular from '@/features/popular/popularSlice' // ★ 추가

// admin
import adminUsers from '../features/admin/usersSlice'
import adminInquiry from '../features/admin/adminInquirySlice'
import adminReports from '../features/admin/adminReportsSlice'

const rootReducer = combineReducers({
   auth,
   ui,
   comments,
   replies,
   content,
   rating,
   topics,
   favorite,
   popular, // ★ 추가

   // admin
   adminUsers,
   adminInquiry,
   adminReports,
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
