import { Suspense, useEffect } from "react";
import { Header } from "./header";
import { Outlet } from "react-router";
import { FullScreenLoader } from "./full-screen-loader";
import { Footer } from "./footer";

export function BaseLayout() {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => document.body.classList.remove("dark");
  }, []);

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <main className="dark flex flex-col h-full min-h-screen overflow-x-hidden">
        <Header />
        <div className="flex-1 bg-[#0D140E]">
          <Outlet />
        </div>
        <Footer />
      </main>
    </Suspense>
  );
}
