import type React from "react";
import { Header } from "./header";

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      <div>{children}</div>
    </main>
  );
}
