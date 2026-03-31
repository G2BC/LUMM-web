import axios from "axios";
import i18n from "@/lib/i18n";

type BilingualErrorData = {
  message_pt?: string;
  message_en?: string;
};

/**
 * Extracts the localized error message from an Axios error response.
 * Reads `message_pt` or `message_en` based on the current i18n language.
 */
export function getLocalizedError(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data as BilingualErrorData | undefined;
  if (!data) return undefined;
  const isPt = i18n.language.startsWith("pt");
  return isPt ? data.message_pt : data.message_en;
}
