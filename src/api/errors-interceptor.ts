import axios, { type AxiosError } from "axios";
import { API } from ".";
import { Alert } from "@/components/alert";
import { shouldSilenceApiErrors } from "@/api/error-silencer";
import i18n from "@/lib/i18n";

type BilingualErrorData = {
  message_pt?: string;
  message_en?: string;
  detail?: string | string[];
  errors?: Record<string, string[] | string>;
};

function t(key: string) {
  return i18n.t(key);
}

function extractMessage(err: AxiosError<BilingualErrorData>): string | undefined {
  const data = err.response?.data;
  if (typeof data === "string") return data;

  const isPt = i18n.language.startsWith("pt");

  const candidates: Array<string | undefined> = [
    isPt ? data?.message_pt : data?.message_en,
    Array.isArray(data?.detail) ? data.detail.join("\n") : (data?.detail as string),
    data?.errors
      ? Object.entries(data.errors)
          .map(([field, msgs]) => `• ${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join("\n")
      : undefined,
  ];

  return candidates.find(Boolean);
}

type AlertOpts = {
  title: string;
  text?: string;
  icon?: "error" | "warning" | "info" | "success";
};

// Deduplication queue: identical errors (same title+text+icon) are merged into
// one entry; distinct errors are shown sequentially, one modal at a time.
// This replaces the previous time-based cooldown that silently dropped errors
// arriving within 1.2s of each other — including legitimately different errors.
const pendingAlerts = new Map<string, AlertOpts>();
let isAlertOpen = false;

function makeAlertKey(opts: AlertOpts): string {
  return `${opts.title}||${opts.text ?? ""}||${opts.icon ?? ""}`;
}

async function drainAlertQueue() {
  if (isAlertOpen || pendingAlerts.size === 0) return;

  const [[key, opts]] = pendingAlerts;
  pendingAlerts.delete(key);
  isAlertOpen = true;

  try {
    await Alert({ ...opts, confirmButtonText: t("errors.close") });
  } finally {
    isAlertOpen = false;
    void drainAlertQueue();
  }
}

function showOnce(opts: AlertOpts) {
  const key = makeAlertKey(opts);
  if (!pendingAlerts.has(key)) {
    pendingAlerts.set(key, opts);
  }
  void drainAlertQueue();
}

function showAlert(err: AxiosError<BilingualErrorData>) {
  if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
    return;
  }

  const status = err.response?.status;

  // Network errors — no response from server
  if (!status) {
    if (err.code === "ECONNABORTED") {
      return showOnce({
        title: t("errors.timeout"),
        icon: "warning",
        text: t("errors.timeout_text"),
      });
    }
    return showOnce({
      title: t("errors.no_connection"),
      icon: "error",
      text: t("errors.no_connection_text"),
    });
  }

  // Session expired (non-login 401)
  const isLoginRequest = (err.config?.url ?? "").includes("/auth/login");
  if (status === 401 && !isLoginRequest) {
    return showOnce({
      title: t("errors.session_expired"),
      icon: "warning",
      text: t("errors.session_expired_text"),
    });
  }

  // All other errors: generic title + message from API
  const icon = status >= 500 ? "error" : "warning";
  return showOnce({
    title: t("errors.occurred"),
    icon,
    text: extractMessage(err),
  });
}

let registered = false;

export function registerErrorInterceptor() {
  if (registered) return;

  API.interceptors.response.use(
    (res) => res,
    (error: AxiosError<BilingualErrorData>) => {
      if (shouldSilenceApiErrors()) {
        return Promise.reject(error);
      }

      if (typeof window !== "undefined") {
        showAlert(error);
      }
      return Promise.reject(error);
    }
  );

  registered = true;
}
