// moovy-frontend/src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

// devTools: Vite에서는 DEV 플래그가 가장 간단
export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV, // 또는 import.meta.env.MODE !== 'production'
});

// 타입 유틸 (hooks에서 사용)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
