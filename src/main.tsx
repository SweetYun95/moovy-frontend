// moovy-frontend/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { initGSAP } from "./utils/gsapSetup";
import { store } from "./app/store";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/globals.scss";

initGSAP();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
