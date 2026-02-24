export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  institution?: string | null;
  email: string;
  is_admin: boolean;
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
};

export type PaginatedUsers = {
  items: AuthUser[];
  total: number;
  page: number | null;
  per_page: number | null;
  pages: number | null;
};
