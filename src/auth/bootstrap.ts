import { getCurrentUser, refreshAccessToken } from "@/api/auth";
import { useAuthStore } from "@/stores/useAuthStore";

let bootstrapPromise: Promise<void> | null = null;

async function tryRefresh(refreshToken: string) {
  const tokens = await refreshAccessToken(refreshToken);

  useAuthStore.getState().setSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? refreshToken,
  });
}

export function bootstrapAuthSession() {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const authState = useAuthStore.getState();

    if (authState.initialized) return;

    const hasToken = Boolean(authState.accessToken);
    const hasRefreshToken = Boolean(authState.refreshToken);

    if (!hasToken && !hasRefreshToken) {
      authState.setInitialized(true);
      return;
    }

    try {
      if (!hasToken && authState.refreshToken) {
        await tryRefresh(authState.refreshToken);
      }

      const user = await getCurrentUser();
      useAuthStore.getState().setUser(user);
    } catch {
      const currentRefreshToken = useAuthStore.getState().refreshToken;

      if (currentRefreshToken) {
        try {
          await tryRefresh(currentRefreshToken);
          const user = await getCurrentUser();
          useAuthStore.getState().setUser(user);
        } catch {
          useAuthStore.getState().clearSession();
        }
      } else {
        useAuthStore.getState().clearSession();
      }
    } finally {
      useAuthStore.getState().setInitialized(true);
    }
  })().finally(() => {
    bootstrapPromise = null;
  });

  return bootstrapPromise;
}
