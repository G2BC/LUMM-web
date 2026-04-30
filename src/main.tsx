import { StrictMode, Suspense, lazy } from "react";
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
import { queryClient } from "@/lib/query-client";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

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
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  </StrictMode>
);
