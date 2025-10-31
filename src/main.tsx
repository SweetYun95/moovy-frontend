// moovy-frontend/src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { initGSAP } from "./utils/gsapSetup";
import { store } from "./app/store";
import App from "./App";
import TestApp from "./TestApp";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/globals.scss";
import AuthPage from "./pages/auth/AuthPage";
import UserMainPage from "./pages/Home/UserMainPage";
import MovieDetailPage from "./pages/movies/MovieDetailPage";
import MyPage from "./pages/profile/MyPage";

initGSAP();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TestApp />
        {/* <AuthPage /> */}
        {/* <UserMainPage /> */}
        {/* <MovieDetailPage /> */}
        {/* <MyPage /> */}
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
