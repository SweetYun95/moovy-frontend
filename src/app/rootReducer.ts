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
import popular from '@/features/popular/popularSlice'

// admin
import adminUsers from '../features/admin/usersSlice'
import adminDashboard from '../features/admin/dashboardSlice' // ✅ 추가

const rootReducer = combineReducers({
   auth,
   ui,
   comments,
   replies,
   content,
   rating,
   topics,
   favorite,
   popular,

   // admin
   adminUsers,
   adminDashboard, // ✅ 추가
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
