export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  must_change_password?: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  institution?: string | null;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  institution?: string;
};

export type ListUsersParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
};

export type PaginatedUsers = {
  items: AuthUser[];
  total: number;
  page: number | null;
  per_page: number | null;
  pages: number | null;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export type AdminResetPasswordResponse = {
  user_id: string;
  temporary_password: string;
  must_change_password: boolean;
};
