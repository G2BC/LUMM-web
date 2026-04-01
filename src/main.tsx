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
import { RouteAwareThemeColor } from "./components/route-aware-theme-color.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap>
          <Suspense fallback={<RouteAwareLoader />}>
            <ScrollToTop />
            <RouteAwareThemeColor />
            <Router />
          </Suspense>
        </AuthBootstrap>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
