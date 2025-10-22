import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import "@/lib/i18n.ts";
import Router from "./router.tsx";
import { BrowserRouter } from "react-router";
import { FullScreenLoader } from "./components/full-screen-loader.tsx";
import { ScrollToTop } from "./components/scroll-to-top.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoader />}>
        <ScrollToTop />
        <Router />
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
