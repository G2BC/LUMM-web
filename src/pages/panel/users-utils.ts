import type { AuthUser, AuthUserRole } from "@/api/auth/types";

const ROLE_ORDER: AuthUserRole[] = ["researcher", "curator", "admin"];

export function resolveUserRole(user: Pick<AuthUser, "role">): AuthUserRole {
  const normalizedRole = String(user.role ?? "").toLowerCase();
  if (ROLE_ORDER.includes(normalizedRole as AuthUserRole)) {
    return normalizedRole as AuthUserRole;
  }

  return "researcher";
}

export function getRoleBadgeClass(role: AuthUserRole): string {
  if (role === "admin") return "bg-sky-100 text-sky-800 hover:bg-sky-100";
  if (role === "curator") return "bg-amber-100 text-amber-800 hover:bg-amber-100";
  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
}
