import './bootstrap';

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CinemaProvider } from "./context/CinemaContext";
import './index.css';
import './app.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CinemaProvider>
      <RouterProvider router={router} />
    </CinemaProvider>
  </React.StrictMode>
);