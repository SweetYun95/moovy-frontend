// moovy-frontend/src/app/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'

// slices
import auth from '../features/auth/authSlice'
import ui from '../features/ui/uiSlice'
import comments from '../features/reply/commentSlice'
import replies from '../features/reply/replySlice'
// import movies from '@/features/movies/moviesSlice'

const rootReducer = combineReducers({
   auth,
   ui,
   comments,
   replies,
   // movies,
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
