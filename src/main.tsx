import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Info from "./routes/Info";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import Settings from "./routes/Settings";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<App />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route
              path="info"
              element={<Info />}
            />
            <Route
              path="settings"
              element={<Settings />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  </React.StrictMode>
);
