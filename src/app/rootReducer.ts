// moovy-frontend/src/app/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";

// slices
import auth from "../features/auth/authSlice";
import ui from "../features/ui/uiSlice";
import comments from "../features/comments/commentSlice";
import replies from "../features/reply/replySlice";
import content from "@/features/content/contentSlice";
import rating from "@/features/rating/ratingSlice";

// admin
import adminUsers from "../features/admin/usersSlice";

const rootReducer = combineReducers({
  auth,
  ui,
  comments,
  replies,
  content,
  rating,

  // admin
  adminUsers,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
