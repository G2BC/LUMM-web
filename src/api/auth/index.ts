import { API } from "@/api";
import type {
  AuthTokens,
  AuthUser,
  ListUsersParams,
  LoginPayload,
  PaginatedUsers,
  RegisterPayload,
} from "./types";

export const login = async (payload: LoginPayload): Promise<AuthTokens> => {
  const response = await API.post<AuthTokens>("/auth/login", payload);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthUser> => {
  const response = await API.post<AuthUser>("/users", payload);
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await API.post<AuthTokens>(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "X-Skip-Auth-Refresh": "true",
      },
    }
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await API.get<AuthUser>("/auth/me");
  return response.data;
};

export const listUsers = async (params?: ListUsersParams): Promise<PaginatedUsers> => {
  const response = await API.get<PaginatedUsers>("/users", { params });
  return response.data;
};
