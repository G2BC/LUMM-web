import { API } from "@/api";
import { runWithSilencedApiErrors } from "@/api/error-silencer";
import type {
  AdminResetPasswordResponse,
  AuthTokens,
  AuthUser,
  ChangePasswordPayload,
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

export const getCurrentUser = async (opts?: { silent?: boolean }): Promise<AuthUser> => {
  const request = async () => {
    const response = await API.get<AuthUser>("/auth/me");
    return response.data;
  };

  if (opts?.silent) {
    return runWithSilencedApiErrors(request);
  }

  return request();
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<AuthTokens> => {
  const response = await API.post<AuthTokens>("/auth/change-password", payload);
  return response.data;
};

export const listUsers = async (params?: ListUsersParams): Promise<PaginatedUsers> => {
  const response = await API.get<PaginatedUsers>("/users", { params });
  return response.data;
};

export const activateUser = async (id: string): Promise<AuthUser> => {
  const response = await API.patch<AuthUser>(`/users/${id}/activate`);
  return response.data;
};

export const approveUser = async (id: string): Promise<AuthUser> => {
  const response = await API.patch<AuthUser>(`/users/${id}/approve`);
  return response.data;
};

export const deactivateUser = async (id: string): Promise<AuthUser> => {
  const response = await API.patch<AuthUser>(`/users/${id}/deactivate`);
  return response.data;
};

export const adminResetPassword = async (id: string): Promise<AdminResetPasswordResponse> => {
  const response = await API.post<AdminResetPasswordResponse>(`/users/${id}/reset-password`);
  return response.data;
};

export const updateUserAdminRole = async (id: string, isAdmin: boolean): Promise<AuthUser> => {
  const response = await API.patch<AuthUser>(`/users/${id}/admin`, { is_admin: isAdmin });
  return response.data;
};
