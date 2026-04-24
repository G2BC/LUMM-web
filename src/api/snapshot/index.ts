import { API } from "@/api";

export interface SnapshotDownloadResponse {
  url: string;
  expires_in_seconds: number;
  version: number;
  lang: string;
  format: string;
}

export async function fetchSnapshotDownloadUrl(
  lang: string,
  format: "xlsx" | "json",
  version?: number
): Promise<SnapshotDownloadResponse> {
  const params: Record<string, string | number> = { lang, format };
  if (version !== undefined) params.version = version;
  const { data } = await API.get<SnapshotDownloadResponse>("/snapshot/download", { params });
  return data;
}
