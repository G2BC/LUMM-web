import { refreshAccessToken } from "@/api/auth";
import { API } from "@/api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let initialized = false;
let refreshPromise: Promise<string> | null = null;

async function getFreshAccessToken(refreshToken: string) {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const tokens = await refreshAccessToken(refreshToken);

      useAuthStore.getState().setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? refreshToken,
      });

      return tokens.access_token;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export function registerAuthInterceptor() {
  if (initialized) return;

  API.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  API.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const config = error.config as RetryableConfig | undefined;

      if (!config) return Promise.reject(error);

      const skipRefresh = Boolean(config.headers?.["X-Skip-Auth-Refresh"]);

      if (status !== 401 || config._retry || skipRefresh) {
        return Promise.reject(error);
      }

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().clearSession();
        return Promise.reject(error);
      }

      config._retry = true;

      try {
        const newAccessToken = await getFreshAccessToken(refreshToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(config);
      } catch {
        useAuthStore.getState().clearSession();
        return Promise.reject(error);
      }
    }
  );

  initialized = true;
}
