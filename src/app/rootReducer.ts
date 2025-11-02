// moovy-frontend/src/app/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";

// slices
import auth from "../features/auth/authSlice";
import ui from "../features/ui/uiSlice";
import comments from "../features/reply/commentSlice"; // 신규 댓글 CRUD
import replies from "../features/reply/replySlice"; // 대댓글 CRUD
import commentCards from "../features/comments/commentCardsSlice"; // 홈 카드용
import contents from "../features/content/contentSlice";

// admin
import adminUsers from "../features/admin/usersSlice"; 

const rootReducer = combineReducers({
  auth,
  ui,
  contents,
  comments, // 신규 CRUD
  replies, // 대댓글
  commentCards, // 홈 카드
  
  // admin
  adminUsers,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
