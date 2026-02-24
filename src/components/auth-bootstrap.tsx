import { bootstrapAuthSession } from "@/auth/bootstrap";
import { RouteAwareLoader } from "@/components/route-aware-loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AuthBootstrap({ children }: Props) {
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    void bootstrapAuthSession();
  }, []);

  if (!initialized) {
    return <RouteAwareLoader />;
  }

  return <>{children}</>;
}
