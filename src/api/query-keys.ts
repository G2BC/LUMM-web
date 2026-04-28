export const speciesKeys = {
  all: ["species"] as const,
  lists: () => [...speciesKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...speciesKeys.lists(), params] as const,
  details: () => [...speciesKeys.all, "detail"] as const,
  detail: (id: string | number) => [...speciesKeys.details(), id] as const,
  ncbi: (id: string | number) => [...speciesKeys.detail(id), "ncbi"] as const,
  explore: (params: Record<string, unknown>) => [...speciesKeys.all, "explore", params] as const,
  outdated: (params: Record<string, unknown>) => [...speciesKeys.all, "outdated", params] as const,
};

export const changeRequestKeys = {
  all: ["changeRequests"] as const,
  lists: () => [...changeRequestKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...changeRequestKeys.lists(), params] as const,
  pendingCount: () => [...changeRequestKeys.all, "pendingCount"] as const,
};

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...userKeys.lists(), params] as const,
  totals: (search?: string) => [...userKeys.all, "totals", { search }] as const,
  me: () => [...userKeys.all, "me"] as const,
};
