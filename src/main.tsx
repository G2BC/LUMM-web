import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import "@/lib/i18n.ts";
import "@/api/setup-interceptors";
import Router from "./router.tsx";
import { BrowserRouter } from "react-router";
import { ScrollToTop } from "./components/scroll-to-top.tsx";
import { AuthBootstrap } from "./components/auth-bootstrap.tsx";
import { RouteAwareLoader } from "./components/route-aware-loader.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthBootstrap>
        <Suspense fallback={<RouteAwareLoader />}>
          <ScrollToTop />
          <Router />
        </Suspense>
      </AuthBootstrap>
    </BrowserRouter>
  </StrictMode>
);
