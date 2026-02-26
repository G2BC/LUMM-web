import type { AuthUser } from "@/api/auth/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SessionPayload = {
  accessToken?: string;
  refreshToken?: string | null;
  mustChangePassword?: boolean;
  user?: AuthUser | null;
};

type AuthState = {
  initialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  mustChangePassword: boolean;
  user: AuthUser | null;
  setInitialized: (_initialized: boolean) => void;
  setSession: (_payload: SessionPayload) => void;
  setUser: (_user: AuthUser | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      initialized: false,
      accessToken: null,
      refreshToken: null,
      mustChangePassword: false,
      user: null,
      setInitialized: (initialized) => set({ initialized }),
      setSession: ({ accessToken, refreshToken, mustChangePassword, user }) =>
        set((state) => ({
          accessToken: accessToken ?? state.accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
          mustChangePassword: mustChangePassword ?? state.mustChangePassword,
          user: user ?? state.user,
        })),
      setUser: (user) => set({ user, mustChangePassword: user?.must_change_password ?? false }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          mustChangePassword: false,
          user: null,
        }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        mustChangePassword: state.mustChangePassword,
        user: state.user,
      }),
    }
  )
);
