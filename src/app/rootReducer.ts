import { combineReducers } from "@reduxjs/toolkit";

// slices
import auth from "@/features/auth/authSlice";
import ui from "@/features/ui/uiSlice";

// 필요 시 여기에 계속 추가
// import movies from '@/features/movies/moviesSlice'

const rootReducer = combineReducers({
  auth,
  ui,
  // movies,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
