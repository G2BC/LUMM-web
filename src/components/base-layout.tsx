import { Suspense } from "react";
import { Header } from "./header";
import { Outlet } from "react-router";
import { FullScreenLoader } from "./full-screen-loader";

export function BaseLayout() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <main>
        <Header />
        <Outlet />
      </main>
    </Suspense>
  );
}
