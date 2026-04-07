import { getCurrentUser, refreshAccessToken } from "@/api/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AxiosError } from "axios";

let bootstrapPromise: Promise<void> | null = null;

// Structured field returned by the API (preferred signal).
// Fallback: match the error message in any language for older API versions that
// return a plain { message } instead of { must_change_password: true }.
// TODO: remove the text fallback once all environments return the structured field.
type PasswordChangeErrorData = {
  must_change_password?: boolean;
  message_pt?: string;
  message_en?: string;
};

function isPasswordChangeRequiredError(error: unknown) {
  const err = error as AxiosError<PasswordChangeErrorData>;
  if (err.response?.status !== 403) return false;

  const data = err.response.data;
  return data?.must_change_password === true;
}

async function tryRefresh(refreshToken: string) {
  const tokens = await refreshAccessToken(refreshToken);

  useAuthStore.getState().setSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? refreshToken,
    mustChangePassword: tokens.must_change_password,
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

    if (hasToken && authState.mustChangePassword) {
      authState.setInitialized(true);
      return;
    }

    try {
      if (!hasToken && authState.refreshToken) {
        await tryRefresh(authState.refreshToken);
      }

      const user = await getCurrentUser({ silent: true });
      useAuthStore.getState().setUser(user);
    } catch (error) {
      if (isPasswordChangeRequiredError(error)) {
        useAuthStore.getState().setSession({
          mustChangePassword: true,
        });
        return;
      }

      const currentRefreshToken = useAuthStore.getState().refreshToken;

      if (currentRefreshToken) {
        try {
          await tryRefresh(currentRefreshToken);
          const user = await getCurrentUser({ silent: true });
          useAuthStore.getState().setUser(user);
        } catch (refreshError) {
          if (isPasswordChangeRequiredError(refreshError)) {
            useAuthStore.getState().setSession({
              mustChangePassword: true,
            });
            return;
          }

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
