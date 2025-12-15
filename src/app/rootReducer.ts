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
import testAuth from '@/features/auth/test_authSlice'

// admin
import adminUsers from '../features/admin/usersSlice'

// test
import test from '@/features/auth/test_authSlice'

const rootReducer = combineReducers({
   auth,
   testAuth,
   ui,
   comments,
   replies,
   content,
   rating,
   topics,
   favorite,

   // admin
   adminUsers,

   //test
   test,
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
