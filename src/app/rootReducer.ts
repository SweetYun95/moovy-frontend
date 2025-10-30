import { combineReducers } from "@reduxjs/toolkit";

// slices
import auth from "@/features/auth/authSlice";
import ui from "@/features/ui/uiSlice";
import content from "@/features/content/contentSlice";
import comment from "@/features/comments/commentSlice";

const rootReducer = combineReducers({
  auth,
  ui,
  content,
  comment,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
